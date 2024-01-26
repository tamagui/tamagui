import { access, writeFile, writeJSON } from 'fs-extra'
import * as proc from 'node:child_process'
import { readFileSync, writeFileSync,  } from 'node:fs'
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

  console.info(` repair exports: ${packagePaths.map((x) => x.name).join('\n')}`)

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

      let changed = false

      if (pkgJson.exports) {
        for (const key in pkgJson.exports) {
          const val = pkgJson.exports[key]

          if (typeof val !== 'object') continue
          if (!val.require) continue
          if (!val.require.endsWith('.js')) continue
          if (!val.require.includes('dist/cjs')) continue

          // adds react-native entry
          val['react-native'] = val.require.replace('.js', '.native.js')
          changed = true
        }
      }

      if (changed) {
        writeFileSync(jsonPath, JSON.stringify(pkgJson, null, 2), {
          encoding: 'utf-8',
        })
      }
    },
    {
      concurrency: 10,
    }
  )

  console.info(` repair scripts: ${packagePaths.map((x) => x.name).join('\n')}`)

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


  console.info(` repair LICENSE`)

  await pMap(
    packagePaths,
    async ({ location }) => {
      let licenseFile = join(process.cwd(), location, 'LICENSE')
      try {
        await access(licenseFile)
      } catch {
        await writeFile(licenseFile, `
  MIT License

  Copyright (c) 2020 Nate Wienert
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
        
        `.trim() + '\n')
      }
    },
    {
      concurrency: 10,
    }
  )
}
