import { execSync } from 'child_process'
import fs from 'fs/promises'

import chalk from 'chalk'
import prompts from 'prompts'

import { takeoutAsciiArt, tamaguiRainbowAsciiArt } from '../helpers/asciiArts'
import { ExtraSteps } from './types'

const packageManager = 'yarn'
const useYarn = packageManager === 'yarn'

const runCommand = (scriptName: string) =>
  `${packageManager} ${useYarn ? '' : 'run '}${scriptName}`

const main: ExtraSteps = async ({ isFullClone, projectName }) => {
  // rome-ignore lint/nursery/noConsoleLog: <explanation>
  console.log(`
${tamaguiRainbowAsciiArt
  .split('\n')
  .map((line) => `                ${line}`)
  .join('\n')}
${takeoutAsciiArt}

`)

  // rome-ignore lint/nursery/noConsoleLog: <explanation>
  console.log()
  const { setupSupabase } = await prompts({
    name: 'setupSupabase',
    message: 'Set up Supabase?',
    type: 'confirm',
    initial: true,
  })

  if (setupSupabase) {
    // rome-ignore lint/nursery/noConsoleLog: <explanation>
    console.log()
    const { startLocalSupabase } = await prompts({
      name: 'startLocalSupabase',
      type: 'confirm',
      message: 'Start local Supabase instance for you? (Requires Docker)',
      initial: true,
    })

    if (startLocalSupabase) {
      const supabaseStarted = await runRetryableCommand(`yarn supa start`)

      if (supabaseStarted) {
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log()
        const { setUpSupabaseEnv } = await prompts({
          name: 'setUpSupabaseEnv',
          type: 'confirm',
          message:
            'Do you want us to add the local env variables for you? This will create a file called .env.local.',
          initial: true,
        })
        if (setUpSupabaseEnv) {
          await fs.writeFile(
            './.env.local',
            `NEXT_PUBLIC_SUPABASE_PROJECT_ID=default
            NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
            NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
            SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
            `
          )
        }
      }
    }

    // rome-ignore lint/nursery/noConsoleLog: <explanation>
    console.log()
    const { setupRemoteSupabase } = await prompts({
      name: 'setupRemoteSupabase',
      type: 'confirm',
      message:
        'Link remote Supabase instance for you? (Create a project on https://app.supabase.com/projects first)',
      initial: true,
    })

    if (setupRemoteSupabase) {
      await runRetryableCommand(`npx supabase login`)
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log()
      await linkSupabase()

      // console.log()
      // const { runSupabaseMigrations } = await prompts({ name: 'runSupabaseMigrations', type: 'confirm', message: 'Run Supabase migrations on your remote Supabase instance?' })

      // if (runSupabaseMigrations) {
      //     execSync(`yarn supa migrate`, { stdio: 'inherit' })
      // }
    }
  }

  if (isFullClone) {
    console.log(`
  ${chalk.green.bold('Done!')} created a new project under ./${projectName}

cd into the project using:
  ${chalk.green('  cd')} ${projectName}
  `)
  }

  // rome-ignore lint/nursery/noConsoleLog: <explanation>
  console.log(`
  To start the Next.js development server, run:
    ${chalk.green(runCommand('web'))}

  To start developing for iOS, run:
    ${chalk.green(runCommand('ios'))}

  To start developing for Android, run:
    ${chalk.green(runCommand('android'))}

  To run Supabase scripts, cd into the supabase package:
    ${chalk.green('cd supabase')}

    ${chalk.green('yarn reset')} - Resets local database
    ${chalk.green('yarn generate')} - Generates new types

    Find info on the rest of the scripts in ${chalk.cyan(`supabase/README.md`)}

    If you've purchased and gained access to font and icon packages, you can run:
    ${chalk.green('yarn tamagui add icon')}
    ${chalk.green('yarn tamagui add font')}
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
      console.log(
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
  const cmd = `yarn supa link-project ${supabaseRefId.trim()}`

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
      console.log(
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
