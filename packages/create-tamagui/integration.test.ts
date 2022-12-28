import { execSync } from 'child_process'
/* eslint-disable no-console */
import { platform, tmpdir } from 'os'
import { join } from 'path'

import { expect, test } from '@playwright/test'
import { existsSync, remove } from 'fs-extra'
import waitPort from 'wait-port'
import { $, ProcessPromise, cd, fetch, fs, sleep } from 'zx'

let server: ProcessPromise | null = null

const PACKAGE_ROOT = __dirname
const PACKAGES_ROOT = join(PACKAGE_ROOT, '..')

if (process.env.NODE_ENV === 'test') {
  if (execSync(`git status --porcelain`).toString().trim()) {
    console.error(`\n⚠️  -- Must commit changes to git repo before running test --\n`)
    process.exit(1)
  }
}

process.env.NODE_ENV = 'test'

const isLocalDev = platform() === 'darwin'
const dir = isLocalDev ? `/tmp/test` : join(tmpdir(), `cta-test-${Date.now()}`)

const oneMinute = 1000 * 60

test.beforeAll(async () => {
  $.env.NODE_ENV = 'test'

  // 15 m
  test.setTimeout(oneMinute * 15)

  const tamaguiBin = join(PACKAGE_ROOT, `dist`, `index.js`)

  console.log(`Making test app in`, dir)

  // let me re-run fast locally
  const dirExists = existsSync(dir)

  if (!dirExists) {
    await fs.ensureDir(dir)
  }

  cd(dir)

  if (!dirExists) {
    await $`node ${tamaguiBin} test-app`
  }

  cd(`test-app`)

  server = $`yarn web:extract`

  await waitPort({
    port: 3000,
    host: 'localhost',
  })

  // pre-warm
  await fetch(`http://localhost:3000`)
  await sleep(2000)
})

test.afterAll(async () => {
  await sleep(10_000)
  console.log(`Killing server...`)

  test.setTimeout(oneMinute * 3)

  await Promise.race([
    server?.kill(),
    sleep(oneMinute).then(() => console.log(`timed out server kill`)),
  ])

  // next complains if we delete too soon i think
  // await sleep(2000)

  // if (isLocalDev) {
  //   await Promise.all([
  //     $`rm -rf ${dir}`,
  //     sleep(oneMinute).then(() => console.log(`timed out cleanup`)),
  //   ])
  // }
})

// TODO run these tests in prod and dev

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
