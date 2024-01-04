import * as proc from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'

import pMap from 'p-map'

const exec = promisify(proc.exec)

format()

async function format() {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
    name: string
    location: string
  }[]

  console.info(` fixing scripts: ${packagePaths.map((x) => x.name).join('\n')}`)

  await pMap(
    packagePaths,
    async ({ location }) => {
      const cwd = join(process.cwd(), location)
      const jsonPath = join(cwd, 'package.json')
      const pkgJson = JSON.parse(
        readFileSync(jsonPath, {
          encoding: 'utf-8',
        })
      )

      if (pkgJson.devDependencies?.['@tamagui/build']) {
        if (!pkgJson.scripts['clean']) {
          pkgJson.scripts['clean'] = 'tamagui-build clean'
          pkgJson.scripts['clean:build'] = 'tamagui-build clean:build'
          writeFileSync(jsonPath, JSON.stringify(pkgJson, null, 2), {
            encoding: 'utf-8',
          })
        }
      }
    },
    {
      concurrency: 10,
    }
  )
}
