import { existsSync, promises as fsPromises, mkdirSync } from 'node:fs'
import path from 'node:path'

import React from 'react'

import { AppContext } from '../commands/index.js'
import type { InstallState } from '../commands/index.js'
import { componentsList } from '../components.js'
import type { ComponentSchema } from '../components.js'
import { useFetchComponentFromGithub } from './useFetchComponentFromGithub.js'

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

/**
 * Extracts individual components from a text file containing multiple components.
 *
 * @param {string} componentString - A string containing multiple component definitions.
 * @returns {Array<{name: string, content: string}>} An array of objects, each representing a component with its name and content.
 *
 * This function does the following:
 * 1. Defines a regex to identify the start of each component file.
 * 2. Splits the input string into lines.
 * 3. Iterates through each line:
 *    - If it matches the start of a new component, it saves the previous component (if any) and starts a new one.
 *    - Otherwise, it accumulates the content of the current component.
 * 4. After the iteration, it saves the last component if there is one.
 * 5. Returns an array of all extracted components.
 */
const getComponentsFromTextFile = (componentString: string) => {
  const startOfTheFileRegex = /\/\*\* START of the file (.+\.tsx) \*\//
  const lines = componentString.split('\n')
  let accContent = ''
  let componentName = ''
  const allComponents: { name: string; content: string }[] = []
  lines.forEach((line: string) => {
    const matchedLine = line.match(startOfTheFileRegex)
    if (matchedLine) {
      const fileName = matchedLine[1]
      if (componentName) {
        allComponents.push({ name: componentName, content: accContent })
      }
      componentName = fileName
      accContent = ''
    } else {
      accContent += `${line}\n`
    }
  })
  if (componentName) {
    allComponents.push({ name: componentName, content: accContent })
  }
  return allComponents
}

export const installComponent = async ({
  component,
  setInstallState,
  installState,
}: {
  component: string
  setInstallState: React.Dispatch<React.SetStateAction<InstallState>>
  installState: InstallState
}) => {
  const components = getComponentsFromTextFile(component)
  const uiDir = getUIDirectory()
  await subFoldersInstallStep(uiDir, installState, components)

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

  const { data, error } = useFetchComponentFromGithub()

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
      installComponent({ component: data, setInstallState, installState })
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
  components: { name: string; content: string }[]
) {
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

  const installedFiles = new Set()

  for (const moveFile of componentSchema.moveFilesToFolder || []) {
    const sourceFile = components.find((c) => c.name.split('.')[0] === moveFile.file)
    if (sourceFile) {
      const destinationDir = path.join(
        uiDir,
        componentSchema.category,
        componentSchema.categorySection,
        moveFile.to
      )
      await installFile(sourceFile, destinationDir)
      installedFiles.add(sourceFile.name)
    } else {
      console.warn(`File not found for moveFilesToFolder: ${moveFile.file}`)
    }
  }

  // Install any remaining files that weren't explicitly moved
  for (const component of components) {
    if (!installedFiles.has(component.name)) {
      const componentDir = path.join(
        uiDir,
        componentSchema.category,
        componentSchema.categorySection
      )
      await installFile(component, componentDir)
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
