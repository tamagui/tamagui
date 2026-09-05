const path = require('node:path')

function getTypeScriptNativePath() {
  const packageName = `@typescript/typescript-${process.platform}-${process.arch}`
  const packagePath = require.resolve(`${packageName}/package.json`)
  return path.join(
    path.dirname(packagePath),
    'lib',
    process.platform === 'win32' ? 'tsc.exe' : 'tsc'
  )
}

module.exports = { getTypeScriptNativePath }
