import { execSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'

import chalk from 'chalk'
import { pascalCase } from 'change-case'
import { copy, ensureDir, readFileSync } from 'fs-extra'
import { marked } from 'marked'
import TerminalRenderer from 'marked-terminal'
import open from 'opener'
import prompts from 'prompts'

marked.setOptions({
  renderer: new TerminalRenderer(),
})

const home = homedir()
const tamaguiDir = path.join(home, '.tamagui')

export const generatedPackageTypes = ['font', 'icon'] as const
export const installGeneratedPackage = async (type: string, packagesPath?: string) => {
  packagesPath = packagesPath || path.join(process.cwd(), 'packages')
  if (!generatedPackageTypes.includes(type as (typeof generatedPackageTypes)[number])) {
    throw new Error(
      `${
        type ? `Type "${type}" is Not supported.` : `No type provided.`
      } Supported types: ${generatedPackageTypes.join(', ')}`
    )
  }
  const repoName = type === 'font' ? 'tamagui-google-fonts' : 'tamagui-iconify'
  console.info(`Setting up ${chalk.blueBright(tamaguiDir)}...`)

  await ensureDir(tamaguiDir)
  const tempDir = path.join(tamaguiDir, repoName)
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true })
  }
  try {
    process.chdir(tamaguiDir)
    try {
      console.info('Attempting to clone with SSH')
      execSync(
        `git clone -n --depth=1  --branch generated --filter=tree:0 git@github.com:tamagui/${repoName}.git`
      )
    } catch (error) {
      console.info('SSH failed - Attempting to c  lone with HTTPS')
      execSync(
        `git clone -n --depth=1 --branch generated --filter=tree:0 https://github.com/tamagui/${repoName}`
      )
    }

    process.chdir(tempDir)
    execSync([`git sparse-checkout set --no-cone meta`, `git checkout`].join(' && '))
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any)?.stderr.includes('Repository not found')) {
        console.info(
          chalk.yellow(
            `You don't have access to Tamagui ${
              type === 'font' ? 'fonts' : 'icons'
            }. Check 🥡 Tamagui Takeout (https://tamagui.dev/takeout) for more info.`
          )
        )
        open('https://tamagui.dev/takeout')
        process.exit(0)
      }
      throw error
    }
  }

  const meta = JSON.parse(
    await readFile(path.join(tamaguiDir, repoName, `meta`, `data.json`)).then((r) =>
      r.toString()
    )
  )

  console.info(
    chalk.gray(
      `Use ⇧/⇩ to navigate. Use tab to cycle the result. Use Page Up/Page Down (on Mac: fn + ⇧ / ⇩) to change page. Hit enter to select the highlighted item below the prompt.`
    )
  )
  const result = await prompts({
    name: 'packageName',
    type: 'autocomplete',
    message:
      type === 'icon'
        ? `Pick an icon pack:`
        : type === 'font'
          ? `Pick a font:`
          : `Pick one:`,
    choices: Object.entries<any>(meta).map(([slug, data]) => ({
      title:
        type === 'font'
          ? `${slug}: ${data.weights.length} weights, ${data.styles.length} styles, ${
              data.subsets.length
            } subsets (https://fonts.google.com/specimen/${pascalCase(slug)})`
          : `${data.name}: ${data.total} icons, ${data.license.title} license (${data.author.url})`,
      value: slug,
    })),
  })

  const packageName = `${type}-${result.packageName}`
  const packageDir = path.join(tempDir, 'packages', packageName)
  process.chdir(tempDir)
  execSync(
    [`git sparse-checkout set --no-cone packages/${packageName}`, `git checkout`].join(
      ' && '
    )
  )
  const finalDir = path.join(packagesPath, packageName)
  await ensureDir(packagesPath)
  await copy(packageDir, finalDir)

  console.info()
  console.info(chalk.green(`Created the package under ${finalDir}`))
  console.info()

  const readmePath = path.join(finalDir, 'README.md')
  if (existsSync(readmePath)) {
    console.info(marked.parse(readFileSync(readmePath).toString()))
  }
}

function cloneGeneratedBranch(repoName: string) {}
