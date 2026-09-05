import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

const options = { options: { components: ['@tamagui/core'] } }

async function compile(jsx: string) {
  const output = await extractForWeb(
    [
      "import { View } from '@tamagui/core'",
      'export function Test({ seed, w, extra }: { seed: number; w: number; extra: any }) {',
      `  return ${jsx}`,
      '}',
      '',
    ].join('\n'),
    options
  )
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

// a style object whose members do not all evaluate lowers member by member:
// the static ones stay on the style layer, and each dynamic one lowers like
// the direct prop of its name
test('a dynamic style member lowers inline beside the static members', async () => {
  const output = await compile(
    '<View style={{ width: w * 2, height: 10 }} padding={4} />'
  )
  expect(output.diagnostics).toEqual([])
  expect(output.line).toMatch(
    /^<div className="is_View _p-\d+ _h-\d+" style=\{\{ "width": \(w \* 2\) \}\} {2}\/>$/
  )
  expect(output.css).toContain('padding:4px')
  expect(output.css).toContain('height:10px')
})

test('a conditional style member lowers per branch', async () => {
  const output = await compile(
    "<View style={{ backgroundColor: seed % 2 ? 'red' : 'blue', height: 10 }} />"
  )
  expect(output.diagnostics).toEqual([])
  expect(output.line).toMatch(
    /^<div className=\{\["is_View _h-\d+", \(seed % 2\) \? "_b-\d+" : "_b-\d+"\]\.filter\(Boolean\)\.join\(" "\)\} \/>$/
  )
  expect(output.css).toContain('background-color:red')
  expect(output.css).toContain('background-color:blue')
})

// an inline dynamic prop and a per-branch conditional share an element when
// they own different CSS properties
test('an inline dynamic prop and a conditional prop lower on one element', async () => {
  const output = await compile(
    "<View backgroundColor={seed % 2 ? 'red' : 'blue'} width={w * 2} />"
  )
  expect(output.diagnostics).toEqual([])
  expect(output.line).toMatch(
    /^<div className=\{\["is_View", \(seed % 2\) \? "_b-\d+" : "_b-\d+"\]\.filter\(Boolean\)\.join\(" "\)\} style=\{\{ "width": \(w \* 2\) \}\} {2}\/>$/
  )
})

// the style layer outranks direct props at runtime, while an inline style
// outranks a class in CSS: a dynamic direct prop under a static style member
// of the same property would invert them, and so would a conditional style
// member over an inline direct prop
test('a dynamic direct prop under a static style member stays at runtime', async () => {
  const output = await compile('<View width={w * 2} style={{ width: 10 }} />')
  expect(output.line).toBe('<View width={w * 2} style={{ width: 10 }} />')
  expect(output.diagnostics).toEqual(['Style prop width could not be safely extracted'])
})

test('a conditional style member over an inline direct prop stays at runtime', async () => {
  const output = await compile(
    '<View width={w * 2} style={{ width: seed % 2 ? 1 : 2 }} />'
  )
  expect(output.line).toBe('<View width={w * 2} style={{ width: seed % 2 ? 1 : 2 }} />')
  expect(output.diagnostics).toEqual([
    'width and an inline dynamic style both contribute a CSS property; their precedence cannot be resolved per-branch',
  ])
})

test('a style object with a spread stays at runtime', async () => {
  const output = await compile('<View style={{ ...extra, width: w }} />')
  expect(output.line).toBe('<View style={{ ...extra, width: w }} />')
  expect(output.diagnostics).toEqual(['Style prop style could not be evaluated'])
})
