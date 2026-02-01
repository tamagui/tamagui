/**
 * Babel plugin for native style optimization.
 *
 * Two modes:
 * 1. inlineRCT: true (default) - transforms <View> to createElement('RCTView', ...) inline
 *    ~30% faster than regular View by bypassing View.js overhead
 *
 * 2. inlineRCT: false - swaps View/Text imports with wrapped registry components
 *    for zero-re-render theme switching via native module
 *
 * Usage in babel.config.js:
 *   plugins: [
 *     ['@tamagui/native-style-registry/babel', { inlineRCT: true }]
 *   ]
 */

// maps RN component names to their native equivalents
const RCT_MAPPINGS = {
  View: 'RCTView',
  Text: 'RCTText',
  // these don't have direct RCT equivalents, use wrapper mode
  // ScrollView: 'RCTScrollView',
  // Pressable: needs gesture handling
  // TouchableOpacity: needs animation
}

const COMPONENTS_TO_WRAP = ['View', 'Text', 'ScrollView', 'Pressable', 'TouchableOpacity']

module.exports = function tamaguiStyleRegistryBabelPlugin({ types: t }) {
  return {
    name: 'tamagui-style-registry',
    visitor: {
      // track react-native imports for JSX transformation
      ImportDeclaration(path, state) {
        const source = path.node.source.value

        if (source !== 'react-native') {
          return
        }

        // skip node_modules unless explicitly included
        const filename = state.filename || ''
        if (filename.includes('node_modules') && !state.opts?.includeNodeModules) {
          return
        }

        const inlineRCT = state.opts?.inlineRCT !== false // default true

        if (inlineRCT) {
          // track which local names map to which RN components for JSX transformation
          state.file.rnImportMap = state.file.rnImportMap || {}

          path.node.specifiers.forEach(specifier => {
            if (
              t.isImportSpecifier(specifier) &&
              t.isIdentifier(specifier.imported)
            ) {
              const importedName = specifier.imported.name
              const localName = specifier.local.name

              if (RCT_MAPPINGS[importedName]) {
                state.file.rnImportMap[localName] = {
                  imported: importedName,
                  rct: RCT_MAPPINGS[importedName],
                }
              }
            }
          })

          // ensure React is imported for createElement
          if (Object.keys(state.file.rnImportMap).length > 0) {
            state.file.needsReact = true
          }
        } else {
          // wrapper mode - swap imports
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

          if (remainingSpecifiers.length > 0) {
            path.node.specifiers = remainingSpecifiers
          } else {
            path.remove()
          }

          specifiersToReplace.forEach(({ local, imported }) => {
            const newImport = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(local))],
              t.stringLiteral(`@tamagui/native-style-registry/components/${imported}`)
            )
            path.insertBefore(newImport)
          })
        }
      },

      // add React import if needed for createElement
      Program: {
        exit(path, state) {
          if (!state.file.needsReact) return

          // check if React is already imported
          let hasReactImport = false
          let reactIdentifier = null

          path.node.body.forEach(node => {
            if (t.isImportDeclaration(node) && node.source.value === 'react') {
              hasReactImport = true
              // find the default import name
              node.specifiers.forEach(spec => {
                if (t.isImportDefaultSpecifier(spec)) {
                  reactIdentifier = spec.local.name
                }
              })
            }
          })

          if (!hasReactImport) {
            // add: import React from 'react'
            const reactImport = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('_React'))],
              t.stringLiteral('react')
            )
            path.node.body.unshift(reactImport)
            state.file.reactName = '_React'
          } else {
            state.file.reactName = reactIdentifier || 'React'
          }
        }
      },

      // transform JSX to createElement('RCTView', ...)
      JSXElement(path, state) {
        const inlineRCT = state.opts?.inlineRCT !== false
        if (!inlineRCT) return

        const rnImportMap = state.file.rnImportMap || {}
        const openingElement = path.node.openingElement

        // get the component name
        if (!t.isJSXIdentifier(openingElement.name)) return

        const componentName = openingElement.name.name
        const mapping = rnImportMap[componentName]

        if (!mapping) return

        const rctName = mapping.rct
        const reactName = state.file.reactName || 'React'

        // convert JSX attributes to object properties
        const props = []
        openingElement.attributes.forEach(attr => {
          if (t.isJSXAttribute(attr)) {
            const name = attr.name.name
            let value

            if (attr.value === null) {
              // boolean shorthand: <View disabled /> -> { disabled: true }
              value = t.booleanLiteral(true)
            } else if (t.isJSXExpressionContainer(attr.value)) {
              value = attr.value.expression
            } else if (t.isStringLiteral(attr.value)) {
              value = attr.value
            } else {
              value = attr.value
            }

            props.push(t.objectProperty(t.identifier(name), value))
          } else if (t.isJSXSpreadAttribute(attr)) {
            props.push(t.spreadElement(attr.argument))
          }
        })

        // convert children
        const children = path.node.children
          .filter(child => {
            // filter out whitespace-only text
            if (t.isJSXText(child)) {
              return child.value.trim() !== ''
            }
            return true
          })
          .map(child => {
            if (t.isJSXText(child)) {
              return t.stringLiteral(child.value.trim())
            }
            if (t.isJSXExpressionContainer(child)) {
              return child.expression
            }
            return child
          })

        // build: React.createElement('RCTView', { ...props }, ...children)
        const createElementArgs = [
          t.stringLiteral(rctName),
          props.length > 0 ? t.objectExpression(props) : t.nullLiteral(),
        ]

        if (children.length > 0) {
          createElementArgs.push(...children)
        }

        const createElementCall = t.callExpression(
          t.memberExpression(
            t.identifier(reactName),
            t.identifier('createElement')
          ),
          createElementArgs
        )

        path.replaceWith(createElementCall)
      },
    },
  }
}
