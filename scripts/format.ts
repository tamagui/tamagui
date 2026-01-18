import * as proc from 'node:child_process'
import { statSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'

import pMap from 'p-map'

import { spawnify } from './spawnify'

const exec = promisify(proc.exec)

format()

async function format() {
  const output = (await exec(`bun pm ls`)).stdout
  const lines = output.split('\n').filter((line) => line.includes('workspace:'))
  const packagePaths = lines
    .map((line) => {
      const match = line.match(/([^\s]+)@workspace:(.+)$/)
      if (match) {
        return { name: match[1], location: match[2] }
      }
      return null
    })
    .filter(Boolean) as { name: string; location: string }[]

  console.info(` formatting: ${packagePaths.map((x) => x.name).join('\n')}`)

  const configPath = join(__dirname, '..', '.prettierrc')
  const ignorePath = join(__dirname, '..', '.prettierignore')

  await pMap(
    packagePaths,
    async ({ location, name }) => {
      if (location.startsWith(`code/apps`) || location.startsWith(`code/starters`)) {
        return
      }

      const cwd = join(process.cwd(), location)

      try {
        statSync(join(cwd, 'src'))
      } catch {
        return
      }

      try {
        console.info(`Prettying: ${cwd}`)
        await spawnify(
          `prettier --ignore-path ${ignorePath} --config ${configPath} --write src/**/*.{ts,tsx}`,
          {
            cwd,
          }
        )
      } catch (err) {
        console.info(`err`, location, err)
      }
    },
    {
      concurrency: 10,
    }
  )
}
