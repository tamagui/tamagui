import { execSync, type ExecSyncOptions } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Platform } from './constants'

export interface FingerprintOptions {
  platform: Platform
  projectRoot?: string
  debug?: boolean
}

export interface FingerprintResult {
  hash: string
  sources: string[]
}

/**
 * Generate a fingerprint for the native build using @expo/fingerprint.
 * The fingerprint changes when native dependencies change, indicating a rebuild is needed.
 */
export async function generateFingerprint(
  options: FingerprintOptions
): Promise<FingerprintResult> {
  const { platform, projectRoot = process.cwd(), debug = false } = options

  // Check if we're in a valid Expo project
  const appJsonPath = join(projectRoot, 'app.json')
  if (!existsSync(appJsonPath)) {
    throw new Error(`No app.json found at ${projectRoot}. Is this an Expo project?`)
  }

  const execOptions: ExecSyncOptions = {
    cwd: projectRoot,
    encoding: 'utf-8',
    stdio: debug ? 'inherit' : ['pipe', 'pipe', 'pipe'],
  }

  try {
    const result = execSync(
      `npx @expo/fingerprint fingerprint:generate --platform ${platform}`,
      execOptions
    ) as string

    const parsed = JSON.parse(result)

    return {
      hash: parsed.hash,
      sources: parsed.sources || [],
    }
  } catch (error) {
    const err = error as Error & { stderr?: string }
    throw new Error(
      `Failed to generate ${platform} fingerprint: ${err.message}${err.stderr ? `\n${err.stderr}` : ''}`
    )
  }
}

/**
 * Generate a quick pre-fingerprint hash based on common files that affect native builds.
 * This is faster than a full fingerprint and can be used for initial cache lookups.
 */
export function generatePreFingerprintHash(
  files: string[],
  projectRoot: string = process.cwd()
): string {
  const hash = createHash('sha256')

  for (const file of files) {
    const filePath = join(projectRoot, file)
    if (existsSync(filePath)) {
      hash.update(readFileSync(filePath))
    }
  }

  return hash.digest('hex').slice(0, 16)
}
