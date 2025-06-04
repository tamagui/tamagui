import { existsSync, lstatSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'

export default function fullySpecifyCommonJS(api: any): babel.PluginObj {
  api.assertVersion(7)

  return {
    name: 'babel-plugin-fully-specified-cjs',
    visitor: {
      CallExpression(path, state) {
        const callee = path.get('callee')

        if (
          callee.isIdentifier({ name: 'require' }) &&
          path.node.arguments.length === 1
        ) {
          const arg = path.node.arguments[0]
          if (arg.type === 'StringLiteral') {
            let moduleSpecifier = arg.value

            // Skip built-in modules and node_modules
            if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {
              const filePath = state.file.opts.filename
              if (!filePath) return // Cannot determine file path

              const fileDir = dirname(filePath)
              const cjsExtension = '.cjs'
              const jsExtension = '.js'

              // Check if moduleSpecifier already has an extension
              if (!extname(moduleSpecifier)) {
                const resolvedPath = resolve(fileDir, moduleSpecifier)
                let newModuleSpecifier = moduleSpecifier

                // Check if the moduleSpecifier is a directory with an index.cjs file
                if (isLocalDirectory(resolvedPath)) {
                  const indexPath = resolve(resolvedPath, 'index' + jsExtension)
                  if (existsSync(indexPath)) {
                    // Append '/' if not present
                    if (!newModuleSpecifier.endsWith('/')) {
                      newModuleSpecifier += '/'
                    }
                    newModuleSpecifier += 'index' + cjsExtension
                    arg.value = newModuleSpecifier
                    return
                  }
                }

                // Check if the moduleSpecifier.cjs file exists
                const filePathWithJs = resolvedPath + jsExtension
                if (existsSync(filePathWithJs)) {
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
  } satisfies babel.PluginObj
}

function isLocalDirectory(absolutePath) {
  return existsSync(absolutePath) && lstatSync(absolutePath).isDirectory()
}
