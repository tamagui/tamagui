import { describe, expect, test } from 'bun:test'

import { androidWindowHasAppFocus } from '../e2e/utils/detox'

describe('Android Detox window focus', () => {
  test('accepts the kitchen-sink activity as current focus', () => {
    expect(
      androidWindowHasAppFocus(`
        mCurrentFocus=Window{aa11 u0 com.tamagui.tamaguikitchensink/com.tamagui.tamaguikitchensink.MainActivity}
        mFocusedApp=ActivityRecord{bb22 u0 com.tamagui.tamaguikitchensink/.MainActivity}
      `)
    ).toBe(true)
  })

  test('rejects a visible app whose window does not have focus', () => {
    expect(
      androidWindowHasAppFocus(`
        mCurrentFocus=Window{aa11 u0 com.android.launcher3/.uioverrides.QuickstepLauncher}
        mFocusedApp=ActivityRecord{bb22 u0 com.tamagui.tamaguikitchensink/.MainActivity}
      `)
    ).toBe(false)
  })

  test('rejects the Pixel Launcher ANR dialog captured on CI', () => {
    expect(
      androidWindowHasAppFocus(`
        mCurrentFocus=Window{cc33 u0 Application Not Responding: com.google.android.apps.nexuslauncher}
        mFocusedApp=ActivityRecord{bb22 u0 com.tamagui.tamaguikitchensink/.MainActivity}
      `)
    ).toBe(false)
  })
})
