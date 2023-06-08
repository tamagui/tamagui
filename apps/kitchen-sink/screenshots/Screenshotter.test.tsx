import { readdirSync } from 'fs'
import { join } from 'path'

import { test } from '@playwright/test'

const sizes = [
  {
    height: 650,
    width: 650,
  },
  {
    width: 1200,
    height: 630,
  },
]

for (const size of sizes) {
  const demos = readdirSync(join(__dirname, '../../../packages/demos/src'))
    .filter((file) => file.endsWith('Demo.tsx'))
    .map((demo) => demo.split('.')[0])
  for (const demo of demos) {
    test(`take screenshots for ${demo} for size ${size.width}x${size.height}`, async ({
      page,
    }) => {
      page.setViewportSize(size)
      await page.goto(`/?demo=${demo}&screenshot=true`)
      await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
      await page.screenshot({
        path: join(
          __dirname,
          `../../site/public/screenshots/light/${demo}/${size.width}x${size.height}.png`
        ),
        omitBackground: true,
      })

      await page.goto(`/?demo=${demo}&screenshot=true&theme=dark`)
      await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
      await page.screenshot({
        path: join(
          __dirname,
          `../../site/public/screenshots/dark/${demo}/${size.width}x${size.height}.png`
        ),

        omitBackground: true,
      })
    })
  }
}
