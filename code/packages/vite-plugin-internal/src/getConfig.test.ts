import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { afterEach, expect, test } from 'vitest'
import { resolveConfig } from 'vite'

import { getConfig } from './getConfig'

const originalTarget = process.env.TAMAGUI_TARGET

afterEach(() => {
  if (originalTarget === undefined) {
    delete process.env.TAMAGUI_TARGET
  } else {
    process.env.TAMAGUI_TARGET = originalTarget
  }
})

test('native tests resolve native modules before web modules', async () => {
  process.env.TAMAGUI_TARGET = 'native'

  const config = await resolveConfig(getConfig(tamaguiPlugin), 'serve')
  const nativeIndex = config.resolve.extensions.findIndex((extension) =>
    extension.startsWith('.native.')
  )
  const webIndex = config.resolve.extensions.findIndex((extension) =>
    extension.startsWith('.web.')
  )

  expect(nativeIndex).toBeGreaterThanOrEqual(0)
  expect(webIndex === -1 || nativeIndex < webIndex).toBe(true)
})
