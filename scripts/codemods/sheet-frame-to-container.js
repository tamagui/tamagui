#!/usr/bin/env node

const fs = require('fs')
const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generate = require('@babel/generator').default

const surfaceProps = new Set([
  'bg',
  'background',
  'backgroundColor',
  'backgroundImage',
  'borderColor',
  'borderRadius',
  'borderStyle',
  'borderWidth',
  'boxShadow',
  'elevate',
  'elevation',
  'elevationAndroid',
  'outlineColor',
  'outlineOffset',
  'outlineStyle',
  'outlineWidth',
])

function isSurfaceProp(name) {
  return (
    surfaceProps.has(name) ||
    /^border[A-Z].*(Color|Radius|Style|Width)$/.test(name) ||
    /^shadow[A-Z]/.test(name)
  )
}

function isSheetPartName(name, part) {
  if (!t.isJSXMemberExpression(name) || !t.isJSXIdentifier(name.property)) {
    return false
  }
  return name.property.name === part
}

function isMemberPart(node, part) {
  return t.isMemberExpression(node) && t.isIdentifier(node.property, { name: part })
}

function replaceJSXPartName(name, nextPart) {
  if (t.isJSXMemberExpression(name) && t.isJSXIdentifier(name.property)) {
    name.property = t.jsxIdentifier(nextPart)
  }
}

function cloneJSXPartName(name, nextPart) {
  const cloned = t.cloneNode(name, true)
  replaceJSXPartName(cloned, nextPart)
  return cloned
}

function replaceMemberPart(node, nextPart) {
  if (t.isMemberExpression(node) && t.isIdentifier(node.property)) {
    node.property = t.identifier(nextPart)
  }
}

function isWhitespaceChild(child) {
  return t.isJSXText(child) && child.value.trim() === ''
}

function transform(source, filename) {
  const ast = babelParser.parse(source, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  })

  traverse(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement
      const closing = path.node.closingElement
      if (!isSheetPartName(opening.name, 'Frame')) return

      const backgroundName = cloneJSXPartName(opening.name, 'Background')
      replaceJSXPartName(opening.name, 'Container')
      if (closing) {
        replaceJSXPartName(closing.name, 'Container')
      }

      const background = t.jsxElement(
        t.jsxOpeningElement(backgroundName, [], true),
        null,
        [],
        true
      )

      const kept = []
      const moved = []
      for (const attr of opening.attributes) {
        if (
          t.isJSXAttribute(attr) &&
          t.isJSXIdentifier(attr.name) &&
          isSurfaceProp(attr.name.name)
        ) {
          moved.push(attr)
        } else {
          kept.push(attr)
        }
      }
      opening.attributes = kept
      background.openingElement.attributes.push(...moved)

      const firstContent = path.node.children.find((child) => !isWhitespaceChild(child))
      if (!firstContent || !t.isJSXElement(firstContent)) {
        path.node.children.unshift(background)
        return
      }

      const firstName = firstContent.openingElement.name
      if (!isSheetPartName(firstName, 'Background')) {
        path.node.children.unshift(background)
      }
    },

    JSXOpeningElement(path) {
      if (isSheetPartName(path.node.name, 'Frame')) {
        replaceJSXPartName(path.node.name, 'Container')
      }
    },

    JSXClosingElement(path) {
      if (isSheetPartName(path.node.name, 'Frame')) {
        replaceJSXPartName(path.node.name, 'Container')
      }
    },

    CallExpression(path) {
      if (!t.isIdentifier(path.node.callee, { name: 'styled' })) return
      const firstArg = path.node.arguments[0]
      if (!isMemberPart(firstArg, 'Frame')) return

      replaceMemberPart(firstArg, 'Container')
      t.addComment(
        path.node,
        'leading',
        ' TODO(tamagui-v2): Sheet.Frame split into Sheet.Container and Sheet.Background; choose the styled target by intent. '
      )
    },
  })

  return generate(
    ast,
    {
      comments: true,
      retainLines: true,
    },
    source
  ).code
}

const files = process.argv.slice(2)
if (!files.length) {
  console.error('Usage: sheet-frame-to-container.js <file.tsx...>')
  process.exit(1)
}

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  const next = transform(source, file)
  if (next !== source) {
    fs.writeFileSync(file, next)
    console.log(`updated ${file}`)
  }
}
