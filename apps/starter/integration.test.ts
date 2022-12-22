import { execSync } from 'child_process'
/* eslint-disable no-console */
import { tmpdir } from 'os'
import { join } from 'path'

import { expect, test } from '@playwright/test'
import waitPort from 'wait-port'
import { $, ProcessPromise, cd, fetch, fs, sleep } from 'zx'

process.env.NODE_ENV = 'test'

let server: ProcessPromise | null = null

const PACKAGE_ROOT = __dirname

test.beforeAll(async () => {
  $.env.NODE_ENV = 'test'
  $.env.FORCE_EXTRACT = '1'

  test.slow()

  server = $`yarn web:extract`

  await waitPort({
    port: 3000,
    host: 'localhost',
  })

  // pre-warm by hitting the endpoint
  await fetch(`http://localhost:3000`)
  await sleep(1000)
})

test.afterAll(async () => {
  await server?.kill()
})

// TODO run these tests in prod and dev

test(`Loads web`, async ({ page }) => {
  test.slow()
  await page.goto('http://localhost:3000/')

  console.log('done')

  // await expect(page.locator('text=Welcome to Tamagui.')).toBeVisible()

  // // open drawer (TODO make attr for better selector)
  // await page.locator('button').nth(1).click()
  // await expect(page.locator('.is_Sheet')).toBeVisible()
})
