import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const cliRoot = process.cwd()
const toTailwindRoot = join(cliRoot, '../to-tailwind')
const tempDirs: string[] = []

function runCli(args: string[]) {
  return spawnSync('bun', ['src/index.ts', 'to-tailwind', ...args], {
    cwd: cliRoot,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0' },
  })
}

async function fixture(files: Record<string, string>): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'tw-cli-'))
  tempDirs.push(dir)
  for (const [name, content] of Object.entries(files)) {
    await writeFile(join(dir, name), content)
  }
  return dir
}

describe('tamagui to-tailwind CLI', () => {
  beforeAll(() => {
    const build = spawnSync('bun', ['run', 'build', '--skip-types'], {
      cwd: toTailwindRoot,
      encoding: 'utf8',
    })
    if (build.status !== 0) {
      throw new Error(`Failed to build @tamagui/to-tailwind:\n${build.stdout}\n${build.stderr}`)
    }
  })

  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
  })

  it('dry-run with no config: warns about default scales, PRESERVES components, shows output', async () => {
    const dir = await fixture({
      'Card.tsx': `import { Text, YStack } from 'tamagui'
export function Card() {
  return (
    <YStack padding={10} backgroundColor="$background" gap={4}>
      <Text color="$color" fontWeight="700">Title</Text>
    </YStack>
  )
}
`,
    })
    const run = runCli([dir])
    expect(run.status).toBe(0)
    // loud default-scales warning (previously claimed but never fired)
    expect(run.stderr + run.stdout).toMatch(/BUNDLED DEFAULT|default.*scales/i)
    // components PRESERVED (not DOM-renamed) so the native app keeps working
    expect(run.stdout).toContain('flex flex-col p-[10px] bg-background gap-[4px]')
    expect(run.stdout).toContain('YStack') // NOT div
    expect(run.stdout).not.toContain('<div')
  })

  it('--write with NO config ABORTS (never guesses token pixels)', async () => {
    const dir = await fixture({
      'A.tsx': `import {View} from 'tamagui'\nexport const A = () => <View padding={10} />\n`,
    })
    const before = await readFile(join(dir, 'A.tsx'), 'utf8')
    const run = runCli([join(dir, 'A.tsx'), '--write'])
    expect(run.status).not.toBe(0)
    expect(run.stderr).toMatch(/--write requires/i)
    expect(await readFile(join(dir, 'A.tsx'), 'utf8')).toBe(before) // untouched
  })

  it('--write --use-default-config proceeds (defaults) and PRESERVES components', async () => {
    const dir = await fixture({
      'A.tsx': `import {View} from 'tamagui'\nexport const A = () => <View padding="$4" />\n`,
    })
    const run = runCli([join(dir, 'A.tsx'), '--write', '--use-default-config'])
    expect(run.status).toBe(0)
    const out = await readFile(join(dir, 'A.tsx'), 'utf8')
    expect(out).toContain('p-[18px]') // default v5 space $4 = 18
    expect(out).toContain('<View') // preserved, not div
  })

  it('--write --config <good> uses the APP scales (not the default)', async () => {
    const dir = await fixture({
      'tw.config.ts': `export const config = { tokens: { space: { $4: 20 } }, media: { tablet: { minWidth: 900 } } }\n`,
      'A.tsx': `import {View} from 'tamagui'\nexport const A = () => <View padding="$4" $tablet={{ padding: 10 }} />\n`,
    })
    const run = runCli([join(dir, 'A.tsx'), '--write', '--config', join(dir, 'tw.config.ts')])
    expect(run.status).toBe(0)
    const out = await readFile(join(dir, 'A.tsx'), 'utf8')
    expect(out).toContain('p-[20px]') // app space $4 = 20 (NOT the default 18)
    expect(out).not.toContain('p-[18px]')
    expect(out).toContain('tablet:p-[10px]') // app custom media round-trips
  })

  it('--config that fails to load ABORTS, no write', async () => {
    const dir = await fixture({
      'A.tsx': `import {View} from 'tamagui'\nexport const A = () => <View padding={10} />\n`,
    })
    const before = await readFile(join(dir, 'A.tsx'), 'utf8')
    const run = runCli([join(dir, 'A.tsx'), '--write', '--config', join(dir, 'nope.ts')])
    expect(run.status).not.toBe(0)
    expect(run.stderr).toMatch(/could not be loaded|aborted/i)
    expect(await readFile(join(dir, 'A.tsx'), 'utf8')).toBe(before)
  })

  it('--config with an invalid shape ABORTS', async () => {
    const dir = await fixture({
      'bad.config.ts': `export const nope = 1\n`,
      'A.tsx': `import {View} from 'tamagui'\nexport const A = () => <View padding={10} />\n`,
    })
    const run = runCli([join(dir, 'A.tsx'), '--config', join(dir, 'bad.config.ts')])
    expect(run.status).not.toBe(0)
    expect(run.stderr).toMatch(/invalid config shape|no \{ tokens/i)
  })

  it('a recoverable parse error ABORTS before any write; file untouched', async () => {
    const dir = await fixture({
      'Bad.tsx': `const x = 1 2;\nimport {View} from 'tamagui'\nexport const A = () => <View padding={10} />\n`,
    })
    const before = await readFile(join(dir, 'Bad.tsx'), 'utf8')
    const run = runCli([join(dir, 'Bad.tsx'), '--write', '--use-default-config'])
    expect(run.status).not.toBe(0)
    expect(run.stderr).toMatch(/parse error/i)
    expect(await readFile(join(dir, 'Bad.tsx'), 'utf8')).toBe(before) // never mutated
  })

  it('--rename-dom opts INTO DOM renaming', async () => {
    const dir = await fixture({
      'A.tsx': `import {YStack} from 'tamagui'\nexport const A = () => <YStack padding={10} />\n`,
    })
    const run = runCli([join(dir, 'A.tsx'), '--write', '--use-default-config', '--rename-dom'])
    expect(run.status).toBe(0)
    const out = await readFile(join(dir, 'A.tsx'), 'utf8')
    expect(out).toContain('<div')
    expect(out).not.toContain('<YStack')
  })

  it('arbitrary components UNTOUCHED; known compound (Sheet.*) converts', async () => {
    const dir = await fixture({
      'A.tsx': `import {Sheet} from 'tamagui'
export const A = () => <Chart width={640} height={480} data={rows} />
export const B = () => <Sheet.Frame padding={10} />
`,
    })
    const run = runCli([join(dir, 'A.tsx'), '--write', '--use-default-config'])
    expect(run.status).toBe(0)
    const out = await readFile(join(dir, 'A.tsx'), 'utf8')
    // Chart: every prop preserved, nothing converted, no className added
    expect(out).toContain('<Chart width={640} height={480} data={rows} />')
    expect(out).not.toMatch(/Chart[^>]*className/)
    // Sheet.Frame (known compound) converts, member path preserved
    expect(out).toContain('<Sheet.Frame')
    expect(out).toContain('p-[10px]')
  })
})
