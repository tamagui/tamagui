import * as React from 'react'
import { describe, expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

Error.stackTraceLimit = Infinity
process.env.TAMAGUI_TARGET = 'web'
window['React'] = React

// todo we can make dynamic inline loading potentially not have to actually require() anything

describe('styled() tests', () => {
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

    expect(output.js).toMatchInlineSnapshot(`
      "const _cn = \\"  _bg-green _fd-column _fs-0 _ai-stretch \\";
      import { MyStack } from '@tamagui/test-design-system';
      export function Test() {
        return <div className={_cn} />;
      }"
    `)
    expect(output.styles).toMatchInlineSnapshot(`
      "._bg-green{background-color:green;}
      ._fd-column{flex-direction:column;}
      ._fs-0{flex-shrink:0;}
      ._ai-stretch{align-items:stretch;}"
    `)
  })
})
