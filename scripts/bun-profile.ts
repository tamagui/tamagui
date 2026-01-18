/**
 * This file is only relevant if you have multiple bun repos and you want to work on them together.
 * It lets you quickly switch between sets of "resolutions" without dirtying up your git.
 *
 * Add a "profile" to your root package.json, then named keys, then the resolutions.
 *
 * "bun run profile [name]" will toggle them on or off.
 *
 * One key feature is it will turn ~ into your home dir, which normally bun doesn't support.
 */

import { spawn, type SpawnOptions } from 'node:child_process'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import * as path from 'node:path'

interface PackageJson {
  profile?: { [key: string]: any }
  workspaces?: string[]
  [key: string]: any
}

async function getWorkspacePackages(workspacePath: string, exclude: string[] = []) {
  const rootPkg: PackageJson = JSON.parse(
    await fs.readFile(path.join(workspacePath, 'package.json'), 'utf-8')
  )
  const workspaceGlobs = rootPkg.workspaces || []
  const packages: { name: string; location: string }[] = []

  for (const pattern of workspaceGlobs) {
    const baseDir = pattern.replace(/\/\*$/, '').replace(/^\.\//, '')
    try {
      const entries = await fs.readdir(path.join(workspacePath, baseDir), { withFileTypes: true })
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        const pkgPath = path.join(workspacePath, baseDir, entry.name, 'package.json')
        try {
          const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'))
          if (pkg.name && !exclude.includes(pkg.name)) {
            packages.push({ name: pkg.name, location: path.join(baseDir, entry.name) })
          }
        } catch {
          // Skip directories without package.json
        }
      }
    } catch {
      // Skip patterns that don't resolve
    }
  }

  return packages
}

const main = async (name: string) => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson: PackageJson = JSON.parse(packageJsonContent)

  const profile = packageJson.profile && packageJson.profile[name]
  if (!profile) {
    console.info(`Profile "${name}" not found in package.json`)
    return
  }

  // Profile is not applied, merge it
  if (!packageJson.resolutions) packageJson.resolutions = {}

  const resolutions = Object.assign({}, packageJson.resolutions, profile.resolutions)

  if (profile.workspace) {
    const exclude = profile.exclude || []
    const workspacePath = replaceTildeWithHomePath(profile.workspace)
    const packages = await getWorkspacePackages(workspacePath, exclude)

    Object.assign(
      resolutions,
      Object.fromEntries(
        packages.map(({ location, name }) => {
          return [name, `portal:${path.join(workspacePath, location)}`]
        })
      )
    )
  }

  const processedResolutions = processResolutions(resolutions)
  packageJson.resolutions = processedResolutions

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8')

  console.info(`Applying profile "${name}"`)

  try {
    await execy(args.includes('--debug') ? `BUN_DEBUG_LEVEL=2 bun install` : `bun install`)
  } catch {
    console.error(`Failed to apply resolutions`, processedResolutions)
    console.error(`You can re-run with --debug flag to see debug output`)

    await undoChanges()
    // execy forward err to console
    process.exit(1)
  }

  // always undo this in git so its not leaving messy files
  await undoChanges()

  console.info(`\n\n🎉 Profile applied!\n\n`)
}

async function undoChanges() {
  await execy(
    'git reset HEAD -- package.json && git checkout -- package.json && git reset HEAD -- bun.lock && git checkout -- bun.lock',
    { silent: true }
  )
}

// Example usage: pass the profile name as a command-line argument
const args = process.argv.slice(2)
if (args.length !== 1) {
  console.error('Usage: bun run profile <profile-name>')
  process.exit(1)
}

const profileName = args[0]
main(profileName).catch((err) => console.error(err))

const replaceTildeWithHomePath = (value: string) => {
  const homePath = os.homedir()
  return value.replace('~', homePath)
}

const processResolutions = (resolutions: { [key: string]: string }) => {
  const processedResolutions: { [key: string]: string } = {}
  Object.keys(resolutions).forEach((key) => {
    processedResolutions[key] = replaceTildeWithHomePath(resolutions[key])
  })
  return processedResolutions
}

interface RunCommandResult {
  stdout: string
  stderr: string
  code: number | null
  signal: NodeJS.Signals | null
}

interface RunCommandError extends Error {
  code: number | null
  signal: NodeJS.Signals | null
  stdout: string
  stderr: string
}

function execy(
  commandIn: string,
  options: SpawnOptions & { silent?: boolean } = {}
): Promise<RunCommandResult> {
  return new Promise((resolve, reject) => {
    const [command, ...args] = commandIn.split(' ')
    const child = spawn(command, args, {
      ...options,
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (data) => {
      const str = data.toString()
      stdout += str
      if (!options.silent) process.stdout.write(data)
    })

    child.stderr?.on('data', (data) => {
      const str = data.toString()
      stderr += str
      if (!options.silent) process.stderr.write(data)
    })

    child.on('error', (error) => {
      reject(Object.assign(error, { stdout, stderr }))
    })

    child.on('close', (code, signal) => {
      const result = { stdout, stderr, code, signal }

      if (code !== 0) {
        const error = new Error(
          `Command failed: ${command} ${args.join(' ')}`
        ) as RunCommandError
        error.code = code
        error.signal = signal
        error.stdout = stdout
        error.stderr = stderr
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
