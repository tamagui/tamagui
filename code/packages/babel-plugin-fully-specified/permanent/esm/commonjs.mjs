import { existsSync, lstatSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
function fullySpecifyCommonJS(api, options) {
  api.assertVersion(7)
  return {
    name: 'babel-plugin-fully-specified-cjs',
    visitor: {
      CallExpression(path, state) {
        const callee = path.get('callee')
        if (
          callee.isIdentifier({
            name: 'require',
          }) &&
          path.node.arguments.length === 1
        ) {
          const arg = path.node.arguments[0]
          if (arg.type === 'StringLiteral') {
            let moduleSpecifier = arg.value
            if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {
              const filePath = state.file.opts.filename
              if (!filePath) return
              const fileDir = dirname(filePath)
              const cjsExtension = options.esExtensionDefault || '.cjs'
              const jsExtension = '.js'
              const specifierExtension = extname(moduleSpecifier)
              const hasModuleExtension = [
                '.js',
                '.cjs',
                '.mjs',
                '.json',
                '.node',
              ].includes(specifierExtension)
              if (!hasModuleExtension) {
                const resolvedPath = resolve(fileDir, moduleSpecifier)
                let newModuleSpecifier = moduleSpecifier
                if (isLocalDirectory(resolvedPath)) {
                  const indexPath = resolve(resolvedPath, 'index' + jsExtension)
                  if (existsSync(indexPath)) {
                    if (!newModuleSpecifier.endsWith('/')) {
                      newModuleSpecifier += '/'
                    }
                    newModuleSpecifier += 'index' + cjsExtension
                    arg.value = newModuleSpecifier
                    return
                  }
                }
                if (
                  existsSync(resolvedPath + jsExtension) ||
                  existsSync(resolvedPath + cjsExtension)
                ) {
                  newModuleSpecifier += cjsExtension
                  arg.value = newModuleSpecifier
                  return
                }
              }
            }
          }
        }
      },
    },
  }
}
function isLocalDirectory(absolutePath) {
  return existsSync(absolutePath) && lstatSync(absolutePath).isDirectory()
}
export { fullySpecifyCommonJS as default }
//# sourceMappingURL=commonjs.mjs.map
