'use strict'

const compareFunc = require('compare-func')
const Q = require('q')
const _ = require('lodash');
const readFile = Q.denodeify(require('fs').readFile)
const resolve = require('path').resolve
const addBangNotes = require('./add-bang-notes')
const {functionify, sequenceArray} = require('./tools')

module.exports = function (config) {
  return Q.all([
    readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/references.hbs'), 'utf-8')
  ])
    .spread((template, header, commit, footer, references) => {
      const writerOpts = getWriterOpts(config)
      
      // 重置 handlebars 模板
      writerOpts.mainTemplate = template
      writerOpts.headerPartial = header
      writerOpts.commitPartial = commit
      writerOpts.footerPartial = footer
      writerOpts.partials = {
        references: references
      }
  
      return writerOpts
    })
}

function getWriterOpts (config) {
  config = mergeDefaultConfig(config);
  const typesMap = config.types.reduce((map, c) => ({...map, [c.type]: c}), {});
  const scopeSequenceMap = Array.isArray(config.scopeSequence) 
    ? config.scopeSequence.reduce((map, s) => {
      return _.isString(s) ? {...map, [s.replace(/^@(\w|-)+\//, '')]: s} : map;
    }, {})
    : {}
  return {
    // 给每一次 commit 做前期转换
    transform: (commit, context) => {
      let discard = true
      const issues = []
      
      // adds additional breaking change notes
      // for the special case, test(system)!: hello world, where there is
      // a '!' but no 'BREAKING CHANGE' in body:
      addBangNotes(commit)
      commit.notes.forEach(note => {
        note.title = '💥 BREAKING CHANGES'
        discard = false
      })
      const entry = typesMap[commit.type];

      // breaking changes attached to any type are still displayed.
      if (discard && (!entry || entry.hidden)) return;

      if (commit.scope === '*') {
        commit.scope = ''
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      if (typeof commit.subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl
        if (url) {
          url = `${url}/issues/`
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue)
            return `[#${issue}](${url}${issue})`
          })
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
            if (username.includes('/')) {
              return `@${username}`
            }

            return `[@${username}](${context.host}/${username})`
          })
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.issue) === -1) {
          return true
        }

        return false
      })

      return commit
    },
    // 数据再传递给 handlebars 模板渲染前，最后一次处理机会
    finalizeContext(context) {
      const {typeSequence} = config;
      const isSubPackage = !_.get(context, 'packageData.workspaces');
      // TODO: scopeGroup.title 如何处理 npm scope 的命名（@mjz-test/core） 需要提出一个公共的方法
      if (isSubPackage) {
        const subPkgName = (_.get(context, 'packageData.name') || '').replace(/^@(\w|-)+\//, '');
        const subPkgCommitGroups = {
          [subPkgName]: {title: '', commits: []}, // title = '' 可以不显示 scope
          others: {title: '👽 Other Effect', commits: []}
        };
        context.commitGroups.forEach(scopeGroup => {
          if (!Array.isArray(scopeGroup.commits)) return;
          
          subPkgCommitGroups[scopeGroup.title === subPkgName ? subPkgName : 'others'].commits.push(...scopeGroup.commits);
        });

        context.commitGroups = [
          subPkgCommitGroups[subPkgName],
          subPkgCommitGroups.others
        ];
      }

      context.commitGroups = context.commitGroups.map((scopeGroup) => {
        const commits = scopeGroup.commits;
        const preTypeGroup = sequenceArray(commits, typeSequence, (commit) => commit.type);
        
        const typeGroups = preTypeGroup.map(typeCommits => {
          const type = _.get(typeCommits, '[0].type') || '';
          const entry = typesMap[type] || {};
          return {
            type: type, 
            typeSection: _.get(entry, 'section') || '',
            commits: typeCommits.sort(functionify(config.commitsSort))
          };
        })
        
        return {
          title: isSubPackage ? scopeGroup.title : (scopeSequenceMap[scopeGroup.title] || scopeGroup.title || '👽 Other Effect'),
          typeGroups
        }
      });

      // TODO: version compare 处理还有点问题
      // context.linkCompare = true;
      
      context.scopeDivider = '-------';

      return context;
    },
    // 排序的依据, 其值需要是 commit 对象上包含的的属性（commit 对象上的属性可以通过 transform 添加）
    groupBy: 'scope',
    commitGroupsSort(a, b) {
      // title 即为 groupBy 的值
      const {scopeSequence} = config;
      
      let idxA = scopeSequence.indexOf(scopeSequenceMap[a.title] || a.title)
      let idxB = scopeSequence.indexOf(scopeSequenceMap[b.title] || b.title)
      return idxA >= idxB ? -1 : 1;
    },
    commitsSort: config.commitsSort,
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}

function mergeDefaultConfig(config) {
  return {
    types: [
      { type: 'feat',     section: '✨ Features'},
      { type: 'fix',      section: '🐛 Bug Fixes'},
      { type: 'docs',     section: '📖 Documentation'},
      { type: 'refactor', section: '🔨 Code Refactoring'},
      { type: 'test',     section: '🚨 Tests', hidden: true },
      { type: 'chore',    section: '🔧 Miscellaneous Chores', hidden: true},
      { type: 'revert',   section: '⏪ Reverts'},
    ],
    commitsSort: ['subScope', 'subject'],
    scopeSequence: [],
    typeSequence: ['feat', 'fix', 'refactor', 'docs'],
    ...(config || {})
  };
}
