#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const BENTO_PATH = resolve(REPO_ROOT, '../bento')
const BENTO_PACKAGE_JSON = join(BENTO_PATH, 'package.json')
const ROOT_PACKAGE_JSON = join(REPO_ROOT, 'package.json')
const BENTO_TSCONFIG = join(BENTO_PATH, 'tsconfig.json')

console.info('🔧 Setting up bento for production build...')

// 1. Check bento exists
if (!existsSync(BENTO_PATH)) {
  console.error('❌ ERROR: Bento repository not found at ../bento')
  process.exit(1)
}

console.info('✅ Found ../bento')

// 2. Remove bento tsconfig to avoid conflicts
if (existsSync(BENTO_TSCONFIG)) {
  console.info('🗑️  Removing bento tsconfig.json...')
  rmSync(BENTO_TSCONFIG)
  console.info('✅ Removed bento tsconfig.json')
}

// 3. Read both package.json files
const bentoPackage = JSON.parse(readFileSync(BENTO_PACKAGE_JSON, 'utf-8'))
const rootPackage = JSON.parse(readFileSync(ROOT_PACKAGE_JSON, 'utf-8'))

// 4. Merge dependencies (only ones that don't exist in node_modules)
const bentoDeps = bentoPackage.dependencies || {}
const NODE_MODULES = join(REPO_ROOT, 'node_modules')

let addedCount = 0
const depsToAdd = {}

console.info('🔍 Checking which bento dependencies to add...')

for (const [name, version] of Object.entries(bentoDeps)) {
  const existsInNodeModules = existsSync(join(NODE_MODULES, name))
  const existsInRoot =
    rootPackage.dependencies?.[name] || rootPackage.devDependencies?.[name]

  if (!existsInNodeModules && !existsInRoot) {
    depsToAdd[name] = version
    addedCount++
    console.info(`  + ${name}@${version}`)
  }
}

if (addedCount > 0) {
  console.info(`📦 Adding ${addedCount} new dependencies from bento...`)

  rootPackage.dependencies = {
    ...rootPackage.dependencies,
    ...depsToAdd,
  }

  // Write updated package.json
  writeFileSync(ROOT_PACKAGE_JSON, JSON.stringify(rootPackage, null, 2) + '\n')
  console.info('✅ Updated root package.json')

  // 5. Run yarn install to update lockfile
  console.info('📦 Running yarn install...')
  execSync('yarn install', {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  })
  console.info('✅ Dependencies installed')
} else {
  console.info('✅ No new dependencies needed from bento')
}

console.info('🎉 Bento setup complete!')
