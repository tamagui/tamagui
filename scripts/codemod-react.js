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
  const importDeclarations = []
  let hasNonTypeImports = false

  // Collect imported names from 'react' and track renamings
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'react') {
        let hasTypeImports = false
        let hasNonTypeImportsLocal = false

        if (path.node.importKind === 'type') {
          return
        }

        path.node.specifiers.forEach((specifier) => {
          if (specifier.importKind === 'type') {
            hasTypeImports = true
          } else {
            hasNonTypeImports = true
            hasNonTypeImportsLocal = true
            if (specifier.imported) {
              importedNames.set(specifier.local.name, specifier.imported.name)
            } else if (specifier.local) {
              importedNames.set(specifier.local.name, 'default')
            }
          }
        })

        if (hasNonTypeImportsLocal) {
          importDeclarations.push({ path, hasTypeImports })
        }
      }
    },
  })

  // If the file only contains type imports from 'react', skip transformation
  if (!hasNonTypeImports) {
    return source
  }

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

  // Remove the original import statements for non-type specifiers from 'react'
  importDeclarations.forEach(({ path, hasTypeImports }) => {
    if (hasTypeImports) {
      path.node.specifiers = path.node.specifiers.filter(
        (specifier) => specifier.importKind === 'type'
      )
      if (path.node.specifiers.length === 0) {
        path.remove()
      }
    } else {
      path.remove()
    }
  })

  // Add import React from 'react' if it doesn't already exist
  const reactImportExists = ast.program.body.some(
    (node) =>
      t.isImportDeclaration(node) &&
      node.source.value === 'react' &&
      node.specifiers.some((specifier) => specifier.local.name === 'React')
  )
  if (!reactImportExists) {
    const reactImport = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier('React'))],
      t.stringLiteral('react')
    )
    ast.program.body.unshift(reactImport)
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
      if (file.includes('code/bento')) {
        console.log(`Skipping file in code/bento: ${file}`)
        return
      }
      console.log(`Processing file: ${file}`)
      const source = fs.readFileSync(file, 'utf-8')
      if (source.includes("import * as React from 'react'")) {
        console.log(`Skipping file (namespace import): ${file}`)
        return
      }
      if (source.includes("import React from 'react'")) {
        console.log(`Skipping file (correct React import): ${file}`)
        return
      }
      if (!source.includes("from 'react'")) {
        console.log(`Skipping file (no React import): ${file}`)
        return
      }
      if (source.includes('import type')) {
        const lines = source.split('\n')
        const reactImports = lines.filter(
          (line) => line.startsWith('import type') && line.includes("from 'react'")
        )
        if (reactImports.length > 0) {
          console.log(`Skipping file (only type imports): ${file}`)
          return
        }
      }
      try {
        const transformed = transform(source)
        if (transformed !== source) {
          fs.writeFileSync(file, transformed)
          console.log(`File transformed successfully: ${file}`)
        } else {
          console.log(`Skipping file (no transformations needed): ${file}`)
        }
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
