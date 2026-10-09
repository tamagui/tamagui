const { describe, expect, test } = require('bun:test')
const { patchMainActivity } = require('./detox-skip-splash')

const mainActivity = `package com.tamagui.tamaguikitchensink

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreenManager.registerOnActivity(this)
    super.onCreate(null)
  }
}
`

describe('detox skip splash config plugin', () => {
  test('switches Detox launches to the AppCompat app theme', () => {
    const patched = patchMainActivity(mainActivity)

    expect(patched).toContain(`if (isUnderDetox()) {
      setTheme(R.style.AppTheme)
    } else {
      SplashScreenManager.registerOnActivity(this)
    }`)
    expect(patched).toContain('private fun isUnderDetox(): Boolean')
  })

  test('is idempotent', () => {
    const patched = patchMainActivity(mainActivity)

    expect(patchMainActivity(patched)).toBe(patched)
  })

  test('fails when Expo changes the generated activity template', () => {
    expect(() => patchMainActivity('class MainActivity {}')).toThrow(
      'could not find SplashScreenManager registration'
    )
  })
})
