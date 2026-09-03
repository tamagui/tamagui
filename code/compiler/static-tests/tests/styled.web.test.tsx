import dedent from 'dedent'
import * as React from 'react'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { extractForWeb } from './lib/extract'

Error.stackTraceLimit = Number.MAX_SAFE_INTEGER
process.env.TAMAGUI_TARGET = 'web'
window['React'] = React

const compilerLaneAComponents = resolve(__dirname, 'fixtures/compilerLaneAComponents.tsx')

describe('styled() tests', () => {
  test('loads dynamic styled() in file and extracts CSS', async () => {
    const output = await extractForWeb(
      dedent`
      import { MyStack } from '@tamagui/test-design-system'
      import { styled } from '@tamagui/core'

      // not exported
      const InlineStyled = styled(MyStack, {
        backgroundColor: 'orange'
      })

      export function Test() {
        return <InlineStyled />
      }
    `
    )
    if (!output) {
      throw new Error(`No output`)
    }

    // styled() extraction should produce CSS rules for backgroundColor
    expect(output.styles).toContain('background-color')
    expect(output.styles).toContain('orange')
    // should also extract the JSX usage
    expect(output.js).toContain('className')
  })

  // the class-string base and string variants are the
  // Tailwind frontend's surface: core `styled()` is object-only, and it is the import
  // that selects which frontend interprets the base
  test('extracts styled static strings with runtime precedence', async () => {
    const output = await extractForWeb(
      dedent`
      import { styled, View } from '@tamagui/tailwind'

      const InlineStyled = styled(View, 'p-4 rounded-4', {
        variants: {
          tone: {
            red: 'h-8 px-3 bg-[red] w-8 p-0 opacity-[0.5]'
          }
        }
      })

      export function Test() {
        return <InlineStyled tone="red" width={30} opacity={0.75} />
      }
    `,
      {
        options: {
          components: ['@tamagui/core', '@tamagui/tailwind'],
        },
      }
    )
    if (!output) {
      throw new Error(`No output`)
    }

    expect(output.styles).toContain('padding:var(--c-space-0)')
    expect(output.styles).toContain('border-radius:var(--c-radius-4)')
    expect(output.styles).toContain('height:var(--c-size-8)')
    expect(output.styles).toContain('background-color:red')
    expect(output.styles).toContain('opacity:0.75')
    expect(output.styles).toContain('width:30px')
  })

  test('extracts text color/size, size-*, corner radius, side borders, and axis insets', async () => {
    const output = await extractForWeb(
      dedent`
      import { styled, View } from '@tamagui/tailwind'

      const Box = styled(View, 'size-10 inset-x-0 rounded-t-xl border-t-4', {
        variants: {
          tone: {
            red: 'text-white text-sm font-bold',
          },
        },
      })

      export function Test() {
        return <Box tone="red" />
      }
    `,
      {
        options: {
          enableDynamicEvaluation: true,
          components: ['@tamagui/core', '@tamagui/tailwind'],
        },
      }
    )
    if (!output) {
      throw new Error(`No output`)
    }

    // v6 gives width its own token scale (so `w-3xl` reaches the container sizes)
    // while height has none and still reads the shared size scale. Both `10`s hold
    // the same 40px, so this pair is the same length under two variable names.
    expect(output.styles).toContain('width:var(--c-width-10)')
    expect(output.styles).toContain('height:var(--c-size-10)')
    expect(output.styles).toContain('border-top-left-radius:var(--c-radius-xl)')
    expect(output.styles).toContain('border-top-right-radius:var(--c-radius-xl)')
    expect(output.styles).toContain('border-top-width:var(--c-space-4)')
    expect(output.styles).toContain('left:var(--c-space-0)')
    expect(output.styles).toContain('right:var(--c-space-0)')
    expect(output.styles).toContain('font-weight:700')
  })

  test('extracts to className at call-site', async () => {
    const output = await extractForWeb(`
      import { MyStack } from '@tamagui/test-design-system'

      export function Test() {
        return <MyStack />
      }
    `)
    if (!output) {
      throw new Error(`No output`)
    }

    expect(output.js).toMatchSnapshot()
    expect(output.styles).toMatchSnapshot()
  })

  test('evaluates branded dynamics and resolver chains with static callsite props', async () => {
    const output = await extractForWeb(
      `
      import { DynamicResolverStack } from './fixtures/compilerLaneAComponents'

      export function Test() {
        return <DynamicResolverStack scale={20} tone="critical" id="dim" />
      }
    `,
      { options: { components: [compilerLaneAComponents] } }
    )

    expect(output.stats.lowered).toBe(1)
    expect(output.stats.bailed).toBe(0)
    expect(output.js).toContain('className')
    expect(output.styles).toContain('width:20px')
    expect(output.styles).toContain('height:20px')
    expect(output.styles).toContain('background-color:red')
    expect(output.styles).toContain('opacity:0.5')
    expect(output.styles).toContain('padding:12px')
    expect(output.styles).not.toContain('padding:8px')
  })

  test('extracts core style pieces and replaces their definition calls', async () => {
    const output = await extractForWeb(`
      import { style, View } from '@tamagui/core'

      const card = style({ backgroundColor: 'red', padding: 8 })

      export function Test({ active }) {
        return <View style={[card, active && style({ opacity: 0.5 })]} />
      }
    `)

    expect(output.stats.lowered).toBe(1)
    expect(output.stats.bailed).toBe(0)
    expect(output.js).not.toContain('style({')
    expect(output.js).toContain('Symbol.for("tamagui.stylePiece")')
    expect(output.js).toContain('(active) &&')
    expect(output.styles).toContain('background-color:red')
    expect(output.styles).toContain('padding:8px')
    expect(output.styles).toContain('opacity:0.5')
  })

  test('deopts a branded dynamic whose callsite value is unknown', async () => {
    const output = await extractForWeb(
      `
      import { DynamicResolverStack } from './fixtures/compilerLaneAComponents'

      export function Test(props) {
        return <DynamicResolverStack scale={props.scale} tone="critical" id="dim" />
      }
    `,
      { options: { components: [compilerLaneAComponents] } }
    )

    expect(output.stats.lowered).toBe(0)
    expect(output.stats.bailed).toBe(1)
    expect(output.js).toContain('scale={props.scale}')
    expect(output.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'local/dynamic-style-value',
          blocking: true,
          prop: 'scale',
        }),
      ])
    )
  })

  test('deopts a resolver callsite when any readable prop is unknown', async () => {
    const output = await extractForWeb(
      `
      import { DynamicResolverStack } from './fixtures/compilerLaneAComponents'

      export function Test(props) {
        return <DynamicResolverStack scale={20} tone="critical" id={props.id} />
      }
    `,
      { options: { components: [compilerLaneAComponents] } }
    )

    expect(output.stats.lowered).toBe(0)
    expect(output.stats.bailed).toBe(1)
    expect(output.js).toContain('id={props.id}')
    expect(output.styles).toBe('')
    expect(output.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'local/dynamic-style-value',
          blocking: true,
          prop: 'id',
        }),
      ])
    )
  })

  test('deopts a resolver callsite with multiple conditional props', async () => {
    const output = await extractForWeb(
      `
      import { DynamicResolverStack } from './fixtures/compilerLaneAComponents'

      export function Test(props) {
        return (
          <DynamicResolverStack
            scale={props.large ? 20 : 10}
            tone="critical"
            id={props.dim ? 'dim' : 'bright'}
          />
        )
      }
    `,
      { options: { components: [compilerLaneAComponents] } }
    )

    expect(output.stats.lowered).toBe(0)
    expect(output.stats.bailed).toBe(1)
    expect(output.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'local/dynamic-style-value',
          blocking: true,
        }),
      ])
    )
  })

  describe('cross-file styled() optimization', () => {
    const tmpDir = join(__dirname, '.tmp-cross-file-test')
    const componentFile = join(tmpDir, 'MyBox.tsx')

    beforeAll(() => {
      mkdirSync(tmpDir, { recursive: true })
      writeFileSync(
        componentFile,
        dedent`
          import { styled, View } from '@tamagui/core'

          export const MyBox = styled(View, {
            backgroundColor: 'red',
            padding: 10,
          })
        `
      )
    })

    afterAll(() => {
      if (existsSync(tmpDir)) {
        rmSync(tmpDir, { recursive: true })
      }
    })

    test('extracts CSS for styled component imported from another file', async () => {
      const componentSource = dedent`
        import { styled, View } from '@tamagui/core'

        export const MyBox = styled(View, {
          backgroundColor: 'red',
          padding: 10,
        })
      `

      // first process the component file (like vite plugin would)
      const componentOutput = await extractForWeb(componentSource, {
        sourcePath: componentFile,
      })
      expect(componentOutput).toBeTruthy()
      // Definitions are graph metadata. CSS is emitted transactionally at a use site,
      // so an unused definition does not write a global rule as a side effect.
      expect(componentOutput!.styles).toBe('')

      // now process the consumer file - MyBox should be in the dynamic cache
      const consumerSource = dedent`
        import { MyBox } from './MyBox'

        export function Test() {
          return <MyBox />
        }
      `

      const consumerPath = join(tmpDir, 'Consumer.tsx')
      const output = await extractForWeb(consumerSource, {
        sourcePath: consumerPath,
      })

      if (!output) {
        throw new Error(`No output - file was skipped entirely`)
      }

      // the consumer file should get className optimization
      expect(output.js).toContain('className')
      expect(output.styles).toContain('background-color')
    })
  })
})
