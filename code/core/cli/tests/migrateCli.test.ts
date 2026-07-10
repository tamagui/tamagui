import { describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'

const cliRoot = process.cwd()

describe('tamagui migrate', () => {
  it('prints the v2 to v3 migration prompt', () => {
    const result = spawnSync('bun', ['src/index.ts', 'migrate', '--from', 'v2'], {
      cwd: cliRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        FORCE_COLOR: '0',
      },
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('You are migrating a Tamagui app from v2 to v3.')
    expect(result.stdout).toContain('sheet-frame-to-container.js')
    expect(result.stdout).toContain('Sheet.Frame')
    expect(result.stdout).toContain('FocusScope')
    expect(result.stdout).toContain('Select.Separator')
    expect(result.stdout).toContain('### 13. Verification')
  })

  it('prints the v1 to v3 migration prompt with a v1 to v2 pass first', () => {
    const result = spawnSync('bun', ['src/index.ts', 'migrate', 'v1'], {
      cwd: cliRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        FORCE_COLOR: '0',
      },
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('You are migrating a Tamagui app from v1 to v3.')
    expect(result.stdout).toContain('## v1 -> v2 migration pass')
    expect(result.stdout).toContain('`animation` -> `transition`')
    expect(result.stdout).toContain('After the v1 to v2 pass is complete')
    expect(result.stdout).toContain('## v2 -> v3 migration prompt')
  })

  it('prints concise command help', () => {
    const result = spawnSync('bun', ['src/index.ts', 'migrate', '--help'], {
      cwd: cliRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        FORCE_COLOR: '0',
      },
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('$ tamagui migrate:')
    expect(result.stdout).toContain('$ tamagui migrate --from v2')
    expect(result.stdout).toContain('--from (String)')
  })
})
