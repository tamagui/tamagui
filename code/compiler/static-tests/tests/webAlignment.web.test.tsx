/**
 * Web Alignment Compiler Tests - Web Platform
 *
 * These tests verify that the compiler correctly preserves web-aligned props
 * in extracted output. When extraction happens, web props should remain on
 * the extracted element.
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

  expect(output?.js).toContain('aria-label={"Test label"}')
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

  expect(output?.js).toContain('role={"button"}')
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

  expect(output?.js).toContain('aria-hidden={true}')
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

  expect(output?.js).toContain('tabIndex={0}')
})

test('boxShadow is extracted to CSS', async () => {
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

  expect(output?.styles).toContain('box-shadow:0 2px 10px rgba(0,0,0,0.5)')
})

test('multiple aria props together', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return (
        <View
          aria-label="Accessible button"
          role="button"
          tabIndex={0}
          aria-disabled={false}
        />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js).toContain('aria-label={"Accessible button"}')
  expect(output?.js).toContain('role={"button"}')
  expect(output?.js).toContain('tabIndex={0}')
  expect(output?.js).toContain('aria-disabled={false}')
})
