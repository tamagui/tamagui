// adapted from https://github.com/Thinkmill/manypkg/blob/main/packages/cli/src/upgrade.ts

import path from 'path'

import { getPackages } from '@manypkg/get-packages'
import { Package } from '@manypkg/get-packages'
import chalk from 'chalk'
import detectIndent from 'detect-indent'
import * as fs from 'fs-extra'

export const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
] as const

export const upgrade = async ({
  version,
  tag = 'latest',
}: {
  version?: string
  tag?: string
}) => {
  const { $ } = await import('execa')

  const { packages, tool, rootPackage, rootDir } = await getPackages(process.cwd())

  const allPackages = rootPackage ? [rootPackage, ...packages] : packages

  const versionsRaw = (await $`npm view tamagui versions --json`).stdout
  const versions = JSON.parse(versionsRaw.trim().replaceAll(`\n`, ''))
  const newVersion = versions[versions.length - 1]

  console.log(chalk.yellow(`  Updating to version ${newVersion}`))

  const out = await Promise.all(
    allPackages.flatMap(async (pkg) => {
      const { packageJson } = pkg
      let hasUpgrades = false

      for (const t of DEPENDENCY_TYPES) {
        const deps = packageJson[t]
        if (deps) {
          for (const pkgName of Object.keys(deps)) {
            if (isTamaguiDep(pkgName)) {
              packageJson[pkgName] = version
              hasUpgrades = true
            }
          }
        }
      }

      if (hasUpgrades) {
        console.log('.')
        // await writePackage(pkg)
        return true
      }
    })
  )

  console.log(chalk.yellow(`  Updated ${out.length} package.jsons, installing...`))

  await install(tool.type, rootDir)
}

function isTamaguiDep(pkgName: string) {
  return (
    pkgName.startsWith('@tamagui/') ||
    pkgName === 'tamagui' ||
    pkgName === 'react-native-web-lite' ||
    pkgName === 'tamagui-loader'
  )
}

export async function writePackage(pkg: Package) {
  let pkgRaw = await fs.readFile(path.join(pkg.dir, 'package.json'), 'utf-8')
  let indent = detectIndent(pkgRaw).indent || '  '
  return fs.writeFile(
    path.join(pkg.dir, 'package.json'),
    JSON.stringify(pkg.packageJson, null, indent) + (pkgRaw.endsWith('\n') ? '\n' : '')
  )
}

export async function install(toolType: string, cwd: string) {
  const cliRunners: Record<string, string> = {
    lerna: 'lerna',
    pnpm: 'pnpm',
    root: 'yarn',
    rush: 'rushx',
    yarn: 'yarn',
  }

  const { $ } = await import('execa')
  const cmd = `${cliRunners[toolType]} ${
    toolType === 'pnpm' ? 'install' : toolType === 'lerna' ? `bootstrap --since HEAD` : ''
  }`
  console.log(`running ${cmd}`)
  await $`${cmd}`
}
