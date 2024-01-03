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
 * `yarn scripts:setup` once.
 */

async function setup() {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
    name: string
    location: string
  }[]

  await Promise.all(
    packagePaths.map(async ({ location, name }) => {
      if (name === 'tamagui-monorepo') {
        // avoid monorepo itself
        return
      }

      const cwd = join(process.cwd(), location)
      await Promise.all([
        // // add react-native exports
        // async () => {
        //   // only packages
        //   if (!location.includes('packages/')) {
        //     return
        //   }
        //   const pkgJson = await readJSON(join(cwd, 'package.json'))
        //   if (!pkgJson.exports) return

        //   if (!pkgJson.exports['.']) return

        //   const mainExports = pkgJson.exports['.']
        //   if (typeof mainExports === 'string') {
        //     console.warn('?', pkgJson.exports)
        //     return
        //   }

        //   const next: any = {}

        //   for (const key in mainExports) {
        //     const val = mainExports[key]

        //     // add react-native
        //     if (key === 'require') {
        //       next['react-native'] = val.replace('/cjs/', '/react-native/')
        //     }

        //     next[key] = val
        //   }

        //   pkgJson.exports['.'] = next
        // },
        // ensure rome.json
        (async () => {
          const biomeConfig = join(cwd, 'biome.json')

          try {
            await readlink(biomeConfig)
          } catch (err) {
            if (`${err}`.includes(`no such file or directory`)) {
              console.info(`No rome.json found for ${name}, linking from monorepo root`)
              await spawnify(`ln -s ../../biome.json ./biome.json`, {
                cwd,
              })
            }
          }
        })(),
      ])
    })
  )
}
