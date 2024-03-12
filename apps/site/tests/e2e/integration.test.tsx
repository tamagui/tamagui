// import { expect, test } from '@playwright/test'
// import waitPort from 'wait-port'
// import type { ProcessPromise } from 'zx'
// import { $, fetch, sleep } from 'zx'

// let server: ProcessPromise | null = null

// const isProd = process.env.RUN_ENV === 'production'
// const port = isProd ? 3333 : 5005
// const domain = `http://localhost:${port}`

// const oneMinute = 1000 * 60
// let didFailInBeforeAll = false

// test.beforeAll(async () => {
//   try {
//     test.setTimeout(oneMinute * (isProd ? 10 : 5))
//     if (isProd) {
//       await $`yarn ci:build`
//     }
//     server = isProd ? $`yarn next:start` : $`yarn dev`
//     server.catch((err) => {
//       console.warn(`server err ${err}`)
//     })
//     await waitPort({
//       port: port,
//       host: 'localhost',
//     })
//     if (!isProd) {
//       // pre-warm
//       await fetch(domain)
//       await sleep(3000)
//     }
//   } catch (err) {
//     console.error('err', err)
//     didFailInBeforeAll = true
//     throw err
//   }
// })

// test.afterAll(async () => {
//   console.info(`Cleaning up...`)
//   await Promise.race([
//     server?.kill(),
//     sleep(oneMinute).then(() => console.info(`timed out server kill`)),
//   ])
//   if (didFailInBeforeAll) {
//     console.info(`⚠️ Failed!`)
//   }
// })

// // TODO run these tests in prod and dev

// test(`Loads home screen with no errors or logs`, async ({ page }) => {
//   const logs = {
//     error: [],
//     warn: [],
//     log: [],
//     info: [],
//   }

//   page.on('console', (message) => {
//     logs[message.type()] ||= []
//     logs[message.type()].push(message.text())
//   })

//   await page.goto(domain)
//   expect(logs.error.length).toBe(0)
//   expect(logs.warn.length).toBe(0)
// })

// test(`Loads home screen content properly`, async ({ page }) => {
//   await page.goto(domain)
//   await expect(page.getByText('Write less').first()).toBeVisible()
//   const menuButton = page.locator(`button[aria-label="Open the main menu"]`).first()
//   await expect(menuButton).toBeVisible()
//   await menuButton.click()
//   await menuButton.hover()
//   const menuContents = page.locator(`[aria-label="Home menu contents"]`).last()
//   await expect(menuContents).toBeVisible()
// })
