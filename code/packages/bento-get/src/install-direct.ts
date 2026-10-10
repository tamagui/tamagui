#!/usr/bin/env node
/**
 * Non-interactive bento-get installer
 * Usage: npx ts-node src/install-direct.ts <componentName>
 * Example: npx ts-node src/install-direct.ts SwitchCustomIcons
 */

import fetch from 'node-fetch'
import { existsSync, mkdirSync, promises as fsPromises } from 'node:fs'
import path from 'node:path'

import { componentsList } from './components.js'
import type { ComponentSchema } from './components.js'
import { getMonorepoRoot } from './hooks/useInstallComponent.js'

const apiBase = process.env.API_BASE || 'https://v3.tamagui.dev'

async function main() {
  const componentName = process.argv[2]

  if (!componentName) {
    console.error('Usage: bento-get <componentName>')
    console.error('Example: bento-get SwitchCustomIcons')
    console.error('\nAvailable components:')
    componentsList.forEach((c) => console.error(`  - ${c.fileName} (${c.name})`))
    process.exit(1)
  }

  // Find component by fileName or name
  const component = componentsList.find(
    (c) =>
      c.fileName.toLowerCase() === componentName.toLowerCase() ||
      c.name.toLowerCase() === componentName.toLowerCase()
  )

  if (!component) {
    console.error(`Component "${componentName}" not found.`)
    console.error('\nAvailable components:')
    componentsList.slice(0, 10).forEach((c) => console.error(`  - ${c.fileName}`))
    console.error('  ...')
    process.exit(1)
  }

  console.info(`Found component: ${component.name} (${component.fileName})`)

  // Fetch component
  console.info('\nFetching component...')

  const codePath = `${apiBase}/bento-manifests/${[
    component.category,
    component.categorySection,
    `${component.fileName}.json`,
  ]
    .map((part) => encodeURIComponent(part))
    .join('/')}`

  try {
    const res = await fetch(codePath)

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error(`Failed to fetch component: ${res.status} ${res.statusText}`)
      console.error(errorData)
      process.exit(1)
    }

    const filesData: Record<
      string,
      Array<{ path: string; downloadUrl: string }>
    > = (await res.json()) as any

    console.info('Downloading files...')

    // Download all files
    const downloadedFiles: Record<
      string,
      Array<{ path: string; filePlainText: string }>
    > = {}

    for (const [category, files] of Object.entries(filesData)) {
      downloadedFiles[category] = await Promise.all(
        files.map(async (file: { path: string; downloadUrl: string }) => {
          const fileRes = await fetch(new URL(file.downloadUrl, apiBase).toString())
          const fileContent = await fileRes.text()
          return {
            path: file.path,
            filePlainText: fileContent,
          }
        })
      )
    }

    // Install files
    const monorepoRoot = await getMonorepoRoot()
    const uiDir = getUIDirectory(monorepoRoot)

    console.info(`Installing to: ${uiDir}`)

    for (const [folderPath, files] of Object.entries(downloadedFiles)) {
      const destinationDir = path.join(uiDir, folderPath)

      if (!existsSync(destinationDir)) {
        mkdirSync(destinationDir, { recursive: true })
      }

      for (const file of files) {
        const destinationPath = path.join(destinationDir, path.basename(file.path))
        await fsPromises.writeFile(destinationPath, file.filePlainText)
        console.info(`  Created: ${destinationPath}`)
      }
    }

    console.info('\nComponent installed successfully!')
  } catch (error) {
    console.error('Error installing component:', error)
    process.exit(1)
  }
}

function getUIDirectory(monorepoRoot: string) {
  const isTakeoutRepo = () => existsSync(path.join(monorepoRoot, 'takeout.config.json'))
  const hasPackagesAndUIDir = () => {
    const packagesDir = path.join(monorepoRoot, 'packages')
    const uiDir = path.join(packagesDir, 'ui')
    const srcDir = path.join(uiDir, 'src')
    return existsSync(packagesDir) && existsSync(uiDir) && existsSync(srcDir)
  }
  const hasAppDir = () => existsSync(path.join(monorepoRoot, 'app'))
  const hasAppDirAndRoutesDir = () => existsSync(path.join(monorepoRoot, 'app', 'routes'))
  const hasSrcDir = () => existsSync(path.join(monorepoRoot, 'src'))

  if (isTakeoutRepo()) {
    return path.join(monorepoRoot, 'packages', 'ui', 'src', 'components')
  }
  if (hasPackagesAndUIDir()) {
    return path.join(monorepoRoot, 'packages', 'ui', 'src')
  }
  if (hasAppDirAndRoutesDir() || hasAppDir()) {
    return path.join(monorepoRoot, 'components', 'ui')
  }
  if (hasSrcDir()) {
    return path.join(monorepoRoot, 'src', 'components', 'ui')
  }
  console.warn(`No relevant directory found, using current directory`)
  return '.'
}

main()
