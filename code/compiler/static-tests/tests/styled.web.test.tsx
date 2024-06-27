import dedent from 'dedent'
import * as React from 'react'
import { describe, expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

Error.stackTraceLimit = Infinity
process.env.TAMAGUI_TARGET = 'web'
window['React'] = React

// todo we can make dynamic inline loading potentially not have to actually require() anything

describe('styled() tests', () => {
  test.skip('loads dynamic styled() in file and extracts CSS', async () => {
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

    expect(output.js).toMatchInlineSnapshot(`
      "import { MyStack } from '@tamagui/test-design-system';
      import { styled } from '@tamagui/core';

      // not exported
      const InlineStyled = styled(MyStack, {
        \\"backgroundColor\\": \\"_bg-orange\\"
      });
      export function Test() {
        return <InlineStyled />;
      }"
    `)
    expect(output.styles).toMatchInlineSnapshot('"._bg-orange{background-color:orange;}"')
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
})
