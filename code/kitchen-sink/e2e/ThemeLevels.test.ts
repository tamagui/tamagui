import { by, element, expect, waitFor } from 'detox'

import { safeLaunchApp } from './utils/detox'

describe('ThemeLevels', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'ThemeLevels' },
    })
    await waitFor(element(by.id('theme-levels-root'))).toExist().withTimeout(180000)
  })

  it('composes relative levels in both schemes', async () => {
    await expect(element(by.id('light-base-name'))).toHaveText('light')
    await expect(element(by.id('light-panel-name'))).toHaveText('light_level2')
    await expect(element(by.id('light-button-name'))).toHaveText(
      'light_level2_level2'
    )
    await expect(element(by.id('dark-base-name'))).toHaveText('dark')
    await expect(element(by.id('dark-panel-name'))).toHaveText('dark_level2')
    await expect(element(by.id('dark-button-name'))).toHaveText('dark_level2_level2')
  })

  it('keeps the red theme through the Button level', async () => {
    await expect(element(by.id('red-level-button-name'))).toHaveText(
      'light_red_level2'
    )
  })
})
