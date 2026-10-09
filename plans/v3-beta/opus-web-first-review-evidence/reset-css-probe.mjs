import { chromium } from '/Users/n8/tamagui/node_modules/playwright/index.mjs'
import { readFileSync } from 'node:fs'
const css = readFileSync(
  '/Users/n8/.worktrees/tamagui-v3-docs-pass2/code/core/web/reset.css',
  'utf8'
)
const b = await chromium.launch()
const p = await b.newPage()
await p.setContent(
  `<style>${css}</style><dialog id=dc>closed dialog</dialog><p id=ph hidden>hidden p</p><p id=p1>a</p><p id=p2>b</p><ul><li id=li>x</li></ul>`
)
console.log(
  JSON.stringify(
    await p.evaluate(() => {
      const g = (id) => {
        const e = document.getElementById(id)
        const r = e.getBoundingClientRect()
        return {
          display: getComputedStyle(e).display,
          h: Math.round(r.height),
          top: Math.round(r.top),
          left: Math.round(r.left),
        }
      }
      return {
        closedDialog: g('dc'),
        hiddenP: g('ph'),
        p1: g('p1'),
        p2: g('p2'),
        li: g('li'),
      }
    })
  )
)
await b.close()
