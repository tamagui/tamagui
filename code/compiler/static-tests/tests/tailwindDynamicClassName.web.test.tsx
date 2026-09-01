import { describe, expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

const options = { options: { components: ['@tamagui/core', '@tamagui/tailwind'] } }

async function compile(jsx: string, body = '') {
  const source = [
    "import { View } from '@tamagui/tailwind'",
    "const colors = ['bg-[red]', 'bg-[blue]']",
    "const heavyColors = ['bg-[red]', 'bg-[blue]', 'bg-[pink]', 'bg-[orange]']",
    'export function Test({ dyn, seed, index }: { dyn: string; seed: number; index: number }) {',
    body,
    `  return ${jsx}`,
    '}',
    '',
  ].join('\n')
  const output = await extractForWeb(source, options)
  return {
    line:
      output?.js
        ?.split('\n')
        .find((line) => line.includes('return'))
        ?.trim()
        .replace(/^return /, '') ?? '',
    css: output?.styles ?? '',
    diagnostics: output?.diagnostics?.map((diagnostic: any) => diagnostic.message) ?? [],
  }
}

// a tailwind View's className is its style input, so each string the value can
// take resolves at compile time the way a static class string does
describe('dynamic className on a tailwind View', () => {
  test('a conditional lowers to per-branch classes around the shared ones', async () => {
    const output = await compile(
      "<View className={seed % 2 ? 'w-6 bg-[red]' : 'w-6 bg-[blue]'} />"
    )
    expect(output.diagnostics).toEqual([])
    expect(output.line).toMatch(
      /^<div className=\{\["is_View _w-\d+", \(seed % 2\) \? "_b-\d+" : "_b-\d+"\]\.filter\(Boolean\)\.join\(" "\)\} \/>$/
    )
    expect(output.css).toContain('background-color:red')
    expect(output.css).toContain('background-color:blue')
  })

  test('a template around a conditional lowers like the bare conditional', async () => {
    const wrapped = await compile(
      "<View className={`w-6 ${seed % 2 ? 'bg-[red]' : 'bg-[blue]'}`} />"
    )
    const bare = await compile(
      "<View className={seed % 2 ? 'w-6 bg-[red]' : 'w-6 bg-[blue]'} />"
    )
    expect(wrapped.diagnostics).toEqual([])
    expect(wrapped.line).toBe(bare.line)
  })

  test('a static array read with a dynamic index lowers to a class table keyed by the runtime string', async () => {
    const output = await compile('<View className={`w-6 ${colors[seed % 2]}`} />')
    expect(output.diagnostics).toEqual([])
    expect(output.line).toMatch(
      /^<div className=\{\["is_View _w-\d+", \(\{"w-6 bg-\[red\]":"_b-\d+","w-6 bg-\[blue\]":"_b-\d+"\}\)\[`w-6 \$\{colors\[seed % 2\]\}`\]\]\.filter\(Boolean\)\.join\(" "\)\} \/>$/
    )
    expect(output.css).toContain('background-color:red')
    expect(output.css).toContain('background-color:blue')
  })

  test('the index may be arithmetic over the array length', async () => {
    const output = await compile(
      '<View className={`w-11 h-11 rounded-full ${heavyColors[(index + seed) % heavyColors.length]}`} />'
    )
    expect(output.diagnostics).toEqual([])
    expect(output.line).toMatch(
      /^<div className=\{\["is_View _w-\d+ _h-\d+ _br-\d+", \(\{/
    )
    expect(
      output.line.match(/"w-11 h-11 rounded-full bg-\[\w+\]":"_b-\d+"/g)
    ).toHaveLength(4)
    expect(output.line).toContain(
      '[`w-11 h-11 rounded-full ${heavyColors[(index + seed) % heavyColors.length]}`]'
    )
  })

  test('a function-scope constant resolves, static or conditional', async () => {
    const output = await compile(
      '<><View className={base} /><View className={`w-6 ${toggled}`} /></>',
      [
        "  const base = 'w-6 bg-[red]'",
        "  const toggled = seed % 2 ? 'bg-[red]' : 'bg-[blue]'",
      ].join('\n')
    )
    expect(output.diagnostics).toEqual([])
    expect(output.line).toMatch(
      /^<><div className="is_View _w-\d+ _b-\d+" \/><div className=\{\["is_View _w-\d+", \(seed % 2\) \? "_b-\d+" : "_b-\d+"\]\.filter\(Boolean\)\.join\(" "\)\} \/><\/>$/
    )
  })

  test('an opaque string stays on the runtime path', async () => {
    const output = await compile('<View className={`w-6 ${dyn}`} />')
    expect(output.line).toBe('<View className={`w-6 ${dyn}`} />')
    expect(output.diagnostics).toEqual([
      'Style prop className could not be safely extracted',
    ])
  })

  test('a domain wider than 32 strings stays on the runtime path', async () => {
    const wide = Array.from({ length: 33 }, (_, index) => `'w-${index + 1}'`).join(', ')
    const output = await compile(
      '<View className={wide[seed % 33]} />',
      `  const wide = [${wide}]`
    )
    expect(output.line).toBe('<View className={wide[seed % 33]} />')
    expect(output.diagnostics).toEqual([
      'Style prop className could not be safely extracted',
    ])
  })
})
