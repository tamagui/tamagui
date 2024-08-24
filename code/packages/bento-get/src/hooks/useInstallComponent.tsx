import { existsSync, promises as fsPromises, mkdirSync } from 'node:fs'
import path from 'node:path'

import React from 'react'

import { AppContext } from '../commands/index.js'
import type { InstallState } from '../commands/index.js'
import { componentsList } from '../components.js'
import type { ComponentSchema } from '../components.js'
import { useFetchComponent } from './useFetchComponent.js'
import { debugLog } from '../commands/index.js'

export const getMonorepoRoot = async () => {
  let currentDir = process.cwd() as string

  while (currentDir !== path.parse(currentDir).root) {
    if (
      existsSync(path.join(currentDir, 'lerna.json')) ||
      existsSync(path.join(currentDir, 'pnpm-workspace.yaml')) ||
      existsSync(path.join(currentDir, 'nx.json')) ||
      (existsSync(path.join(currentDir, 'package.json')) &&
        JSON.parse(
          await fsPromises.readFile(path.join(currentDir, 'package.json'), 'utf8')
        ).workspaces)
    ) {
      return currentDir
    }

    if (existsSync(path.join(currentDir, 'yarn.lock'))) {
      const packageJsonPath = path.join(currentDir, 'package.json')
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, 'utf8'))
        if (packageJson.workspaces || packageJson.private === true) {
          return currentDir
        }
      }
    }

    currentDir = path.dirname(currentDir)
  }

  return process.cwd()
}

const monorepoRoot = await getMonorepoRoot()

const hasAppDir = () => existsSync(path.join(monorepoRoot, 'app'))
const hasAppDirAndRoutesDir = () => existsSync(path.join(monorepoRoot, 'app', 'routes'))
const hasSrcDir = () => existsSync(path.join(monorepoRoot, 'src'))
const hasPackagesAndUIDir = () => {
  const packagesDir = path.join(monorepoRoot, 'packages')
  const uiDir = path.join(packagesDir, 'ui')
  const srcDir = path.join(uiDir, 'src')
  return existsSync(packagesDir) && existsSync(uiDir) && existsSync(srcDir)
}
const isTakeoutRepo = () => {
  const takeoutConfigPath = path.join(monorepoRoot, 'takeout.config.json')
  return existsSync(takeoutConfigPath)
}
export const installComponent = async ({
  componentFiles,
  setInstallState,
  installState,
}: {
  componentFiles: {
    [key: string]: Array<{
      path: string
      filePlainText: string
    }>
  }
  setInstallState: React.Dispatch<React.SetStateAction<InstallState>>
  installState: InstallState
}) => {
  debugLog('Installing component', installState.installingComponent)
  const uiDir = getUIDirectory()
  debugLog('UI directory', uiDir)
  await subFoldersInstallStep(uiDir, installState, componentFiles)

  // In the useInstallComponent function
  setInstallState((prev) => ({
    ...prev,
    installingComponent: null, // Change undefined to null
    installedComponents: [
      ...prev.installedComponents,
      installState.installingComponent,
    ].filter((component): component is ComponentSchema => component !== undefined),
  }))
}

export const useInstallComponent = () => {
  const { installState, setInstallState, confirmationPending, setConfirmationPending } =
    React.useContext(AppContext)

  const { data, error } = useFetchComponent()
  if (error) {
    console.error('Error fetching component data', error)
    throw new Error('Error fetching component data')
  }
  debugLog('Fetched component data', data, {
    confirmationPending,
  })

  React.useEffect(() => {
    if (installState?.installingComponent && confirmationPending) {
      const componentName = installState.installingComponent.name
      const installPath = getUIDirectory()
      setInstallState((prev) => ({
        ...prev,
        componentToInstall: {
          name: componentName,
          path: installPath,
        },
      }))
    }
  }, [
    installState?.installingComponent,
    setInstallState,
    confirmationPending,
    setConfirmationPending,
  ])

  React.useEffect(() => {
    if (data && installState?.installingComponent && confirmationPending === false) {
      installComponent({ componentFiles: data, setInstallState, installState })
      setConfirmationPending(true)
    }
  }, [
    data,
    installState?.installingComponent,
    setInstallState,
    confirmationPending,
    setConfirmationPending,
  ])

  return { data, error }
}

const getUIDirectory = () => {
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

async function subFoldersInstallStep(
  uiDir: string,
  install: InstallState,
  componentFiles: { [key: string]: Array<{ path: string; filePlainText: string }> }
) {
  debugLog('Sub folders install step')
  if (!existsSync(uiDir)) {
    mkdirSync(uiDir, { recursive: true })
  }

  const componentSchema: ComponentSchema | undefined = componentsList.find(
    (i: ComponentSchema) => i.name === install?.installingComponent?.name
  )

  if (!componentSchema) {
    console.error(`Component schema not found for: ${install?.installingComponent?.name}`)
    return
  }

  for (const [folderPath, files] of Object.entries(componentFiles)) {
    const destinationDir = path.join(uiDir, folderPath)

    if (!existsSync(destinationDir)) {
      mkdirSync(destinationDir, { recursive: true })
    }

    for (const file of files) {
      await installFile(
        { name: path.basename(file.path), content: file.filePlainText },
        destinationDir
      )
    }
  }
}

async function installFile(
  file: { name: string; content: string },
  destinationDir: string
) {
  if (!existsSync(destinationDir)) {
    try {
      mkdirSync(destinationDir, { recursive: true })
    } catch (error) {
      console.error(`Failed to create directory: ${destinationDir}`, error)
      return
    }
  }

  const destinationPath = path.join(destinationDir, file.name)

  try {
    await fsPromises.writeFile(destinationPath, file.content)
  } catch (error) {
    console.error(`Failed to write file: ${destinationPath}`, error)
  }
}
