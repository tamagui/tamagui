import JSON5 from 'json5'
import * as proc from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'

import {
  access,
  existsSync,
  lstat,
  pathExists,
  readFile,
  readJSON,
  rm,
  symlink,
  writeFile,
  writeJSON,
} from 'fs-extra'
import pMap from 'p-map'

const exec = promisify(proc.exec)

format()

const fixExports = async ({ location }, pkgJson: any) => {
  if (pkgJson.exports) {
    for (const key in pkgJson.exports) {
      const val = pkgJson.exports[key]

      if (typeof val !== 'object') continue
      if (!val.require) continue
      if (!val.require.endsWith('.js')) continue
      if (!val.require.includes('dist/cjs')) continue

      // ensure react-native entry
      val['react-native'] = val.require.replace('.js', '.native.js')

      const ordered = Object.keys(val)
      if (ordered[0] !== 'react-native') {
        const sorted = {}
        // put react-native on the object first so its ordered first
        sorted['react-native'] = val['react-native']
        for (const key in val) {
          sorted[key] = val[key]
        }
        pkgJson.exports[key] = sorted
      }
    }
  }
}

const fixPeerDeps = async ({ location }, pkgJson: any) => {
  if (pkgJson.devDependencies?.['react'] && !pkgJson.peerDependencies?.['react']) {
    pkgJson.peerDependencies ||= {}
    pkgJson.peerDependencies['react'] ||= '*'
  }
}

const fixScripts = async ({ location }, pkgJson: any) => {
  if (pkgJson.devDependencies?.['@tamagui/build']) {
    if (!pkgJson.scripts['clean']) {
      pkgJson.scripts['clean'] = 'tamagui-build clean'
      pkgJson.scripts['clean:build'] = 'tamagui-build clean:build'
    }
  }
}

const fixExportsPathSpecific = async ({ name, location }, pkgJson: any) => {
  if (pkgJson.exports) {
    Object.keys(pkgJson.exports).forEach((key) => {
      const obj = pkgJson.exports?.[key]
      const importField = obj?.import
      if (importField?.endsWith('.js')) {
        obj.import = importField.replace('.js', '.mjs')
      }

      const requireField = obj?.require
      if (requireField?.endsWith('.js')) {
        obj.require = requireField.replace('.js', '.cjs')
      }
    })
  }
}

async function format() {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
    name: string
    location: string
  }[]

  console.info(` packages: ${packagePaths.length}`)

  // console.info(` repair package.json..`)

  await pMap(
    packagePaths,
    async (pkg) => {
      const cwd = join(process.cwd(), pkg.location)
      const jsonPath = join(cwd, 'package.json')
      const pkgJson = JSON.parse(
        readFileSync(jsonPath, {
          encoding: 'utf-8',
        })
      )
      // await fixPeerDeps(pkg, pkgJson)
      // await fixExports(pkg, pkgJson)
      await fixExportsPathSpecific(pkg, pkgJson)
      // await fixScripts(pkg, pkgJson)
      await writeFile(jsonPath, JSON.stringify(pkgJson, null, 2) + '\n', {
        encoding: 'utf-8',
      })
    },
    {
      concurrency: 10,
    }
  )

  // console.info(` repair contents exclude to exclude /types..`)

  // await pMap(
  //   packagePaths,
  //   async ({ name, location }) => {
  //     // only run on packages/components:
  //     if (
  //       !location.startsWith('code/packages/') &&
  //       !location.startsWith('code/components')
  //     ) {
  //       return
  //     }

  //     try {
  //       const cwd = join(process.cwd(), location)
  //       const file = join(cwd, 'tsconfig.json')
  //       const contents = await readFile(file, {
  //         encoding: 'utf-8',
  //       })

  //       const tsconfig = JSON5.parse(contents)

  //       if (existsSync(join(cwd, 'types'))) {
  //         const always = ['types', 'dist', '**/__tests__']

  //         if (
  //           !tsconfig.exclude ||
  //           (Array.isArray(tsconfig.exclude) &&
  //             always.some((a) => !tsconfig.exclude.includes(a)))
  //         ) {
  //           tsconfig.exclude ||= []
  //           for (const a of always) {
  //             tsconfig.exclude.push(a)
  //           }
  //           tsconfig.exclude = [...new Set(tsconfig.exclude)]
  //           console.info('write', file, tsconfig)
  //           await writeJSON(file, tsconfig, {
  //             spaces: 2,
  //           })
  //         }
  //       }
  //     } catch (err) {
  //       console.error(`Error with`, { name, location }, err.message)
  //       return
  //     }
  //   },
  //   {
  //     concurrency: 10,
  //   }
  // )

  // console.info(` repair biome`)

  // await pMap(
  //   packagePaths,
  //   async ({ location }) => {
  //     if (
  //       !location.startsWith('code/packages') &&
  //       !location.startsWith('code/components')
  //     ) {
  //       return
  //     }

  //     const distanceToRoot = location.split('/').length
  //     const biomeFile = join(location, 'biome.json')
  //     const shouldSymlink =
  //       // not there
  //       !(await pathExists(biomeFile)) ||
  //       // not already a file
  //       !(await lstat(biomeFile)).isFile()

  //     if (shouldSymlink) {
  //       await rm(biomeFile)
  //       await symlink(
  //         biomeFile,
  //         join(
  //           location,
  //           ...new Array(distanceToRoot).fill(0).map(() => '..'),
  //           'biome.json'
  //         )
  //       )
  //     }
  //   },
  //   {
  //     concurrency: 10,
  //   }
  // )

  console.info(` repair tsconfig root reference`)

  await pMap(
    packagePaths,
    async ({ location }) => {
      const tsconfigFile = join(location, 'tsconfig.json')
      if (!(await pathExists(tsconfigFile))) {
        return
      }
      try {
        const contents = JSON5.parse(await readFile(tsconfigFile, 'utf-8'))
        const extendsField = contents.extends
        if (typeof extendsField === 'string') {
          if (extendsField.endsWith('/../tsconfig.json')) {
            const distanceToRoot = location.split('/').length
            // ensure extends field is right no matter depth
            contents.extends = join(
              ...new Array(distanceToRoot).fill(0).map(() => '..'),
              'tsconfig.json'
            )
            await writeJSON(tsconfigFile, contents, {
              spaces: 2,
            })
          }
        }
      } catch (err) {
        console.error(`Error parsing/writing json`, tsconfigFile, err)
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
      if (
        !location.startsWith('code/packages') &&
        !location.startsWith('code/components')
      ) {
        return
      }

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
