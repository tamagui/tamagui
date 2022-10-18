#!/usr/bin/env node

let execSync = require('child_process').execSync
let fs = require('fs')
let join = require('path').join

execSync(`rm -r takeout || true`)
execSync(`rm -r apps/site/pages/studio || true`)
execSync(`rm -r apps/site/pages/takeout || true`)

let pkgPath = join(__dirname, '..', 'package.json')
let pkg = fs.readFileSync(pkgPath, 'utf8')
fs.writeFileSync(
  pkgPath,
  pkg.replace(
    `,
"takeout/*"`,
    ''
  )
)
