import { by, device, element, expect, waitFor } from 'detox'
import { runAdb, safeLaunchApp, withSync } from './utils/detox'
import { remountDirectUseCase } from './utils/navigation'

function getMenuItemMatcher(label: string) {
  return by.text(label)
}

async function selectColor(label: 'Red' | 'Green' | 'Blue') {
  if (device.getPlatform() === 'android') {
    const trigger = element(by.id('menu-radio-trigger'))
    await withSync(() => trigger.tap())

    // compose popup contents are outside espresso's view hierarchy, but ui
    // automator exposes their accessibility nodes and physical screen bounds.
    // wait for the requested row to exist before sending the physical tap.
    const deadline = Date.now() + 10000
    let bounds: RegExpMatchArray | null = null
    while (!bounds) {
      runAdb('shell', 'uiautomator', 'dump', '/sdcard/menu-radio-window.xml')
      const hierarchy = runAdb('exec-out', 'cat', '/sdcard/menu-radio-window.xml')
      const node = hierarchy.match(
        new RegExp(`<node[^>]*(?:text|content-desc)="${label}"[^>]*>`)
      )?.[0]
      bounds = node?.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/) ?? null
      if (!bounds && Date.now() >= deadline) {
        throw new Error(`native menu did not expose the ${label} item`)
      }
    }

    const [, left, top, right, bottom] = bounds
    runAdb(
      'shell',
      'input',
      'tap',
      String((Number(left) + Number(right)) / 2),
      String((Number(top) + Number(bottom)) / 2)
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
    await expect(element(by.id('menu-radio-trigger'))).toBeVisible()
    await expect(element(by.id('menu-radio-selected-value'))).toHaveText(
      'Selected value: blue'
    )
    await expect(element(by.id('menu-radio-change-count'))).toHaveText('Change count: 0')
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
