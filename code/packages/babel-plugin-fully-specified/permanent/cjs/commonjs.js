var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames
var __hasOwnProp = Object.prototype.hasOwnProperty
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true })
}
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        })
  }
  return to
}
var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod)
var commonjs_exports = {}
__export(commonjs_exports, {
  default: () => fullySpecifyCommonJS,
})
module.exports = __toCommonJS(commonjs_exports)
var import_node_fs = require('node:fs')
var import_node_path = require('node:path')
function fullySpecifyCommonJS(api, options) {
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
            if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {
              const filePath = state.file.opts.filename
              if (!filePath) return
              const fileDir = (0, import_node_path.dirname)(filePath)
              const cjsExtension = options.esExtensionDefault || '.cjs'
              const jsExtension = '.js'
              const specifierExtension = (0, import_node_path.extname)(moduleSpecifier)
              const hasModuleExtension = [
                '.js',
                '.cjs',
                '.mjs',
                '.json',
                '.node',
              ].includes(specifierExtension)
              if (!hasModuleExtension) {
                const resolvedPath = (0, import_node_path.resolve)(
                  fileDir,
                  moduleSpecifier
                )
                let newModuleSpecifier = moduleSpecifier
                if (isLocalDirectory(resolvedPath)) {
                  const indexPath = (0, import_node_path.resolve)(
                    resolvedPath,
                    'index' + jsExtension
                  )
                  if ((0, import_node_fs.existsSync)(indexPath)) {
                    if (!newModuleSpecifier.endsWith('/')) {
                      newModuleSpecifier += '/'
                    }
                    newModuleSpecifier += 'index' + cjsExtension
                    arg.value = newModuleSpecifier
                    return
                  }
                }
                if (
                  (0, import_node_fs.existsSync)(resolvedPath + jsExtension) ||
                  (0, import_node_fs.existsSync)(resolvedPath + cjsExtension)
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
  return (
    (0, import_node_fs.existsSync)(absolutePath) &&
    (0, import_node_fs.lstatSync)(absolutePath).isDirectory()
  )
}
//# sourceMappingURL=commonjs.js.map
