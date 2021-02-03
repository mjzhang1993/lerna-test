/**
 * cz-mjz-changelog 配置
 * */
const path = require('path');
const fs = require('fs');
const componentDir = path.resolve(__dirname, 'packages/mjz-ui/src/components');
const cModuleNames = fs.readdirSync(path.resolve(componentDir)).filter((name) => !!/^[A-Z]\w*/.test(name));


// type(package): [scope] subject
module.exports = {
  scopeOverrides: {
    feat: {
      default: [
        {value: 'Project', name: 'Project:  🎉 Begin a project.'},
      ],
      'mjz-ui': cModuleNames,
    },
    fix: {
      default: [],
      'mjz-ui': cModuleNames,
    },
    refactor: {
      default: [],
      'mjz-ui': cModuleNames,
    },
    docs: {
      default: [],
    },
    test: {
      default: [],
    },
    chore: {
      default: [
        {value: 'CI',      name: 'CI:       👷 Add or update CI build system.'},
        {value: 'Format',  name: 'Format:   🎨 Improve structure / format of the code.'},
        {value: 'Upgrade', name: 'Upgrade:  ⬆️ Upgrade dependencies.'},
        {value: 'Build',   name: 'Build:    🏗 Update scripts or configuration files.'},
      ],
    }
  },
}
