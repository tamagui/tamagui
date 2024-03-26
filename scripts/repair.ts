import JSON5 from 'json5'
import * as proc from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'

import {
  access,
  accessSync,
  existsSync,
  readFile,
  readJSON,
  writeFile,
  writeJSON,
} from 'fs-extra'
import pMap from 'p-map'

const exec = promisify(proc.exec)

format()

async function format() {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
    name: string
    location: string
  }[]

  console.info(` packages: ${packagePaths.length}`)

  console.info(` repair exports..`)

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
        writeFileSync(jsonPath, JSON.stringify(pkgJson, null, 2) + '\n', {
          encoding: 'utf-8',
        })
      }
    },
    {
      concurrency: 10,
    }
  )

  console.info(` repair scripts..`)

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
          writeFileSync(jsonPath, JSON.stringify(pkgJson, null, 2) + '\n', {
            encoding: 'utf-8',
          })
        }
      }
    },
    {
      concurrency: 10,
    }
  )

  console.info(` repair esm mjs exports..`)

  await pMap(
    packagePaths,
    async ({ name, location }) => {
      if (name === '@tamagui/static') {
        return
      }

      const cwd = join(process.cwd(), location)
      const jsonPath = join(cwd, 'package.json')
      const pkgJson = JSON.parse(
        readFileSync(jsonPath, {
          encoding: 'utf-8',
        })
      )

      if (pkgJson.exports) {
        Object.keys(pkgJson.exports).forEach((key) => {
          const obj = pkgJson.exports?.[key]
          const importField = obj?.import
          if (importField?.endsWith('.js')) {
            obj.import = importField.replace('.js', '.mjs')
            writeFileSync(jsonPath, JSON.stringify(pkgJson, null, 2) + '\n', {
              encoding: 'utf-8',
            })
          }
        })
      }
    },
    {
      concurrency: 10,
    }
  )

  console.info(` repair package.json source paths..`)

  await pMap(
    packagePaths,
    async ({ name, location }) => {
      if (
        name === 'tamagui-monorepo' ||
        location.startsWith('apps/') ||
        name === '@tamagui/demos'
      ) {
        return
      }

      const cwd = join(process.cwd(), location)
      const jsonPath = join(cwd, 'package.json')
      const pkgJson = JSON.parse(
        readFileSync(jsonPath, {
          encoding: 'utf-8',
        })
      )

      if (!pkgJson.source) {
        console.warn(`No source`, name, location)
        return
      }

      try {
        accessSync(join(cwd, pkgJson.source))
      } catch {
        console.info(`Source not found`, { name, location })

        let [filepath, ext] = pkgJson.source.split('.')

        try {
          const potentialName = `${filepath}.${ext === 'ts' ? 'tsx' : 'ts'}`
          const potential = join(cwd, potentialName)
          accessSync(potential)
          pkgJson.source = potentialName
          await writeJSON(jsonPath, pkgJson, {
            spaces: 2,
          })
        } catch {
          console.error(`No entry file?`, name, location)
          process.exit(1)
        }
      }
    },
    {
      concurrency: 10,
    }
  )

  console.info(` repair contents exclude to exclude /types..`)

  await pMap(
    packagePaths,
    async ({ name, location }) => {
      if (name === 'tamagui-monorepo' || location.startsWith('apps/')) {
        return
      }

      try {
        const cwd = join(process.cwd(), location)
        const file = join(cwd, 'tsconfig.json')
        console.info('go', file)
        const contents = await readFile(file, {
          encoding: 'utf-8',
        })

        const tsconfig = JSON5.parse(contents)

        if (existsSync(join(cwd, 'types'))) {
          const always = ['types', 'dist', '**/__tests__']

          if (
            !tsconfig.exclude ||
            (Array.isArray(tsconfig.exclude) &&
              always.some((a) => !tsconfig.exclude.includes(a)))
          ) {
            tsconfig.exclude ||= []
            for (const a of always) {
              tsconfig.exclude.push(a)
            }
            tsconfig.exclude = [...new Set(tsconfig.exclude)]
            console.info('write', file, tsconfig)
            await writeJSON(file, tsconfig, {
              spaces: 2,
            })
          }
        }
      } catch (err) {
        console.error(`Error with`, { name, location }, err.message)
        return
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
        await writeFile(
          licenseFile,
          `
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
        
        `.trim() + '\n'
        )
      }
    },
    {
      concurrency: 10,
    }
  )
}
