const fs = require('fs')
const path = require('path')
const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generate = require('@babel/generator').default
const glob = require('glob')

const roots = process.argv.slice(2)

if (!roots.length) {
  console.error('usage: node scripts/codemod-sheet-v3.js <file-or-directory> [...]')
  process.exit(1)
}

const surfaceProps = new Set([
  'background',
  'backgroundColor',
  'bg',
  'borderRadius',
  'br',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'disableHideBottomOverflow',
  'elevation',
  'overflow',
])

function isSurfaceProp(name) {
  return surfaceProps.has(name) || name.startsWith('shadow')
}

function isSheetObject(node) {
  if (t.isJSXIdentifier(node)) {
    return node.name === 'Sheet' || node.name.endsWith('Sheet')
  }

  return t.isJSXMemberExpression(node) && node.property.name === 'Sheet'
}

function isSheetObjectExpression(node) {
  if (t.isIdentifier(node)) {
    return node.name === 'Sheet' || node.name.endsWith('Sheet')
  }

  return t.isMemberExpression(node) && t.isIdentifier(node.property, { name: 'Sheet' })
}

function isSheetFrameName(node) {
  return (
    t.isJSXMemberExpression(node) &&
    node.property.name === 'Frame' &&
    isSheetObject(node.object)
  )
}

function isSheetFrameExpression(node) {
  return (
    t.isMemberExpression(node) &&
    t.isIdentifier(node.property, { name: 'Frame' }) &&
    isSheetObjectExpression(node.object)
  )
}

function hasBackgroundChild(children, object) {
  return children.some((child) => {
    if (!t.isJSXElement(child)) return false
    const name = child.openingElement.name
    return (
      t.isJSXMemberExpression(name) &&
      name.property.name === 'Background' &&
      generate(name.object).code === generate(object).code
    )
  })
}

function makeBackgroundElement(object, attributes) {
  const name = t.jsxMemberExpression(t.cloneNode(object), t.jsxIdentifier('Background'))
  return t.jsxElement(t.jsxOpeningElement(name, attributes, true), null, [], true)
}

function transform(source, file) {
  const ast = babelParser.parse(source, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  })

  let changed = false

  traverse(ast, {
    CallExpression(path) {
      if (!isSheetFrameExpression(path.node.arguments[0])) return
      console.warn(`${file}: styled Sheet.Frame requires manual migration`)
    },

    JSXElement(path) {
      const opening = path.node.openingElement
      const closing = path.node.closingElement
      if (!isSheetFrameName(opening.name)) return

      const frameName = opening.name
      const object = frameName.object
      const backgroundAttributes = []
      const containerAttributes = []

      for (const attribute of opening.attributes) {
        if (t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name)) {
          if (isSurfaceProp(attribute.name.name)) {
            backgroundAttributes.push(attribute)
            continue
          }
        }
        containerAttributes.push(attribute)
      }

      opening.name = t.jsxMemberExpression(
        t.cloneNode(object),
        t.jsxIdentifier('Container')
      )
      opening.attributes = containerAttributes
      if (closing) {
        closing.name = t.jsxMemberExpression(
          t.cloneNode(object),
          t.jsxIdentifier('Container')
        )
      }

      if (!hasBackgroundChild(path.node.children, object)) {
        path.node.children.unshift(
          t.jsxText('\n'),
          makeBackgroundElement(object, backgroundAttributes),
          t.jsxText('\n')
        )
      } else if (backgroundAttributes.length) {
        console.warn(
          `${file}: kept surface props on Container because a Background child already exists`
        )
      }

      changed = true
    },
  })

  if (!changed) return source

  return generate(ast, {
    quotes: 'single',
    retainLines: true,
    retainFunctionParens: true,
    retainAllComments: true,
    compact: false,
  }).code
}

function collectFiles(input) {
  const stat = fs.statSync(input)
  if (stat.isDirectory()) {
    return glob.sync(path.join(input, '**/*.{ts,tsx}'), {
      ignore: ['**/node_modules/**', '**/dist/**', '**/.turbo/**'],
    })
  }
  return [input]
}

for (const root of roots) {
  for (const file of collectFiles(root)) {
    const source = fs.readFileSync(file, 'utf8')
    if (!source.includes('.Frame')) continue

    const next = transform(source, file)
    if (next !== source) {
      fs.writeFileSync(file, next)
      console.log(`updated ${file}`)
    }
  }
}
