#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const root = path.join(__dirname, '..')
const files = glob.sync('code/**/package.json', {
  ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  cwd: root,
  absolute: true,
})

let totalFixed = 0

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  let pkg
  try {
    pkg = JSON.parse(content)
  } catch {
    continue
  }

  if (!pkg.exports || typeof pkg.exports !== 'object') continue

  let modified = false

  for (const key in pkg.exports) {
    const exp = pkg.exports[key]
    if (typeof exp !== 'object' || exp === null) continue

    // add browser = import value (for Metro/Expo web compatibility)
    if (exp.import && exp.browser !== exp.import) {
      exp.browser = exp.import
      modified = true
    }

    // fix order: types, react-native, browser, module, import, require, default
    const idealOrder = [
      'types',
      'react-native',
      'browser',
      'module',
      'import',
      'require',
      'default',
    ]
    const keys = Object.keys(exp)
    const sortedKeys = [...keys].sort((a, b) => {
      const aIdx = idealOrder.indexOf(a)
      const bIdx = idealOrder.indexOf(b)
      if (aIdx === -1 && bIdx === -1) return 0
      if (aIdx === -1) return 1
      if (bIdx === -1) return -1
      return aIdx - bIdx
    })

    if (JSON.stringify(keys) !== JSON.stringify(sortedKeys)) {
      const reordered = {}
      for (const k of sortedKeys) {
        reordered[k] = exp[k]
      }
      pkg.exports[key] = reordered
      modified = true
    }
  }

  if (modified) {
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
    totalFixed++
    console.log('Fixed:', path.relative(root, file))
  }
}

console.log(`\nTotal fixed: ${totalFixed}`)
