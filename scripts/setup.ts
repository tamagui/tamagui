import * as proc from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { readlink } from 'fs-extra'

import { spawnify } from './spawnify'

const exec = promisify(proc.exec)

setup()

/**
 * Should be immutable function that runs and ensures all the packages are setup correctly
 * Allowing you to make a new package just by adding a folder to packages and then running
 * `yarn setup` once.
 */

async function setup() {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
    name: string
    location: string
  }[]

  await Promise.all(
    packagePaths.map(async ({ location, name }) => {
      const cwd = join(process.cwd(), location)
      const romeConfig = join(cwd, 'rome.json')
      try {
        await readlink(romeConfig)
      } catch (err) {
        if (`${err}`.includes(`no such file or directory`)) {
          // eslint-disable-next-line no-console
          console.log(`No rome.json found for ${name}, linking from monorepo root`)
          await spawnify(`ln -s ../../rome.json ./rome.json`, {
            cwd,
          })
        }
      }

      // run format
    })
  )
}
