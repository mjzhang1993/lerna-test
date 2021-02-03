/**
 * commitlint 默认 rule 配置
 * https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
*/
const config = require('./config');

module.exports = {
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'scope-case': [0, 'always', 'lower-case'],
    'subject-case': [
			2,
			'never',
			['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'type-enum': [2, 'always', config.typeChoices.map(o => o.value)],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100], // TODO: 待定
    'package-enum': [2, 'always',],
    'package-case': [2, 'always', 'lower-case'],
    'package-empty': [2, 'always', 'lower-case'],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (?:\[([\w\$\.\-\* ]*)\])? (.*)$/,
      headerCorrespondence: [type, package, scope, subject]
    }
  },
  plugins: [
    {
      rules: {
        'package-enum': function (parsed, when, value) {
          return [
            fasle,
            'you are fire'
          ]
        }
      }
    }
  ]
}