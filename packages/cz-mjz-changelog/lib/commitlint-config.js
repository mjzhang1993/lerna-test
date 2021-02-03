/**
 * commitlint 默认 rule 配置
 * https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
*/
const config = require('./config');
const {getAllPackages} = require('./tools');

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
    'scope-enum': async function () {
      // rule 中的 scope 相当于实际的 package
      const pkgs = await getAllPackages();
      const enums = pkgs.map(pkg => pkg.name && pkg.name.replace(/^@(\w|-)+\//, ''))
      console.log('++++++++++++');
      console.log(enums);
      console.log('++++++++++++');
      return [2, 'always', enums];
    },
    'scope-case': [2, 'always', 'lower-case'],
  },
}