/**
 * Test the motion library's animation behavior with rapid position changes.
 * This is a minimal reproduction to understand the jump bug.
 */

import { chromium } from 'playwright'
import * as path from 'path'

async function main() {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage({ viewport: { width: 1000, height: 600 } })

  // capture console logs
  page.on('console', msg => {
    console.log(`[BROWSER] ${msg.text()}`)
  })

  const htmlPath = path.resolve(__dirname, 'motion-test.html')
  await page.goto(`file://${htmlPath}`)
  await page.waitForTimeout(1000)

  console.log('\n--- Running rapid animation test ---\n')

  // click the rapid test button
  await page.click('#rapid')
  await page.waitForTimeout(2000)

  // check results
  const logContent = await page.$eval('#log', el => el.innerHTML)
  const hasJump = logContent.includes('JUMP DETECTED')

  console.log(`\n--- Result: ${hasJump ? 'JUMP DETECTED!' : 'No jump'} ---\n`)

  await page.waitForTimeout(1000)
  await browser.close()
}

main().catch(console.error)
