import { join } from 'path'

import { test } from '@playwright/test'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import { ensureDir, remove } from 'fs-extra'

const sizes = [
  // {
  //   height: 256,
  //   width: 256,
  // },
  {
    height: 512,
    width: 512,
  },
  {
    width: 1024,
    height: 1024,
  },
]

test('bento screenshot', async ({ browser }) => {
  const sections = await fetch('http://localhost:5005/api/bento/data.json').then((res) =>
    res.json()
  )

  const base = join(__dirname, `../../public/bento`)

  for (const size of sizes) {
    for (const section of sections) {
      for (const { name, route, components } of section.parts) {
        for (const component of components) {
          const page = await browser.newPage()
          await test.step(`${name}-${component}-${size.width}x${size.height}`, async () => {
            const url = `http://localhost:5005/demo/bento${route}?name=${component}`
            page.setViewportSize(size)
            await page.goto(url, { waitUntil: 'networkidle' })
            await page.screenshot({
              path: join(
                base,
                `screenshots-png`,
                route,
                `${component}-${size.width}x${size.height}.png`
              ),
              omitBackground: true,
            })
          })

          await page.close()
        }
      }
    }
  }

  await ensureDir(`${base}/screenshots`)

  await imagemin([`${base}/**/*.png`], {
    destination: `${base}/screenshots`,
    plugins: [imageminWebp({ quality: 80 })],
  })

  await remove(join(base, `screenshots-png`))
})
