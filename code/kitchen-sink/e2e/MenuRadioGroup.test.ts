import { by, element, expect, waitFor } from 'detox'
import { safeLaunchApp, withSync } from './utils/detox'
import { navigateToTestCase } from './utils/navigation'

function getMenuItemMatcher(label: string) {
  return by.text(label)
}

async function openMenu() {
  await withSync(() => element(by.id('menu-radio-trigger')).tap())
  await waitFor(element(getMenuItemMatcher('Green')))
    .toBeVisible()
    .withTimeout(10000)
}

async function selectColor(label: 'Red' | 'Green' | 'Blue') {
  await openMenu()
  await withSync(() => element(getMenuItemMatcher(label)).tap())
}

describe('MenuRadioGroup', () => {
  beforeEach(async () => {
    await safeLaunchApp({ newInstance: true })
    await navigateToTestCase('MenuRadioGroupCase', 'menu-radio-selected-value', {
      skipEnableSync: true,
    })
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
