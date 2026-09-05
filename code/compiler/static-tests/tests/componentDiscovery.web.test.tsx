import dedent from 'dedent'
import * as React from 'react'
import { describe, expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

process.env.TAMAGUI_TARGET = 'web'
window['React'] = React

// `@fixture/ui` is resolved as an external package by the harness
// and is not in the configured `components` list, so the only way the compiler
// can know its static configs is by evaluating it on demand
const source = dedent`
  import { ExternalCard, ExternalLabel } from '@fixture/ui'

  export function Test() {
    return (
      <ExternalCard tone="critical" opacity={0.5}>
        <ExternalLabel>hi</ExternalLabel>
      </ExternalCard>
    )
  }
`

describe('component discovery', () => {
  test('flattens components imported from a package outside `components`', async () => {
    const output = await extractForWeb(source)
    expect(output.styles).toContain('background-color:red')
    expect(output.styles).toContain('padding:10px')
    expect(output.styles).toContain('border-color:blue')
    expect(output.styles).toContain('opacity:0.5')
    expect(output.styles).toContain('color:green')
    expect(output.js).not.toContain('<ExternalCard')
    expect(output.js).not.toContain('<ExternalLabel')
  })

  // the harness keeps one frontend per project key and discovery is cached on
  // the frontend, so tests that need a cold registry select their own project
  test('without a host evaluator the elements stay on the runtime path', async () => {
    const output = await extractForWeb(source, {
      evaluate: false,
      options: { components: ['@tamagui/core'] },
    })
    expect(output.styles ?? '').not.toContain('background-color:red')
    expect(output.js).toContain('<ExternalCard')
  })

  test('a discovered module is evaluated once per project', async () => {
    const seen: string[] = []
    const evaluate = async ({ id }: { id: string }) => {
      seen.push(id)
      return (await import(id)) as Record<string, unknown>
    }
    const options = { components: ['@tamagui/core', 'tamagui'] }
    const first = await extractForWeb(source, {
      evaluate,
      options,
      sourcePath: `${process.cwd()}/tests/__discovery-a__.tsx`,
    })
    const second = await extractForWeb(
      dedent`
        import { ExternalLabel } from '@fixture/ui'
        export const Other = () => <ExternalLabel fontSize={12}>x</ExternalLabel>
      `,
      { evaluate, options, sourcePath: `${process.cwd()}/tests/__discovery-b__.tsx` }
    )
    expect(first.styles).toContain('background-color:red')
    expect(second.styles).toContain('color:green')
    expect(seen.filter((id) => id.endsWith('/fixtures/external/ui.tsx'))).toHaveLength(1)
  })

  test('a module with no components is remembered and does not retain siblings', async () => {
    const output = await extractForWeb(dedent`
      import { View } from '@tamagui/core'
      import { helper } from '@fixture/plain'

      export function Test() {
        return <View backgroundColor="red" data-x={helper()} />
      }
    `)
    expect(output.styles).toContain('background-color:red')
  })
})
