const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generate = require('@babel/generator').default
const glob = require('glob')

// Check if the --loose flag is provided
const isLoose = process.argv.includes('--loose')

// Babel parser with TypeScript and JSX plugins
const parser = {
  parse(source) {
    return babelParser.parse(source, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })
  },
}

// Transform function
const transform = (source) => {
  const ast = parser.parse(source)
  const importedNames = new Map()
  const typeImports = new Set()
  const importDeclarations = []

  // Collect imported names from 'react' and track renamings
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'react') {
        importDeclarations.push(path)
        path.node.specifiers.forEach((specifier) => {
          if (t.isImportSpecifier(specifier)) {
            if (specifier.importKind === 'type') {
              typeImports.add(specifier.local.name)
            } else {
              importedNames.set(specifier.local.name, specifier.imported.name)
            }
          } else if (t.isImportDefaultSpecifier(specifier)) {
            importedNames.set(specifier.local.name, 'default')
          } else if (t.isImportNamespaceSpecifier(specifier)) {
            importedNames.set(specifier.local.name, '*')
          }
        })
      }
    },
  })

  // Replace usage of imports from 'react' with React.*
  traverse(ast, {
    Identifier(path) {
      const binding = path.scope.getBinding(path.node.name)

      if (
        binding &&
        binding.kind === 'module' &&
        binding.path.parent.source &&
        binding.path.parent.source.value === 'react'
      ) {
        const importedName = importedNames.get(path.node.name)

        if (
          !t.isMemberExpression(path.parent) &&
          !t.isImportSpecifier(path.parent) &&
          !t.isImportDefaultSpecifier(path.parent) &&
          !t.isProperty(path.parent) && // Avoid transforming object destructuring
          !t.isObjectPattern(path.parent) && // Avoid transforming object patterns
          !t.isTSTypeReference(path.parent) && // Avoid transforming TypeScript type references
          !(
            t.isTSTypeReference(path.parentPath.parent) &&
            path.parentPath.key === 'typeName'
          ) && // Avoid transforming type names
          !t.isJSXAttribute(path.parent) && // Avoid transforming JSX attributes
          !t.isImportNamespaceSpecifier(path.parent) // Avoid transforming import namespace specifiers
        ) {
          const newNode = t.memberExpression(
            t.identifier('React'),
            t.identifier(importedName === 'default' ? path.node.name : importedName)
          )
          path.replaceWith(newNode)
        }
      }
    },
  })

  // Remove the original import statements for 'react'
  importDeclarations.forEach((path) => path.remove())

  // Add import React from 'react'
  const reactImport = t.importDeclaration(
    [t.importNamespaceSpecifier(t.identifier('React'))],
    t.stringLiteral('react')
  )
  ast.program.body.unshift(reactImport)

  // Add type imports back as a separate import statement
  if (typeImports.size > 0) {
    const typeImportDeclaration = t.importDeclaration(
      Array.from(typeImports).map((typeImport) =>
        t.importSpecifier(t.identifier(typeImport), t.identifier(typeImport))
      ),
      t.stringLiteral('react')
    )
    typeImportDeclaration.importKind = 'type'
    ast.program.body.unshift(typeImportDeclaration)
  }

  const output = generate(ast, {
    quotes: 'single',
    retainFunctionParens: true,
    retainLines: true,
    retainAllComments: true,
    compact: false,
  })

  return output.code
}

// Get list of all workspaces
const workspacesOutput = execSync('yarn workspaces list --json')
  .toString()
  .trim()
  .split('\n')
const workspaces = workspacesOutput.map((line) => JSON.parse(line))

// Iterate over each workspace and run the codemod
workspaces.forEach((workspace) => {
  const srcPath = path.join(workspace.location, 'src') // assuming code is in `src` directory
  if (fs.existsSync(srcPath)) {
    console.log(`Running codemod in ${workspace.name} at ${srcPath}`)
    const files = glob.sync(`${srcPath}/**/*.{ts,tsx}`)
    files.forEach((file) => {
      console.log(`Processing file: ${file}`)
      const source = fs.readFileSync(file, 'utf-8')
      if (source.includes("import React from 'react'")) {
        console.log(`Skipping file (correct React import): ${file}`)
        return
      }
      if (!source.includes("from 'react'")) {
        console.log(`Skipping file (no React import): ${file}`)
        return
      }
      try {
        const transformed = transform(source)
        fs.writeFileSync(file, transformed)
        console.log(`File transformed successfully: ${file}`)
      } catch (error) {
        console.error(`Error processing file ${file}:`, error)
        if (!isLoose) {
          process.exit(1)
        }
      }
    })
  } else {
    console.log(`No src directory found in ${workspace.name}`)
  }
})
