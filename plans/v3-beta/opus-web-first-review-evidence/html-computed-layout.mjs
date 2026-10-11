import { chromium, webkit } from '/Users/n8/tamagui/node_modules/playwright/index.mjs'
for (const [n, bt] of [
  ['chromium', chromium],
  ['webkit', webkit],
]) {
  const b = await bt.launch()
  const p = await b.newPage()
  await p.goto('file://' + process.argv[2])
  console.log(
    n,
    JSON.stringify(
      await p.evaluate(() => {
        const g = (id) => {
          const e = document.getElementById(id)
          const c = getComputedStyle(e)
          const r = e.getBoundingClientRect()
          return {
            display: c.display,
            boxSizing: c.boxSizing,
            top: Math.round(r.top),
            left: Math.round(r.left),
            w: Math.round(r.width),
          }
        }
        return {
          hiddenDiv: g('d'),
          h1a: g('h1a'),
          h1b: g('h1b'),
          p1: g('p1'),
          p2: g('p2'),
          div: g('div'),
          btn: g('btn'),
        }
      })
    )
  )
  await b.close()
}
