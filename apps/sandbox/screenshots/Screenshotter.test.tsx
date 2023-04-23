import { readdirSync } from 'fs'
import { join } from 'path'

import { test } from '@playwright/test'

const demos = readdirSync(join(__dirname, '../../../packages/demos/src'))
  .filter((file) => file.endsWith('Demo.tsx'))
  .map((demo) => demo.split('.')[0])

for (const demo of demos) {
  test(`take screenshots for ${demo}`, async ({ page }) => {
    await page.goto(`/?demo=${demo}&screenshot=true`)
    await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
    await page.screenshot({
      path: `./screenshots/images/${demo}-light.png`,
      omitBackground: true,
    })

    await page.goto(`/?demo=${demo}&screenshot=true&theme=dark`)
    await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
    await page.screenshot({
      path: `./screenshots/images/${demo}-dark.png`,
      omitBackground: true,
    })
  })
}
