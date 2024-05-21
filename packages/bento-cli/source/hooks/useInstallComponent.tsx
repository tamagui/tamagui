// @ts-nocheck
import { useContext, useEffect } from 'react'
import { useGetComponent } from './useGetComponent.js'
import { AppContext } from '../commands/index.js'
import { mkdirSync, existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { set } from 'zod'

// for expo router setups
const hasAppDir = () => existsSync(path.join(process.cwd(), 'app'))
const hasAppDirAndSrcDir = () => existsSync(path.join(process.cwd(), 'app', 'src'))

// for remix setups
const hasAppDirAndRoutesDir = () => existsSync(path.join(process.cwd(), 'app', 'routes'))

const hasSrcDir = () => existsSync(path.join(process.cwd(), 'src'))

const createUIDir = () =>
  mkdirSync(path.join(process.cwd(), 'packages', 'ui'), {
    recursive: true,
  })

// for monorepo setups
const hasPackagesAndUIDir = () => {
  const packagesDir = path.join(process.cwd(), 'packages')
  const uiDir = path.join(packagesDir, 'ui')
  const srcDir = path.join(uiDir, 'src')
  return existsSync(packagesDir) && existsSync(uiDir) && existsSync(srcDir)
}

const getComponentsFromTextFile = (components) => {
  const startOfTheFileRegex = /\/\*\* START of the file (.+\.tsx) \*\//
  const lines = components.split('\n')
  let accContent = ''
  let componentName = ''
  const allComponents: { name: string; content: string }[] = []
  lines.forEach((line, index) => {
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

export const installComponent = async ({ component, setInstall, install }) => {
  const components = getComponentsFromTextFile(component)
  if (hasPackagesAndUIDir()) {
    //TODO: think of adding later on the --overwrite flag in this piece of the process

    await Promise.all(
      components.map((component) =>
        fs.writeFile(
          path.join(process.cwd(), 'packages', 'ui', 'src', component.name),
          component.content
        )
      )
    )
  } else if (hasAppDirAndRoutesDir()) {
    const uiDir = path.join(process.cwd(), 'components', 'ui')

    if (!existsSync(uiDir)) {
      mkdirSync(uiDir, { recursive: true })
    }

    await Promise.all(
      components.map((component) =>
        fs.writeFile(
          path.join(process.cwd(), 'components', 'ui', component.name),
          component.content
        )
      )
    )
  } else if (hasAppDir()) {
    const uiDir = path.join(process.cwd(), 'components', 'ui')

    if (!existsSync(uiDir)) {
      mkdirSync(uiDir, { recursive: true })
    }

    await Promise.all(
      components.map((component) =>
        fs.writeFile(
          path.join(process.cwd(), 'components', 'ui', component.name),
          component.content
        )
      )
    )
  } else {
  }
  setInstall((prev) => ({
    installingComponent: null,
    installedComponents: [...prev.installedComponents, install.installingComponent],
  }))
}

export const useInstallComponent = () => {
  const { install, setInstall } = useContext(AppContext)
  const { data, isLoading, error } = useGetComponent()

  useEffect(() => {
    if (data && install?.installingComponent) {
      installComponent({ component: data, setInstall })
    }
  }, [data])
}
