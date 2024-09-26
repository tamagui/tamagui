import { execSync } from 'node:child_process'
import { existsSync, readFileSync, renameSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

import chalk from 'chalk'
import prompts from 'prompts'

import { takeoutAsciiArt, tamaguiRainbowAsciiArt } from '../helpers/asciiArts'
import type { ExtraSteps } from './types'

const packageManager = 'yarn'
const useYarn = packageManager === 'yarn'

const runCommand = (scriptName: string) =>
  `${packageManager} ${useYarn ? '' : 'run '}${scriptName}`

const main: ExtraSteps = async ({ isFullClone, projectName, projectPath }) => {
  console.info(`
${tamaguiRainbowAsciiArt
  .split('\n')
  .map((line) => `                ${line}`)
  .join('\n')}
${takeoutAsciiArt}

`)

  console.info()
  const { setupSupabase } = await prompts({
    name: 'setupSupabase',
    message: 'Set up Supabase?',
    type: 'confirm',
    initial: true,
  })

  if (setupSupabase) {
    console.info()
    const { startLocalSupabase } = await prompts({
      name: 'startLocalSupabase',
      type: 'confirm',
      message: 'Start local Supabase instance for you? (Requires Docker)',
      initial: true,
    })

    if (startLocalSupabase) {
      const supabaseStarted = await runRetryableCommand(`yarn supa start`)

      if (supabaseStarted) {
        console.info()
        const { setUpSupabaseEnv } = await prompts({
          name: 'setUpSupabaseEnv',
          type: 'confirm',
          message:
            'Do you want us to add the local env variables for you? This will create a file called .env.local.',
          initial: true,
        })

        if (setUpSupabaseEnv) {
          const envs = getEnvFromSupabaseStatus(execSync('yarn supa status').toString())
          const newEnvContent = Object.entries(envs)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n')

          if (existsSync(path.join(projectPath, '.env.local'))) {
            if (
              readFileSync(path.join(projectPath, '.env.local')).toString() !==
              newEnvContent
            ) {
              renameSync(
                path.join(projectPath, '.env.local'),
                path.join(projectPath, `.env.local.old-${Number(new Date())}`)
              )
            }
          }

          await fs.writeFile(path.join(projectPath, './.env.local'), newEnvContent)
        }
      }
    }

    console.info()
    const { setupRemoteSupabase } = await prompts({
      name: 'setupRemoteSupabase',
      type: 'confirm',
      message:
        'Link remote Supabase instance for you? (Create a project on https://app.supabase.com/projects first)',
      initial: true,
    })

    if (setupRemoteSupabase) {
      await runRetryableCommand(`npx supabase login`)
      console.info()
      await linkSupabase()

      // console.info()
      // const { runSupabaseMigrations } = await prompts({ name: 'runSupabaseMigrations', type: 'confirm', message: 'Run Supabase migrations on your remote Supabase instance?' })

      // if (runSupabaseMigrations) {
      //     execSync(`yarn supa migrate`, { stdio: 'inherit' })
      // }
    }
  }

  if (isFullClone) {
    console.info(`
  ${chalk.green.bold('Done!')} created a new project under ./${projectName}

visit your project:
  ${chalk.green('  cd')} ${projectName}
  `)
  }

  console.info(`
  To start the Next.js development server, run:
    ${chalk.green(runCommand('web'))}

  To start developing with Expo for native, run:
    ${chalk.green(runCommand('native'))}

  To start developing for Expo dev build, run:
    ${chalk.green(runCommand('ios'))}
    ${chalk.green(runCommand('android'))}

  To run Supabase scripts, cd into the supabase package:
    ${chalk.green('cd supabase')}

    ${chalk.green('yarn reset')} - Resets local database
    ${chalk.green('yarn generate')} - Generates new types

    Find info on the rest of the scripts in ${chalk.cyan(`supabase/README.md`)}

    If you've purchased and gained access to font and icon packages, you can run:
    ${chalk.green('yarn add:icon')}
    ${chalk.green('yarn add:font')}
  `)
}
export default main

async function runRetryableCommand(cmd: string, retriesCount = 0) {
  try {
    execSync(cmd, { stdio: 'inherit' })
    return true
  } catch (error) {
    const { tryAgain } = await prompts({
      name: 'tryAgain',
      message: 'An error occurred. Do you want to try again?',
      type: 'confirm',
      initial: true,
    })
    if (tryAgain) {
      await runRetryableCommand(cmd, retriesCount + 1)
    } else {
      console.info(
        chalk.yellow(
          `⚠️ Skipping this step. You can try running this command later. The failed command was \`${chalk.underline(
            cmd
          )}\`.`
        )
      )
      return false
    }
  }
}

async function linkSupabase() {
  const { supabaseRefId } = await prompts({
    name: 'supabaseRefId',
    type: 'text',
    message: "Enter your supabase project's ID (e.g. abcdefghijklmnopqrst)",
    initial: true,
  })
  const cmd = `npx supabase link --project-ref ${supabaseRefId.trim()}`

  try {
    execSync(cmd, {
      stdio: 'inherit',
    })
    return true
  } catch (error) {
    const { tryAgain } = await prompts({
      name: 'tryAgain',
      message: 'An error occurred. Do you want to try again?',
      type: 'confirm',
      initial: true,
    })
    if (tryAgain) {
      await linkSupabase()
    } else {
      console.info(
        chalk.yellow(
          `⚠️ Skipping this step. You can try running this command later. The failed command was \`${chalk.underline(
            cmd
          )}\`.`
        )
      )
      return false
    }
  }
}

function getEnvFromSupabaseStatus(status: string) {
  return {
    NEXT_PUBLIC_SUPABASE_URL: status.match(/API URL: (.*)/)?.[1],
    NEXT_PUBLIC_SUPABASE_GRAPHQL_URL: status.match(/GraphQL URL: (.*)/)?.[1],
    SUPABASE_DB_URL: status.match(/DB URL: (.*)/)?.[1],
    NEXT_PUBLIC_SUPABASE_ANON_KEY: status.match(/anon key: (.*)/)?.[1],
    SUPABASE_SERVICE_ROLE: status.match(/service_role key: (.*)/)?.[1],
    SUPABASE_JWT_SECRET: status.match(/JWT secret: (.*)/)?.[1],
  }
}
