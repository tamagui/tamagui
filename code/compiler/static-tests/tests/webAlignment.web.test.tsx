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

// Tests for RN props that are NOT converted in v2

test('accessibilityLabel is NOT converted to aria-label in v2', async () => {
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

  // accessibilityLabel is no longer converted - use aria-label directly
  expect(output?.js).not.toContain('aria-label')
})

test('accessibilityRole is NOT converted to role in v2', async () => {
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

  // accessibilityRole is no longer converted - use role directly
  expect(output?.js).not.toContain('role":')
})

test('focusable is NOT converted to tabIndex in v2', async () => {
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

  // focusable is no longer converted - use tabIndex directly
  expect(output?.js).not.toContain('tabIndex')
})

test('onPress is preserved in extracted output (kept for cross-platform)', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test(props) {
      return <View onPress={props.handler} />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  // onPress is kept for cross-platform compatibility
  const fullOutput = JSON.stringify(output)
  expect(fullOutput).toContain('onPress')
})
