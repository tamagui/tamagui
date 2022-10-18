#!/usr/bin/env node

const execSync = require('child_process').execSync
const fs = require('fs')
const { join } = require('path')

execSync(`rm -r takeout || true`)
execSync(`rm -r apps/site/pages/studio || true`)
execSync(`rm -r apps/site/pages/takeout || true`)

const pkgPath = join(__dirname, '..', 'package.json')
const pkg = fs.readFileSync(pkgPath, 'utf8')
fs.writeFileSync(
  pkgPath,
  pkg.replace(
    `,
"takeout/*"`,
    ''
  )
)
