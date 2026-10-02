import { describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const cliRoot = process.cwd()

function run(cwd: string, args: string[]) {
  return spawnSync('bun', [path.join(cliRoot, 'src/index.ts'), 'icons', ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0' },
  })
}

describe('tamagui icons add', () => {
  it('generates themed components and an index from a folder of svgs', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'tamagui-icons-'))
    mkdirSync(path.join(dir, 'svgs'))
    writeFileSync(
      path.join(dir, 'svgs', 'circle.svg'),
      `<!-- license --><svg class="x" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10" /><g><path d="M8 12h8" stroke-linejoin="round"/></g></svg>`
    )
    writeFileSync(
      path.join(dir, 'svgs', 'dot.svg'),
      `<svg viewBox="0 0 256 256" fill="currentColor"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="40"/></svg>`
    )

    const result = run(dir, ['add', 'Circle', 'dot', '--from', 'svgs', '--out', 'icons'])
    expect(result.stderr).toBe('')
    expect(result.status).toBe(0)

    const circle = readFileSync(path.join(dir, 'icons', 'Circle.tsx'), 'utf8')
    // the element import is aliased so it cannot collide with the component
    expect(circle).toContain(
      `import { Svg, Circle as _Circle, G, Path } from 'react-native-svg'`
    )
    expect(circle).toContain(
      'export const Circle: (props: IconProps) => JSX.Element = themed('
    )
    expect(circle).toContain('<_Circle cx="12" cy="12" r="10" stroke={color} />')
    // a group passes stroke down; its children carry their own
    expect(circle).toContain('<G>')
    expect(circle).toContain('<Path d="M8 12h8" strokeLinejoin="round" stroke={color} />')
    expect(circle).toContain('}), { defaultStrokeWidth: 1.5 }')
    expect(circle).not.toMatch(/class=|xmlns|width="24"/)

    const dot = readFileSync(path.join(dir, 'icons', 'Dot.tsx'), 'utf8')
    expect(dot).toContain('fill={color}')
    expect(dot).not.toContain('defaultStrokeWidth')

    expect(readFileSync(path.join(dir, 'icons', 'index.ts'), 'utf8')).toBe(
      `export { Circle } from './Circle'\nexport { Dot } from './Dot'\n`
    )
  })

  it('fails on unknown icons and mismatched options without writing', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'tamagui-icons-'))
    mkdirSync(path.join(dir, 'svgs'))

    const unknown = run(dir, ['add', 'Missing', '--from', 'svgs'])
    expect(unknown.status).toBe(1)
    expect(unknown.stderr).toContain('unknown svgs icon: Missing (missing.svg)')

    const weight = run(dir, ['add', 'Search', '--weight', 'bold'])
    expect(weight.status).toBe(1)
    expect(weight.stderr).toContain('--weight applies to phosphor only')
  })
})
