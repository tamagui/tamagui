// @ts-nocheck
import { useContext, useEffect } from 'react'
import { useGetComponent } from './useGetComponent.js'
import { AppContext } from '../commands/index.js'
import { mkdirSync, existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { componentsList, type ComponentSchema } from '../components.js'

// for expo router setups
const appDir = path.join(process.cwd(), 'app')
const hasAppDir = () => existsSync(path.join(process.cwd(), 'app'))
const hasAppDirAndSrcDir = () => existsSync(path.join(process.cwd(), 'app', 'src'))

// for remix setups
const hasAppDirAndRoutesDir = () => existsSync(path.join(process.cwd(), 'app', 'routes'))

const hasSrcDir = () => existsSync(path.join(process.cwd(), 'src'))

const createUIDir = () =>
  mkdirSync(path.join(process.cwd(), 'packages', 'ui'), {
    recursive: true,
  })

const createDir = ({
  component,
  uiPath,
}: { component: ComponentSchema; uiPath: string[] } = {}) =>
  mkdirSync(path.join(process.cwd()), {
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
    await subFoldersInstallStep(uiDir, install, components)
  } else if (hasAppDir()) {
    const uiDir = path.join(process.cwd(), 'components', 'ui')
    await subFoldersInstallStep(uiDir, install, components)
  } else if (hasSrcDir()) {
    console.log('here', process.cwd())
    const uiDir = path.join(process.cwd(), 'src', 'components', 'ui')
    await subFoldersInstallStep(uiDir, install, components)
  } else {
  }
  setInstall((prev) => ({
    installingComponent: null,
    installedComponents: [...prev.installedComponents, install.installingComponent],
  }))
}

export const useInstallComponent = () => {
  const { install, setInstall } = useContext(AppContext)
  const { data } = useGetComponent()

  useEffect(() => {
    if (data && install?.installingComponent) {
      installComponent({ component: data, setInstall, install })
    }
  }, [data, install, setInstall])
}
async function subFoldersInstallStep(uiDir: string, install: any, components: { name: string; content: string }[]) {
  if (!existsSync(uiDir)) {
    mkdirSync(uiDir, { recursive: true })
  }

  const componentSchema = componentsList.find(
    (i) => i.name === install?.installingComponent?.name
  )

  await Promise.all(
    components.map((component) => {
      const componentName = component.name.split('.')[0]


      const toFolder = componentSchema.moveFilesToFolder.find(
        (i) => i.file === componentName
      )?.to

      const componentDir = path.join(
        uiDir,
        componentSchema?.category,
        componentSchema?.categorySection,
        toFolder ?? ''
      )

      if (!existsSync(componentDir)) {
        mkdirSync(componentDir, { recursive: true })
      }
      fs.writeFile(path.join(componentDir, component.name), component.content)
    })
  )
}

