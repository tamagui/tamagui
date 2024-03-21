import { homedir, tmpdir } from 'os'
import { join } from 'path'

import { expect, test } from '@playwright/test'
import { readFile } from 'fs-extra'
import waitPort from 'wait-port'
import type { ProcessPromise } from 'zx'
import { $, cd, fetch, fs, sleep } from 'zx'

let server: ProcessPromise | null = null

const PACKAGE_ROOT = __dirname

process.env.NODE_ENV = 'test'
$.env.NODE_ENV = 'test'

const PORT = 5006

const appName = 'test-app'

const IS_TAMAGUI_DEV = process.env.IS_TAMAGUI_DEV

const dir = IS_TAMAGUI_DEV
  ? `${homedir()}/tamagui/.tmp/tamagui-test`
  : join(tmpdir(), `cta-test-${Date.now()}`)

const oneMinute = 1000 * 60
const timeout = oneMinute * 10

let didFailInBeforeAll = false

test.beforeAll(async () => {
  if (IS_TAMAGUI_DEV) {
    return
  }

  try {
    // 15 m
    test.setTimeout(timeout)

    const tamaguiBin = join(PACKAGE_ROOT, `dist`, `index.js`)

    console.info(`Making test app in`, dir)

    // clear it from old tests
    await fs.remove(dir)
    await fs.ensureDir(dir)

    cd(dir)

    await $`YARN_ENABLE_IMMUTABLE_INSTALLS=false node ${tamaguiBin} ${appName} --template starter-free`

    cd(appName)

    // breaks because of static package
    // Error: Assertion failed: Writing attempt prevented to /Users/n8/tamagui/packages/babel-plugin/node_modules/@tamagui/static which is outside project root: /Users/n8/tamagui/.tmp/tamagui-test/test-app
    // if (IS_TAMAGUI_DEV) {
    //   // test the current version of tamagui
    //   await $`yarn link --all ~/tamagui`
    // }

    server = $`yarn web:extract`

    server.catch((err) => {
      console.warn(`server err ${err}`)
    })

    await waitPort({
      port: PORT,
      host: 'localhost',
    })

    // pre-warm
    await fetch(`http://localhost:${PORT}`)
    await sleep(2000)
  } catch (err) {
    didFailInBeforeAll = true
    throw err
  }
})

test.afterAll(async () => {
  test.setTimeout(oneMinute * 3)
  console.info(`Killing server...`)

  await Promise.race([
    server?.kill(),
    sleep(oneMinute).then(() => console.info(`timed out server kill`)),
  ])

  if (didFailInBeforeAll) {
    console.info(`\n ⚠️ Failed during test, leaving behind tmp dir for debugging\n`)
    return
  }

  if (IS_TAMAGUI_DEV && !process.env.TAMAGUI_AVOID_TEST_CLEANUP) {
    // next complains if we delete too soon i think
    await sleep(1000)
    await Promise.race([
      $`rm -rf ${dir}`,
      sleep(oneMinute).then(() => console.info(`timed out cleanup`)),
    ])

    console.info(`Done cleaning`)
  }
})

// TODO run these tests in prod and dev

// these dont need to run for releases since they are trailing anyway and need to be fixed to run against current code
if (IS_TAMAGUI_DEV) {
  test(`ok`, () => {
    expect(1).toBe(1)
  })
}

if (!IS_TAMAGUI_DEV) {
  test(`Loads home screen that opens drawer`, async ({ page }) => {
    await page.goto(`http://localhost:${PORT}/`, {
      timeout: 15_000,
    })
    await expect(page.locator('text=Welcome to Tamagui.')).toBeVisible()

    // open drawer (TODO make attr for better selector)
    await page.locator('.is_Button').nth(1).click()
    await expect(page.locator('.is_Sheet').first()).toBeVisible()

    // TODO add label to inner close button
    // TODO add visual test for sheet opening
  })

  test(`Navigates to user page`, async ({ page }) => {
    test.setTimeout(timeout)
    await page.goto(`http://localhost:${PORT}/`, {
      timeout: 15_000,
    })
    await expect(page.locator('a[role="link"]:has-text("Link to user")')).toBeVisible()
    await page.locator('a[role="link"]:has-text("Link to user")').click()
    await expect(page.locator('text=User ID: nate')).toBeVisible()
    await expect(page).toHaveURL(`http://localhost:${PORT}/user/nate`)
  })

  test(`Updates the root package.json name`, async () => {
    const packageJsonData = JSON.parse(
      (await readFile(join(dir, appName, 'package.json'))).toString()
    )
    expect(packageJsonData.name).toEqual(appName)
  })
}
