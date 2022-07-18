import { tmpdir } from 'os'
import { join } from 'path'

import { expect, test } from '@playwright/test'
import waitPort from 'wait-port'
import { $, ProcessPromise, cd, fetch, fs, sleep } from 'zx'

let server: ProcessPromise | null = null

test.beforeAll(async () => {
  test.setTimeout(60000)

  const dir = join(tmpdir(), `cta-test-${Date.now()}`)
  await fs.ensureDir(dir)

  const bin = join(__dirname, `dist/index.js`)

  cd(dir)

  await $`node ${bin} create-test-app`

  cd(`create-test-app`)

  server = $`yarn web`

  await waitPort({
    port: 3000,
    host: 'localhost',
  })

  // pre-warm
  await fetch(`http://localhost:3000`)
  await sleep(2000)
})

test.afterAll(async () => {
  await server?.kill()
})

test(`Loads home screen that opens drawer`, async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.locator('text=Welcome to Tamagui.')).toBeVisible()

  // open drawer (TODO make attr for better selector)
  await page.locator('button').nth(1).click()
  await expect(page.locator('.is_Sheet')).toBeVisible()

  // TODO add label to inner close button
  // TODO add visual test for sheet opening
})

test(`Navigates to user page`, async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.locator('button[role="link"]:has-text("Link to user")')).toBeVisible()
  await page.locator('button[role="link"]:has-text("Link to user")').click()
  await expect(page.locator('text=User ID: nate')).toBeVisible()
  await expect(page).toHaveURL('http://localhost:3000/user/nate')
})
