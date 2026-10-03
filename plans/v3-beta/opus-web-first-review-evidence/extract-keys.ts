import { ATTRIBUTES } from '/Users/n8/.worktrees/tamagui-v3-docs-pass2/code/core/dom/src/tables/attributes.ts'
import { EVENTS } from '/Users/n8/.worktrees/tamagui-v3-docs-pass2/code/core/dom/src/tables/events.ts'
const src = ['validStyleProps.ts', 'webOnlyStyleProps.ts']
  .map((f) =>
    Bun.file(`/Users/n8/.worktrees/tamagui-v3-docs-pass2/code/core/helpers/src/${f}`)
  )
  .map((f) => f.text())
const text = (await Promise.all(src)).join('\n')
const words = new Set<string>()
for (const m of text.matchAll(/'([A-Za-z_][A-Za-z_ ]+)'/g))
  for (const w of m[1].split(/\s+/))
    if (w && !['web', 'native', 'ios', 'android'].includes(w)) words.add(w)
await Bun.write(
  process.argv[2],
  JSON.stringify({
    styles: [...words],
    attrs: Object.keys(ATTRIBUTES),
    events: Object.keys(EVENTS),
  })
)
console.log(
  'styles',
  words.size,
  'attrs',
  Object.keys(ATTRIBUTES).length,
  'events',
  Object.keys(EVENTS).length
)
