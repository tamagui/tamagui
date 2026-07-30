import { afterEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const temporaryDirectories: string[] = []

function runCodemod(source: string, transforms = false): string {
  const directory = mkdtempSync(join(tmpdir(), 'flat-values-codemod-'))
  temporaryDirectories.push(directory)
  const sourcePath = join(directory, 'fixture.tsx')
  const reportPath = join(directory, 'report.md')
  writeFileSync(sourcePath, source)

  const result = Bun.spawnSync({
    cmd: [
      process.execPath,
      'src/index.ts',
      ...(transforms ? ['--transforms'] : []),
      '--report',
      reportPath,
      sourcePath,
    ],
    cwd: packageDir,
    stderr: 'pipe',
    stdout: 'pipe',
  })
  expect(result.exitCode, result.stderr.toString()).toBe(0)
  return readFileSync(reportPath, 'utf8')
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true })
  }
})

describe('flat-values codemod', () => {
  test('emits template literals for safe dynamic bases with legacy clauses', () => {
    const report = runCodemod(`
      export function Fixture({ active, state, getOpacity }) {
        return <>
          <View opacity={active ? 0.5 : 1} hoverStyle={{ opacity: 1 }} />
          <View width={active ? 10 : 20} hoverStyle={{ width: 30 }} />
          <View opacity={state.opacity} hoverStyle={{ opacity: 1 }} />
          <View opacity={getOpacity("a  b")} hoverStyle={{ opacity: 1 }} />
          <View width={state.width} hoverStyle={{ width: 30 }} />
          <View p={active ? 4 : 8} paddingTop={2} hoverStyle={{ paddingRight: 3 }} />
        </>
      }
    `)

    expect(report).toContain('opacity={`${active ? 0.5 : 1} hover:1`}')
    expect(report).toContain('width={`${active ? 10 : 20}px hover:30px`}')
    expect(report).toContain('opacity={`${state.opacity} hover:1`}')
    expect(report).toContain('opacity={`${getOpacity("a  b")} hover:1`}')
    expect(report).toContain(
      '**condition-targets-unconvertible-prop**: "width" contributes to "width"'
    )
    expect(report).toContain('paddingTop={2}')
    expect(report).not.toContain('paddingTop={`${active ? 4 : 8}px')
  })

  test('keeps transform conversion opt-in', () => {
    const source = `
      export function Fixture() {
        return <View enterStyle={{ scale: 0.9 }} hoverStyle={{ x: 4 }} />
      }
    `
    const defaultReport = runCodemod(source)
    const transformReport = runCodemod(source, true)

    expect(defaultReport).toContain('Transform-part conversion: disabled.')
    expect(defaultReport).toContain('**legacy-transform-part**')
    expect(transformReport).toContain('Transform-part conversion: enabled.')
    expect(transformReport).toContain('scale="1 enter:0.9"')
    expect(transformReport).toContain('x="0 hover:4px"')
    expect(transformReport).not.toContain('**legacy-transform-part**')
  })
})
