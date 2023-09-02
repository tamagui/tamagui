import * as proc from 'node:child_process'
import { statSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'

import pMap from 'p-map'

import { spawnify } from './spawnify'

const exec = promisify(proc.exec)

format()

async function format() {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
    name: string
    location: string
  }[]

  // rome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(` formatting: ${packagePaths.map((x) => x.name).join('\n')}`)

  const configPath = join(__dirname, '..', '.prettierrc')
  const ignorePath = join(__dirname, '..', '.prettierignore')

  await pMap(
    packagePaths,
    async ({ location, name }) => {
      if (location.startsWith(`apps`) || location.startsWith(`starters`)) {
        return
      }

      const cwd = join(process.cwd(), location)

      try {
        statSync(join(cwd, 'src'))
      } catch {
        return
      }

      try {
        // rome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`Prettying: ${cwd}`)
        await spawnify(
          `prettier --ignore-path ${ignorePath} --config ${configPath} --write src/**/*.{ts,tsx}`,
          {
            cwd,
          }
        )
      } catch (err) {
        // rome-ignore lint/suspicious/noConsoleLog: ok
        console.log(`err`, location, err)
      }
    },
    {
      concurrency: 10,
    }
  )
}
