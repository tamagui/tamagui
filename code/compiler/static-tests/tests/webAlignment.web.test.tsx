/**
 * Web Alignment Compiler Tests - Web Platform
 *
 * These tests verify that the compiler correctly handles web-aligned props
 * and that RN-specific props are not extracted after migration.
 */

import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

window['React'] = React

test('aria-label is preserved in extracted output', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View aria-label="Test label" />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('aria-label')
  expect(output?.js).toContain('Test label')
})

test('role is preserved in extracted output', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View role="button" />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('role')
  expect(output?.js).toContain('button')
})

test('aria-hidden is preserved in extracted output', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View aria-hidden={true} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('aria-hidden')
})

test('id is preserved in extracted output', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View id="my-element" width={100} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // id should be in the output (check both js and the whole thing)
  const fullOutput = JSON.stringify(output)
  expect(fullOutput).toContain('my-element')
})

test('tabIndex is preserved in extracted output', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View tabIndex={0} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('tabIndex')
})

test('onClick is preserved in extracted output', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test(props) {
      return <View onClick={props.handler} width={100} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // onClick with a prop reference should be preserved
  const fullOutput = JSON.stringify(output)
  expect(fullOutput).toContain('onClick')
})

test('onPointerDown is preserved in extracted output', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test(props) {
      return <View onPointerDown={props.handler} width={100} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  const fullOutput = JSON.stringify(output)
  expect(fullOutput).toContain('onPointerDown')
})

test('boxShadow is extracted to CSS correctly', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View boxShadow="0 2px 10px rgba(0,0,0,0.5)" />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.styles).toContain('box-shadow')
})

// Tests for RN props that should NOT work after migration
// These use test.fails because they should fail now and pass after migration

test.fails(
  'accessibilityLabel should NOT be in extracted output after migration',
  async () => {
    const output = await extractForWeb(
      `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View accessibilityLabel="Test label" />
    }
  `,
      {
        options: {
          platform: 'web',
          components: ['@tamagui/core'],
        },
      }
    )

    // After migration, accessibilityLabel should be ignored
    // The output should NOT contain aria-label from accessibilityLabel
    expect(output?.js).not.toContain('aria-label')
    expect(output?.js).not.toContain('accessibilityLabel')
  }
)

test.fails('accessibilityRole should NOT be in extracted output after migration', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View accessibilityRole="button" />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // After migration, accessibilityRole should be ignored
  expect(output?.js).not.toContain('role')
  expect(output?.js).not.toContain('accessibilityRole')
})

test.fails('focusable should NOT be in extracted output after migration', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View focusable={true} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // After migration, focusable should be ignored
  expect(output?.js).not.toContain('tabIndex')
  expect(output?.js).not.toContain('focusable')
})

test.fails('onPress should NOT be in extracted output after migration', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View onPress={() => {}} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // After migration, onPress should be ignored on web
  expect(output?.js).not.toContain('onClick')
  expect(output?.js).not.toContain('onPress')
})
