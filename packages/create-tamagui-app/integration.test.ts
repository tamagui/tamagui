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
const PACKAGES_ROOT = join(PACKAGE_ROOT, '..')

if (process.env.NODE_ENV === 'test') {
  try {
    execSync(`git status --porcelain`)
  } catch (err) {
    console.error(`\n⚠️  -- Must commit changes to git repo before running test --\n`)
    process.exit(1)
  }
}

test.beforeAll(async () => {
  test.setTimeout(15 * 60 * 1_000)

  const dir = join(tmpdir(), `cta-test-${Date.now()}`)
  const tamaguiBin = join(PACKAGE_ROOT, `dist`, `index.js`)

  console.log(`Making test app in`, dir)
  await fs.ensureDir(dir)
  cd(dir)

  await $`node ${tamaguiBin} test-app`

  cd(`test-app`)

  // copy in local tamagui files to ensure we're testing repo versions
  await copyTamaguiPackages(join(dir, 'test-app'))

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

async function copyTamaguiPackages(dir: string) {
  const modulesDir = join(dir, 'node_modules')
  const tamaguiModulesDir = join(modulesDir, '@tamagui')
  await fs.remove(tamaguiModulesDir)
  console.log(`Copying in tamagui local modules from ${PACKAGES_ROOT} to ${tamaguiModulesDir}`)
  await fs.copy(PACKAGES_ROOT, tamaguiModulesDir)
}
