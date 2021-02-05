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
    readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8')
  ])
    .spread((template, header, commit, footer) => {
      const writerOpts = getWriterOpts(config)
      
      // 重置 handlebars 模板
      writerOpts.mainTemplate = template
      writerOpts.headerPartial = header
      writerOpts.commitPartial = commit
      writerOpts.footerPartial = footer
  
      return writerOpts
    })
}

function getWriterOpts (config) {
  config = mergeDefaultConfig(config);
  const typesMap = config.types.reduce((map, c) => ({...map, [c.type]: c}), {});
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
        note.title = 'BREAKING CHANGES'
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
      context.commitGroups = context.commitGroups.map((scopeGroup) => {
        const commits = scopeGroup.commits;
        const preTypeGroup = sequenceArray(commits, typeSequence, (commit) => commit.type);
        
        const typeGroups = preTypeGroup.map(typeCommits => {
          return {
            type: _.get(typeCommits, '[0].type') || '', 
            commits: typeCommits.sort(functionify(config.commitsSort))
          };
        })
        
        return {
          title: scopeGroup.title,
          // commits,
          typeGroups
        }
      });


      return context;
    },
    // 排序的依据, 其值需要是 commit 对象上包含的的属性（commit 对象上的属性可以通过 transform 添加）
    groupBy: 'scope',
    commitGroupsSort(a, b) {
      // title 即为 groupBy 的值
      const {scopeSequence} = config;
      
      let str1 = scopeSequence.indexOf(a.title)
      let str2 = scopeSequence.indexOf(b.title)
      
      if (str1 < 0 && str2 < 0) return 0;
      if (str1 < 0) return 1;
      if (str2 < 0) return -1;

      return str1 - str2;
    },
    commitsSort: config.commitsSort,
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}

function mergeDefaultConfig(config) {
  return {
    types: [
      { type: 'feat',     section: 'feat:     ✨ Features'},
      { type: 'fix',      section: 'fix:      🐛 Bug Fixes'},
      { type: 'docs',     section: 'docs:     📖 Documentation'},
      { type: 'refactor', section: 'refactor: 🔨 Code Refactoring'},
      { type: 'test',     section: 'test:     🚨 Tests', hidden: true },
      { type: 'chore',    section: 'chore:    🔧 Miscellaneous Chores', hidden: true},
      { type: 'revert',   section: 'revert:   ⏪ Reverts'},
    ],
    commitsSort: ['subScope', 'subject'],
    scopeSequence: [],
    typeSequence: ['feat', 'fix', 'refactor', 'docs'],
    ...(config || {})
  };
}
