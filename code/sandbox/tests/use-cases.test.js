import { expect, test } from '@playwright/test'
// import waitPort from 'wait-port'
// import { $ } from 'zx'

test('todo', () => {
  expect(true).toBeTruthy()
})

// const port = 8081
// const domain = `http://localhost:${port}`

// TODO:

// test(`dev mode`, async ({ page }) => {
//   const server = $`yarn dev`
//   server.catch(console.log)
//   try {
//     await waitPort({
//       port: port,
//       host: 'localhost',
//     })

//     const logs = {
//       error: [],
//       warn: [],
//       log: [],
//       info: [],
//     }

//     page.on('console', (message) => {
//       logs[message.type()] ||= []
//       logs[message.type()].push(message.text())
//     })

//     await page.goto(domain, {
//       waitUntil: 'domcontentloaded',
//     })

//     if (logs.error.length) {
//       console.info(`Error logs: `, logs.error.join('\n'))
//     }

//     if (logs.warn.length) {
//       console.info(`Warn logs: `, logs.warn.join('\n'))
//     }

//     expect(logs.error.length).toBe(0)
//     expect(logs.warn.length).toBe(0)
//     await expect(page.getByText('Hello world').first()).toBeVisible()
//   } catch (err) {
//     console.error(err)
//   } finally {
//     await server.kill()
//   }
// })

// test(`builds to prod same thing`, async ({ page }) => {
//   await $`yarn build:prod`
//   const server = $`yarn vite preview --port ${port}`
//   server.catch(console.log)

//   try {
//     await waitPort({
//       port: port,
//       host: 'localhost',
//     })

//     const logs = {
//       error: [],
//       warn: [],
//       log: [],
//       info: [],
//     }

//     page.on('console', (message) => {
//       logs[message.type()] ||= []
//       logs[message.type()].push(message.text())
//     })

//     await page.goto(domain, {
//       waitUntil: 'domcontentloaded',
//     })

//     if (logs.error.length) {
//       console.info(`Error logs: `, logs.error.join('\n'))
//     }

//     if (logs.warn.length) {
//       console.info(`Warn logs: `, logs.warn.join('\n'))
//     }

//     expect(logs.error.length).toBe(0)
//     expect(logs.warn.length).toBe(0)
//     await expect(page.getByText('Hello world').first()).toBeVisible()
//   } finally {
//     await server.kill()
//   }
// })
