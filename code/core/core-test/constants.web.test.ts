/**
 * Verifies that @tamagui/constants exports the isTV constant on web.
 *
 * This guards against the regression where isTV existed in constants.ts source
 * but was missing from the compiled type declaration, causing TS2305 errors in
 * packages that imported it (e.g. createComponent.tsx).
 */
import { isAndroid, isIos, isTV, isWeb } from '@tamagui/constants'
import { describe, expect, test } from 'vitest'

describe('@tamagui/constants web exports', () => {
  test('isTV is exported and false on web', () => {
    expect(isTV).toBe(false)
  })

  test('isWeb is true on web', () => {
    expect(isWeb).toBe(true)
  })

  test('isAndroid and isIos are false on web', () => {
    expect(isAndroid).toBe(false)
    expect(isIos).toBe(false)
  })
})
