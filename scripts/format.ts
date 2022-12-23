import * as proc from 'node:child_process'
import { statSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { spawnify } from './spawnify'

const exec = promisify(proc.exec)

format()

async function format() {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
    name: string
    location: string
  }[]

  await Promise.all(
    packagePaths.map(async ({ location, name }) => {
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
        await spawnify(`prettier --write \"**/*.{ts,tsx}\"`, {
          cwd,
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`err`, location, err)
      }
    })
  )
}
