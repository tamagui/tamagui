import { execSync, type ExecSyncOptions } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import { createCacheKey, loadCache, saveCache } from './cache'
import { generateFingerprint } from './fingerprint'
import type { Platform } from './constants'

export interface RunWithCacheOptions {
  platform: Platform
  buildCommand: string
  outputPaths: string[]
  projectRoot?: string
  preHashFiles?: string[]
  cachePrefix?: string
  debug?: boolean
}

export interface RunWithCacheResult {
  cacheHit: boolean
  fingerprint: string
  cacheKey: string
  outputPaths: string[]
}

/**
 * Run a build command with fingerprint-based caching.
 * If the fingerprint matches a cached build, skip the build.
 */
export async function runWithCache(
  options: RunWithCacheOptions
): Promise<RunWithCacheResult> {
  const {
    platform,
    buildCommand,
    outputPaths,
    projectRoot = process.cwd(),
    cachePrefix = 'native-build',
    debug = false,
  } = options

  const log = debug ? console.log : () => {}

  // Step 1: Generate fingerprint
  log(`Generating ${platform} fingerprint...`)
  const { hash: fingerprint } = await generateFingerprint({
    platform,
    projectRoot,
    debug,
  })
  log(`Fingerprint: ${fingerprint}`)

  // Step 2: Check cache
  const cacheKey = createCacheKey({ platform, fingerprint, prefix: cachePrefix })
  log(`Cache key: ${cacheKey}`)

  const cached = loadCache<{ fingerprint: string; timestamp: string }>(cacheKey)

  if (cached && cached.fingerprint === fingerprint) {
    log('Cache hit! Skipping build.')
    return {
      cacheHit: true,
      fingerprint,
      cacheKey,
      outputPaths,
    }
  }

  // Step 3: Run build
  log(`Running build: ${buildCommand}`)
  const execOptions: ExecSyncOptions = {
    cwd: projectRoot,
    stdio: debug ? 'inherit' : ['pipe', 'pipe', 'pipe'],
  }

  try {
    execSync(buildCommand, execOptions)
  } catch (error) {
    const err = error as Error & { stderr?: string }
    throw new Error(`Build failed: ${err.message}${err.stderr ? `\n${err.stderr}` : ''}`)
  }

  // Step 4: Save cache
  saveCache(cacheKey, {
    fingerprint,
    timestamp: new Date().toISOString(),
    platform,
    outputPaths,
  })

  return {
    cacheHit: false,
    fingerprint,
    cacheKey,
    outputPaths,
  }
}

/**
 * GitHub Actions helper - outputs values for workflow.
 * Uses the modern GITHUB_OUTPUT file method.
 */
export function setGitHubOutput(name: string, value: string): void {
  const outputFile = process.env.GITHUB_OUTPUT
  if (outputFile) {
    appendFileSync(outputFile, `${name}=${value}\n`)
  } else {
    // Fallback for local testing - just log it
    console.info(`[GitHub Output] ${name}=${value}`)
  }
}

/**
 * Check if running in GitHub Actions.
 */
export function isGitHubActions(): boolean {
  return !!process.env.GITHUB_ACTIONS
}

/**
 * Check if running in CI.
 */
export function isCI(): boolean {
  return !!process.env.CI
}
