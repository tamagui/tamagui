import { by, device, element, expect, waitFor } from 'detox'

describe('RNGH Status Check', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  it('should show RNGH status on home screen', async () => {
    // Wait for app to load
    await waitFor(element(by.text('Kitchen Sink')))
      .toExist()
      .withTimeout(60000)
    
    // Take screenshot to see RNGH status
    await device.takeScreenshot('rngh-status')
    
    // Check for RNGH text - it shows either "RNGH: ✓ enabled" or "RNGH: ✗ disabled"
    // We'll log what we see
    try {
      await expect(element(by.text(/RNGH.*enabled/))).toBeVisible()
      console.log('RNGH STATUS: ENABLED')
    } catch {
      try {
        await expect(element(by.text(/RNGH.*disabled/))).toBeVisible()
        console.log('RNGH STATUS: DISABLED')
      } catch {
        console.log('RNGH STATUS: NOT FOUND')
      }
    }
  })
})
