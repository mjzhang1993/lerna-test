/**
 * commit message 命令行问题
 * */
function autoCompleteSource(options) {
  return (answersSoFar, input) => {
    return new Promise((resolve) => {
      const matches = options.filter(({ name }) => (!input || name.toLowerCase().indexOf(input.toLowerCase()) === 0));
      resolve(
        matches
      );
    });
  };
}

module.exports = (allPackages, changedPackages, config) => ([
  {
    name: 'type',
    message: 'Select the TYPE of change that you\'re committing:',
    choices: config.typeChoices,
    type: 'autocomplete',
    source: autoCompleteSource(config.typeChoices),
  },
  {
    type: 'list',
    name: 'package',
    choices() {
      const pkgs =  changedPackages.map((pkgName) => {
        return {value: pkgName.replace(/^@(\w|-)+\//, ''), name: pkgName};
      });
      return [{value: false, name: 'empty'}, ...pkgs];
    },
    message: 'Select the PACKAGE with the more significant changes (optional):',
  },
  {
    type: 'list',
    name: 'scope',
    message: '\nDenote the SCOPE of this change (optional):',
    choices(answers) {
      let scopes = [
        { value: false,    name: 'empty:   🩹 Do not need to select the Scope option' },
        { value: 'custom', name: 'custom   📝 Customize the value of Scope' },
      ];
      const typeOverrides = config.scopeOverrides && config.scopeOverrides[answers.type] || {};
      const defaultOverrides = typeOverrides.default || [];
      const pkgOverrides = typeOverrides[answers.package] || [];

      return [...scopes, ...defaultOverrides, ...pkgOverrides];
    },
  },
  {
    type: 'input',
    name: 'scope',
    message: '\nDenote the SCOPE of this change:',
    when(answers) {
      return answers.scope === 'custom';
    },
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    validate(value) {
      const limit = config.subjectLimit || 100;
      if (value.length > limit) {
        return `Exceed limit: ${limit}`;
      }
      return !!value;
    },
    filter(value) {
      const upperCaseSubject = config.upperCaseSubject || false;

      return (upperCaseSubject ? value.charAt(0).toUpperCase() : value.charAt(0).toLowerCase()) + value.slice(1);
    },
  },
  {
    type: 'input',
    name: 'body',
    message: `Provide a LONGER description of the change (optional). Use "${config.breakLineChar}" to break new line:\n`
  },
  {
    type: 'input',
    name: 'breaking',
    message: 'List any BREAKING CHANGES (optional):\n',
  },
  {
    type: 'input',
    name: 'footer',
    message: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
  },
  {
    type: 'checkbox',
    name: 'packages',
    'default': changedPackages,
    choices: allPackages,
    message: `The packages that this commit has affected (${changedPackages.length} detected)\n`,
  },
]);

