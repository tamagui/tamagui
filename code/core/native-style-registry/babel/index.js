/**
 * Babel plugin to replace react-native View/Text with TamaguiStyleRegistry wrapped versions.
 * This ensures ALL views are registered for atomic theme updates (no tearing).
 *
 * Similar to Unistyles' approach - intercept at import level.
 *
 * Usage in babel.config.js:
 *   plugins: ['@tamagui/native-style-registry/babel']
 */

const COMPONENTS_TO_WRAP = ['View', 'Text', 'ScrollView', 'Pressable', 'TouchableOpacity']

module.exports = function tamaguiStyleRegistryBabelPlugin({ types: t }) {
  return {
    name: 'tamagui-style-registry',
    visitor: {
      ImportDeclaration(path, state) {
        const source = path.node.source.value

        // only process react-native imports
        if (source !== 'react-native') {
          return
        }

        // check if file is in node_modules (skip if so, unless explicitly included)
        const filename = state.filename || ''
        if (filename.includes('node_modules') && !state.opts?.includeNodeModules) {
          return
        }

        const specifiersToReplace = []
        const remainingSpecifiers = []

        path.node.specifiers.forEach(specifier => {
          if (
            t.isImportSpecifier(specifier) &&
            t.isIdentifier(specifier.imported) &&
            COMPONENTS_TO_WRAP.includes(specifier.imported.name)
          ) {
            specifiersToReplace.push({
              local: specifier.local.name,
              imported: specifier.imported.name,
            })
          } else {
            remainingSpecifiers.push(specifier)
          }
        })

        if (specifiersToReplace.length === 0) {
          return
        }

        // update the original import to remove wrapped components
        if (remainingSpecifiers.length > 0) {
          path.node.specifiers = remainingSpecifiers
        } else {
          // remove the entire import if nothing left
          path.remove()
        }

        // add imports from @tamagui/native-style-registry/components
        specifiersToReplace.forEach(({ local, imported }) => {
          const newImport = t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(local))],
            t.stringLiteral(`@tamagui/native-style-registry/components/${imported}`)
          )
          // insert at beginning of program
          path.insertBefore(newImport)
        })
      },
    },
  }
}
