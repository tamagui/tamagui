#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, symlinkSync, readdirSync, mkdirSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const BENTO_PATH = resolve(REPO_ROOT, '../bento')
const BENTO_PACKAGE_JSON = join(BENTO_PATH, 'package.json')
const ROOT_PACKAGE_JSON = join(REPO_ROOT, 'package.json')

console.info('🔧 Setting up bento for production build...')

// 1. Check bento exists
if (!existsSync(BENTO_PATH)) {
  console.error('❌ ERROR: Bento repository not found at ../bento')
  process.exit(1)
}

console.info('✅ Found ../bento')

// 2. Read both package.json files
const bentoPackage = JSON.parse(readFileSync(BENTO_PACKAGE_JSON, 'utf-8'))
const rootPackage = JSON.parse(readFileSync(ROOT_PACKAGE_JSON, 'utf-8'))

// 3. Validate tamagui versions match
console.info('🔍 Validating tamagui versions...')
const bentoTamaguiVersion = bentoPackage.dependencies?.tamagui || bentoPackage.devDependencies?.tamagui
const rootTamaguiVersion = rootPackage.dependencies?.tamagui || rootPackage.devDependencies?.tamagui

if (bentoTamaguiVersion && rootTamaguiVersion && bentoTamaguiVersion !== rootTamaguiVersion) {
  console.warn(`⚠️  WARNING: Tamagui version mismatch!`)
  console.warn(`   Bento: ${bentoTamaguiVersion}`)
  console.warn(`   Root:  ${rootTamaguiVersion}`)
  console.warn(`   This may cause issues. Consider syncing versions.`)
}

// 4. Install bento dependencies
console.info('📦 Installing bento dependencies...')
execSync('bun install', {
  cwd: BENTO_PATH,
  stdio: 'inherit',
})
console.info('✅ Bento dependencies installed')

// 5. Symlink all node_modules from tamagui to bento to avoid any duplicates
console.info('🔗 Symlinking all node_modules to avoid duplicates...')

const TAMAGUI_NODE_MODULES = join(REPO_ROOT, 'node_modules')
const BENTO_NODE_MODULES = join(BENTO_PATH, 'node_modules')

let linkedCount = 0

function symlinkPackages(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) return

  const items = readdirSync(sourceDir)

  for (const item of items) {
    const sourcePath = join(sourceDir, item)
    const targetPath = join(targetDir, item)

    // Skip .bin and other non-package directories
    if (item === '.bin' || item === '.cache' || item === '.yarn') {
      continue
    }

    // If it's a scoped package directory (starts with @)
    if (item.startsWith('@')) {
      // Create the scope directory
      if (!existsSync(targetPath)) {
        mkdirSync(targetPath, { recursive: true })
      }
      // Recurse into the scope
      symlinkPackages(sourcePath, targetPath)
    } else {
      // It's a regular package, symlink it
      try {
        // Remove existing if present
        if (existsSync(targetPath)) {
          execSync(`rm -rf "${targetPath}"`, { stdio: 'pipe' })
        }
        symlinkSync(sourcePath, targetPath, 'dir')
        linkedCount++
      } catch (err) {
        // Ignore errors, some packages might not be linkable
      }
    }
  }
}

// Symlink everything
symlinkPackages(TAMAGUI_NODE_MODULES, BENTO_NODE_MODULES)

console.info(`✅ Symlinked ${linkedCount} packages from tamagui to bento`)
console.info('🎉 Bento setup complete!')
