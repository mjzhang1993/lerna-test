'use strict'

module.exports = function (config) {
  config = defaultConfig(config)
  return {
    headerPattern: /^(\w*)(?:\((.*)\))?!?: (?:\[([a-zA-Z0-9_\-]*)\])?(.*)$/,
    breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (?:\[([a-zA-Z0-9_\-]*)\])?(.*)$/,
    headerCorrespondence: [
      'type',
      'scope',
      'subScope',
      'subject'
    ],
    noteKeywords: ['BREAKING CHANGE'],
    revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash'],
    issuePrefixes: config.issuePrefixes
  }
}

// merge user set configuration with default configuration.
function defaultConfig (config) {
  config = config || {}
  config.issuePrefixes = config.issuePrefixes || ['#']
  return config
}