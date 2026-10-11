/**
 * Detox E2E for `<ThemeUpdate>` values on native.
 *
 * Validates the native inline theme layer end to end on a real simulator/emulator:
 * - config custom variables resolve through useTheme() per scheme
 * - patching values updates JS readers and styled consumers
 * - dark-scoped patch values apply when the OS appearance flips
 * - DynamicColorIOS: config variables and literal-pair patches report dynamic
 *   colors once the appearance gate is open; referenced patches deopt
 *
 * Taps here go through withSync. Changing the simulator appearance makes iOS
 * cross-fade the window through a full-screen _UIReplicantView snapshot, and
 * this suite runs with detox synchronization disabled, so an unsynchronized tap
 * right after a flip lands on that snapshot instead of the button and fails as
 * "view is not hittable at its visible point". RN 0.83 Fabric needs sync for
 * tap delivery anyway, which is what withSync is for.
 *
 * The case renders unwrapped by any <Theme> so the subtree follows the OS
 * scheme (inverses must be 0 for DynamicColorIOS to engage).
 */

import { execFileSync } from 'node:child_process'
import { by, device, element, expect, waitFor } from 'detox'
import { safeLaunchApp, withSync } from './utils/detox'

// detox 20.47 has no device.setAppearance; drive the native device directly
const setDeviceAppearance = (mode: 'light' | 'dark') => {
  if (device.getPlatform() === 'ios') {
    execFileSync('xcrun', ['simctl', 'ui', device.id, 'appearance', mode])
    return
  }

  execFileSync('adb', [
    '-s',
    device.id,
    'shell',
    'cmd',
    'uimode',
    'night',
    mode === 'dark' ? 'yes' : 'no',
  ])
}

const dynamicValue = (name: 'dynamic' | 'refDynamic', value: boolean) =>
  `${name}:${device.getPlatform() === 'ios' && value}`

const CONFIG_LIGHT_ACCENT = 'val:rgb(0, 90, 200)'
const CONFIG_DARK_ACCENT = 'val:rgb(90, 90, 255)'
const PATCH_ACCENT = 'val:rgb(200, 0, 0)'
const PATCH_DARK_ACCENT = 'val:rgb(200, 100, 100)'

describe('ThemeUpdate values', () => {
  beforeAll(async () => {
    setDeviceAppearance('light')
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'ThemeUpdateNativeCase' },
    })
    await waitFor(element(by.id('vars-native-val')))
      .toExist()
      .withTimeout(180000)
  })

  afterAll(async () => {
    setDeviceAppearance('light')
  })

  it('config variables resolve through useTheme at launch', async () => {
    await expect(element(by.id('vars-native-val'))).toHaveText(CONFIG_LIGHT_ACCENT)
    // the gate is open from launch: the app no longer overrides the ios color
    // scheme, so useTheme sees the real scheme and the config variable pair
    // reports a DynamicColorIOS value without waiting for a flip
    await expect(element(by.id('vars-native-dynamic'))).toHaveText(
      dynamicValue('dynamic', true)
    )
  })

  it('appearance flip applies dark config values and opens the dynamic gate', async () => {
    setDeviceAppearance('dark')
    await waitFor(element(by.id('vars-native-val')))
      .toHaveText(CONFIG_DARK_ACCENT)
      .withTimeout(15000)
    await expect(element(by.id('vars-native-env'))).toHaveText('env:dark/dark')
    // gate open: config variable pair reports a DynamicColorIOS value
    await expect(element(by.id('vars-native-dynamic'))).toHaveText(
      dynamicValue('dynamic', true)
    )
    await expect(element(by.id('vars-native-ref-dynamic'))).toHaveText(
      dynamicValue('refDynamic', true)
    )
  })

  it('patch under dark: dark bucket wins, literal pair stays dynamic, reference deopts', async () => {
    await withSync(() => element(by.id('vars-native-toggle')).tap())
    await waitFor(element(by.id('vars-native-val')))
      .toHaveText(PATCH_DARK_ACCENT)
      .withTimeout(10000)
    // literal light+dark patch keeps the DynamicColorIOS pair
    await expect(element(by.id('vars-native-dynamic'))).toHaveText(
      dynamicValue('dynamic', true)
    )
    // reference patch (color) has no pair: deopts to the tracked path
    await expect(element(by.id('vars-native-ref-dynamic'))).toHaveText('refDynamic:false')
  })

  it('flip back to light keeps the base patch value', async () => {
    setDeviceAppearance('light')
    await waitFor(element(by.id('vars-native-val')))
      .toHaveText(PATCH_ACCENT)
      .withTimeout(15000)
  })

  it('un-patching restores config values and the config pair', async () => {
    await withSync(() => element(by.id('vars-native-toggle')).tap())
    await waitFor(element(by.id('vars-native-val')))
      .toHaveText(CONFIG_LIGHT_ACCENT)
      .withTimeout(10000)
    await expect(element(by.id('vars-native-ref-dynamic'))).toHaveText(
      dynamicValue('refDynamic', true)
    )
  })
})
