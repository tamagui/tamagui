const path = require('node:path')

function getTypeScriptPath() {
  const packagePath = require.resolve('typescript/package.json')
  return path.join(path.dirname(packagePath), 'bin', 'tsc')
}

module.exports = { getTypeScriptPath }
