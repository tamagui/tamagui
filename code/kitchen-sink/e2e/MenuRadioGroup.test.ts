import { by, device, element, expect, waitFor } from 'detox'
import { safeLaunchApp, withSync } from './utils/detox'
import { remountDirectUseCase } from './utils/navigation'

function getMenuItemMatcher(label: string) {
  return by.text(label)
}

async function selectColor(label: 'Red' | 'Green' | 'Blue') {
  if (device.getPlatform() === 'android') {
    const trigger = element(by.id('menu-radio-trigger'))
    const { frame } = (await trigger.getAttributes()) as Detox.AndroidElementAttributes
    await withSync(() => trigger.tap())

    // Compose popup contents are visible to Android accessibility, but they are
    // outside Espresso's View hierarchy. Tap the Material menu row relative to
    // the trigger: 8dp popup padding followed by 48dp rows. Detox reports the
    // frame in physical pixels but accepts tap coordinates in dp, so the fixed
    // 120dp trigger width provides the device density.
    const density = frame.width / 120
    const itemIndex = { Red: 0, Green: 1, Blue: 2 }[label]
    await device.tap(
      {
        x: (frame.x + frame.width / 2) / density,
        y: (frame.y + frame.height) / density + 32 + itemIndex * 48,
      },
      false
    )
    return
  }

  await withSync(() => element(by.id('menu-radio-trigger')).tap())
  await waitFor(element(getMenuItemMatcher('Green')))
    .toBeVisible()
    .withTimeout(10000)
  await withSync(() => element(getMenuItemMatcher(label)).tap())
}

describe('MenuRadioGroup', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'MenuRadioGroupCase' },
    })
    await waitFor(element(by.id('menu-radio-selected-value')))
      .toExist()
      .withTimeout(180000)
  })

  beforeEach(async () => {
    await remountDirectUseCase('menu-radio-selected-value', { skipEnableSync: true })
  })

  it('should render the menu radio group case', async () => {
    await expect(element(by.id('menu-radio-title'))).toBeVisible()
    await expect(element(by.id('menu-radio-trigger'))).toBeVisible()
    await expect(element(by.id('menu-radio-selected-value'))).toHaveText(
      'Selected value: blue'
    )
    await expect(element(by.id('menu-radio-change-count'))).toHaveText('Change count: 0')
  })

  it('should update state when selecting a native radio menu item', async () => {
    await selectColor('Green')

    await waitFor(element(by.id('menu-radio-selected-value')))
      .toHaveText('Selected value: green')
      .withTimeout(10000)
    await expect(element(by.id('menu-radio-change-count'))).toHaveText('Change count: 1')
  })

  it('should keep the last selected value across multiple native selections', async () => {
    await selectColor('Red')
    await waitFor(element(by.id('menu-radio-selected-value')))
      .toHaveText('Selected value: red')
      .withTimeout(10000)

    await selectColor('Green')

    await waitFor(element(by.id('menu-radio-selected-value')))
      .toHaveText('Selected value: green')
      .withTimeout(10000)
    await expect(element(by.id('menu-radio-change-count'))).toHaveText('Change count: 2')
  })
})
