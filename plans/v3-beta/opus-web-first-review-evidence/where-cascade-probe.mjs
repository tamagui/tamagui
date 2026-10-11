import { chromium, webkit } from '/Users/n8/tamagui/node_modules/playwright/index.mjs'
const html = `<style>
:where(.is_View){display:flex;flex-direction:column}
:where(div,p,span,h1,ul,li,a,button){margin:0;padding:0;border-width:0;border-style:solid;box-sizing:border-box}
p{margin:16px}
._m-0{margin:0}
</style>
<div id=hid hidden class=is_View>x</div>
<p id=p1>third party p</p>
<p id=p2 class=is_View>tamagui p (where reset only)</p>
<p id=p3 class="is_View _m-0">tamagui p (atomic default)</p>
<button id=b1>third party button</button>
<ul id=u1><li id=l1>x</li></ul>
<dialog id=d1 open>dlg</dialog>`
for (const [n, bt] of [
  ['chromium', chromium],
  ['webkit', webkit],
]) {
  const b = await bt.launch()
  const p = await b.newPage()
  await p.setContent(html)
  console.log(
    n,
    JSON.stringify(
      await p.evaluate(() => {
        const cs = (id, k) => getComputedStyle(document.getElementById(id))[k]
        return {
          hiddenDisplay: cs('hid', 'display'),
          thirdPartyP: cs('p1', 'margin'),
          whereP: cs('p2', 'margin'),
          atomicP: cs('p3', 'margin'),
          thirdPartyButtonPad: cs('b1', 'padding'),
          thirdPartyButtonBorder: cs('b1', 'borderTopWidth'),
          ulPad: cs('u1', 'paddingLeft'),
          liMarker: cs('l1', 'display'),
        }
      })
    )
  )
  await b.close()
}
