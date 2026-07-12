import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const cliRoot = process.cwd()
const toTailwindRoot = join(cliRoot, '../to-tailwind')
const tempDirs: string[] = []

describe('tamagui to-tailwind', () => {
  beforeAll(() => {
    const build = spawnSync('bun', ['run', 'build', '--skip-types'], {
      cwd: toTailwindRoot,
      encoding: 'utf8',
    })

    if (build.status !== 0) {
      throw new Error(
        `Failed to build @tamagui/to-tailwind:\n${build.stdout}\n${build.stderr}`
      )
    }
  })

  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((dir) => {
        return rm(dir, { recursive: true, force: true })
      })
    )
  })

  it('prints a dry-run diff by default and writes with --write', async () => {
    const fixtureDir = await mkdtemp(join(tmpdir(), 'tamagui-to-tailwind-'))
    tempDirs.push(fixtureDir)

    const sourcePath = join(fixtureDir, 'Card.tsx')
    const source = `import { Text, YStack } from 'tamagui'

export function Card() {
  return (
    <YStack padding={10} backgroundColor="$background" gap={4}>
      <Text color="$color" fontWeight="700">Title</Text>
    </YStack>
  )
}
`

    await writeFile(sourcePath, source)

    const dryRun = spawnSync('bun', ['src/index.ts', 'to-tailwind', fixtureDir], {
      cwd: cliRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        FORCE_COLOR: '0',
      },
    })

    expect(dryRun.status).toBe(0)
    expect(dryRun.stderr).toBe('')
    expect(dryRun.stdout).toContain('Card.tsx')
    expect(dryRun.stdout).toContain(
      'className="flex flex-col p-[10px] bg-background gap-[4px]"'
    )
    expect(dryRun.stdout).toContain('[dry-run] 1 of 1 file(s) would change')
    expect(await readFile(sourcePath, 'utf8')).toBe(source)

    const write = spawnSync(
      'bun',
      ['src/index.ts', 'to-tailwind', join(fixtureDir, '*.tsx'), '--write'],
      {
        cwd: cliRoot,
        encoding: 'utf8',
        env: {
          ...process.env,
          FORCE_COLOR: '0',
        },
      }
    )

    expect(write.status).toBe(0)
    expect(write.stderr).toBe('')
    expect(write.stdout).toContain('Converted 1 of 1 file(s).')

    const transformed = await readFile(sourcePath, 'utf8')
    expect(transformed).toContain(
      'className="flex flex-col p-[10px] bg-background gap-[4px]"'
    )
    // text color uses the `color-*` utility (v6 `text` is textAlign)
    expect(transformed).toContain('className="color-color font-bold"')
    expect(transformed).not.toContain('<YStack')
  })
})
