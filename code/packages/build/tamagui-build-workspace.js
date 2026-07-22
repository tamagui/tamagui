#!/usr/bin/env node
/* eslint-disable no-console */

const { spawn } = require('node:child_process')
const os = require('node:os')
const path = require('node:path')
const FSE = require('fs-extra')
const fastGlob = require('fast-glob')
const chokidar = require('chokidar')

const args = process.argv.slice(2)
const root = path.resolve(readOption('--root') || process.cwd())
const shouldWatch = args.includes('--watch')
const shouldList = args.includes('--list')
const skipInitialBuild = Boolean(process.env.SKIP_INITIAL_BUILD)
const requestedConcurrency = Number(readOption('--concurrency'))
const concurrency =
  Number.isInteger(requestedConcurrency) && requestedConcurrency > 0
    ? requestedConcurrency
    : Math.min(8, os.availableParallelism())
const filters = readOptions('--filter')
const buildScript = path.join(__dirname, 'tamagui-build.js')

function readOption(name) {
  const index = args.indexOf(name)
  return index === -1 ? null : args[index + 1]
}

function readOptions(name) {
  const values = []
  for (let index = 0; index < args.length; index++) {
    if (args[index] === name && args[index + 1]) {
      values.push(args[index + 1])
    }
  }
  return values
}

function getBuildArgs(command) {
  const tokens = command.split(/\s+/).filter(Boolean)
  const commandIndex = tokens.findIndex(
    (token) => token === 'tamagui-build' || token.endsWith('/tamagui-build.js')
  )
  if (commandIndex === -1) return null

  const packageArgs = tokens.slice(commandIndex + 1)
  const output = packageArgs.filter((arg) => arg !== '--watch')

  if (args.includes('--skip-types') && !output.includes('--skip-types')) {
    output.push('--skip-types')
  }

  return output
}

function getWorkspacePackages() {
  const rootPackage = FSE.readJSONSync(path.join(root, 'package.json'))
  const workspaces = Array.isArray(rootPackage.workspaces)
    ? rootPackage.workspaces
    : rootPackage.workspaces?.packages || []
  const packageJsonPatterns = workspaces.map((workspace) =>
    path.posix.join(workspace.replace(/^\.\//, ''), 'package.json')
  )
  const packageJsonPaths = fastGlob.sync(packageJsonPatterns, {
    cwd: root,
    absolute: true,
    onlyFiles: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  })

  return packageJsonPaths
    .map((packageJsonPath) => {
      const packageRoot = path.dirname(packageJsonPath)
      const packageJson = FSE.readJSONSync(packageJsonPath)
      const selectedCommand = shouldWatch
        ? packageJson.scripts?.watch || packageJson.scripts?.['build:watch']
        : packageJson.scripts?.build
      if (!selectedCommand) return null

      const packageArgs =
        getBuildArgs(selectedCommand) || getBuildArgs(packageJson.scripts?.build || '')
      const command = packageArgs ? null : packageJson.scripts?.build

      if (!packageArgs && !command) return null
      if (filters.length && !filters.includes(packageJson.name)) return null

      return {
        name: packageJson.name,
        root: packageRoot,
        src: path.join(packageRoot, 'src'),
        args: packageArgs,
        command,
        dependencies: Object.keys({
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
          ...packageJson.optionalDependencies,
        }),
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))
}

const packages = getWorkspacePackages()
const packageNames = new Set(packages.map((item) => item.name))
const scheduledBuilds = new Set()
const completedBuilds = new Set()
const failedBuilds = new Set()
const queuedRoots = new Set()
const dirtyRoots = new Set()
const runningChildren = new Set()
const queue = []
let running = 0
let shuttingDown = false

function enqueue(item) {
  if (queuedRoots.has(item.root)) {
    dirtyRoots.add(item.root)
    return
  }

  queuedRoots.add(item.root)
  queue.push(item)
  drainQueue()
}

function drainQueue() {
  while (!shuttingDown && running < concurrency && queue.length) {
    const item = queue.shift()
    running++

    const child = item.command
      ? spawn(item.command, {
          cwd: item.root,
          env: process.env,
          shell: true,
          stdio: 'inherit',
        })
      : spawn(process.execPath, [buildScript, ...item.args], {
          cwd: item.root,
          env: process.env,
          stdio: 'inherit',
        })
    runningChildren.add(child)

    child.on('exit', (code, signal) => {
      runningChildren.delete(child)
      running--
      queuedRoots.delete(item.root)

      const failed = Boolean(code || signal)

      if (code && !shuttingDown) {
        console.error(`build failed for ${item.name} with exit code ${code}`)
        if (!shouldWatch) process.exitCode = code
      } else if (signal && !shuttingDown) {
        console.error(`build stopped for ${item.name} by ${signal}`)
        if (!shouldWatch) process.exitCode = 1
      }

      if (dirtyRoots.delete(item.root)) {
        enqueue(item)
      }

      if (!shouldWatch) {
        if (failed) {
          failedBuilds.add(item.name)
        } else {
          completedBuilds.add(item.name)
        }
        scheduleWorkspaceBuilds()
      }

      drainQueue()
    })
  }
}

function scheduleWorkspaceBuilds() {
  let scheduled = false

  for (const item of packages) {
    if (scheduledBuilds.has(item.name)) continue

    const workspaceDependencies = item.dependencies.filter((dependency) =>
      packageNames.has(dependency)
    )
    const failedDependency = workspaceDependencies.find((dependency) =>
      failedBuilds.has(dependency)
    )

    if (failedDependency) {
      scheduledBuilds.add(item.name)
      failedBuilds.add(item.name)
      process.exitCode = 1
      console.error(`skipping ${item.name} because ${failedDependency} failed`)
      scheduled = true
      continue
    }

    if (workspaceDependencies.every((dependency) => completedBuilds.has(dependency))) {
      scheduledBuilds.add(item.name)
      enqueue(item)
      scheduled = true
    }
  }

  if (
    scheduled &&
    running === 0 &&
    queue.length === 0 &&
    scheduledBuilds.size < packages.length
  ) {
    scheduleWorkspaceBuilds()
    return
  }

  if (running === 0 && queue.length === 0 && scheduledBuilds.size < packages.length) {
    const blocked = packages
      .filter((item) => !scheduledBuilds.has(item.name))
      .map((item) => item.name)
    process.exitCode = 1
    console.error(`workspace dependency cycle: ${blocked.join(', ')}`)
  }
}

async function shutdown(signal) {
  if (shuttingDown) return
  shuttingDown = true
  await watcher?.close()
  for (const child of runningChildren) {
    child.kill(signal)
  }
}

if (shouldList) {
  for (const item of packages) {
    console.info(
      `${item.name}\t${path.relative(root, item.root)}\t${item.command || `tamagui-build ${item.args.join(' ')}`}`
    )
  }
  process.exit(0)
}

let watcher = null

if (shouldWatch) {
  const sourceRoots = packages.filter((item) => FSE.existsSync(item.src))
  const sourceRootByPath = [...sourceRoots]
    .sort((a, b) => b.src.length - a.src.length)
    .map((item) => [item.src + path.sep, item])

  watcher = chokidar.watch(
    sourceRoots.map((item) => item.src),
    {
      persistent: true,
      ignoreInitial: true,
    }
  )

  const rebuild = (filePath) => {
    const absolutePath = path.resolve(filePath)
    const match = sourceRootByPath.find(([sourceRoot]) =>
      `${absolutePath}${path.sep}`.startsWith(sourceRoot)
    )
    if (match) enqueue(match[1])
  }

  watcher.on('add', rebuild).on('change', rebuild).on('unlink', rebuild)

  if (!skipInitialBuild) {
    for (const item of sourceRoots) enqueue(item)
  }

  console.info(`watching ${sourceRoots.length} workspace packages with one watcher`)
} else {
  scheduleWorkspaceBuilds()
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
