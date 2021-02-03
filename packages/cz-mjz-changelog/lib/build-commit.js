const wrap = require('word-wrap');

const defaultMaxLineWidth = 100;

const addType = (type, config) => {
  const prefix = config.typePrefix || '';
  const suffix = config.typeSuffix || '';

  return `${prefix}${type}${suffix}`.trim();
};

const addPackage = (package, config) => {
  const separator = config.subjectSeparator;
  if (!package) return separator;

  return `(${package.trim()})${separator}`;
}

const addScope = (scope) => {
  if (!scope) return '';

  return `[${scope.trim()}] `; // 有空格
};

const addSubject = subject => subject && subject.trim();

const addBreakLinesIfNeeded = (value, breakLineChar) =>
  value
    .split(breakLineChar)
    .join('\n')
    .valueOf();

const addFooter = (footer, config) => {
  if (config && config.footerPrefix === '') return `\n\n${footer}`;

  return `\n\n${config.footerPrefix} ${addBreakLinesIfNeeded(footer, config.breakLineChar)}`;
};

const escapeSpecialChars = result => {
  const specialChars = ['`'];

  let newResult = result;
  specialChars.map(item => {
    // If user types "feat: `string`", the commit preview should show "feat: `\string\`".
    // Don't worry. The git log will be "feat: `string`"
    newResult = result.replace(new RegExp(item, 'g'), '\\`');
  });
  return newResult;
};

module.exports = (answers, config) => {
  const wrapOptions = {
    trim: true,
    newline: '\n',
    indent: '',
    width: defaultMaxLineWidth,
  };
  // 减去 scope 的宽度
  const subjectLimit = config.subjectLimit - 2 - (answers.scope && answers.scope.length || 0);
  const head = [
    addType(answers.type, config),
    addPackage(answers.package, config),
    addScope(answers.scope),
    addSubject(answers.subject.slice(0, subjectLimit)),
  ].join('');

  // Wrap these lines at 100 characters
  let body = wrap(answers.body, wrapOptions) || '';
  body = addBreakLinesIfNeeded(body, config.breakLineChar);

  const breaking = wrap(answers.breaking, wrapOptions);
  const footer = wrap(answers.footer, wrapOptions);

  let result = head;
  if (body) {
    result += `\n\n${body}`;
  }
  if (breaking) {
    result += `\n\n${config.breakingPrefix}\n${breaking}`;
  }
  if (footer) {
    result += addFooter(footer, config);
  }

  return escapeSpecialChars(result);
};
