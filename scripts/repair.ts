import * as proc from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { readFile, writeFile } from 'fs-extra'
import pMap from 'p-map'

const exec = promisify(proc.exec)

repair()

async function repair() {
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

  console.info(`Found ${packagePaths.length} packages`)
  console.info(`Adding react-compiler-runtime to core and ui packages...`)

  let count = 0

  await pMap(
    packagePaths,
    async (pkg) => {
      const cwd = join(process.cwd(), pkg.location)
      const jsonPath = join(cwd, 'package.json')
      const fileContents = await readFile(jsonPath, { encoding: 'utf-8' })
      if (!fileContents) return

      const pkgJson = JSON.parse(fileContents)

      // Only add to core and ui packages that use tamagui-build
      if (!pkgJson.scripts?.build?.includes('tamagui-build')) {
        return
      }
      if (
        !pkg.location.startsWith('code/core/') &&
        !pkg.location.startsWith('code/ui/')
      ) {
        return
      }
      // Skip packages that explicitly opt out of compiler
      if (pkgJson.scripts?.build?.includes('--skip-compiler')) {
        return
      }

      // Add react-compiler-runtime as a dependency
      pkgJson.dependencies = pkgJson.dependencies || {}
      if (!pkgJson.dependencies['react-compiler-runtime']) {
        pkgJson.dependencies['react-compiler-runtime'] = '>=1.0.0'

        // Sort dependencies alphabetically
        const sorted: Record<string, string> = {}
        for (const key of Object.keys(pkgJson.dependencies).sort()) {
          sorted[key] = pkgJson.dependencies[key]
        }
        pkgJson.dependencies = sorted

        await writeFile(jsonPath, JSON.stringify(pkgJson, null, 2) + '\n', {
          encoding: 'utf-8',
        })
        console.info(`  ✓ ${pkg.name}`)
        count++
      }
    },
    { concurrency: 10 }
  )

  console.info(`\nAdded react-compiler-runtime to ${count} packages`)
}
