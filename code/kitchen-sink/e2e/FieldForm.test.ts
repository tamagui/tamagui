import { by, element, expect, waitFor } from 'detox'
import { safeLaunchApp, withSync } from './utils/detox'

describe('FieldForm', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'FieldValidatedSignupCase' },
    })
    await waitFor(element(by.id('signup-submit')))
      .toExist()
      .withTimeout(180000)
  })

  it('validates required fields and focuses the first invalid native control', async () => {
    await withSync(() => element(by.id('signup-submit')).tap())

    await expect(element(by.text('Please fill out this field.')).atIndex(0)).toBeVisible()
    await element(by.id('signup-first-name')).typeText('Ada')
    await expect(element(by.id('signup-first-name'))).toHaveText('Ada')
  })
})
