// const visit = require('unist-util-visit')
import { toHtml } from 'hast-util-to-html'
import parse from 'rehype-parse'
import { unified } from 'unified'

const CALLOUT = /__(.*?)__/g

export function highlightWord(code) {
  const html = toHtml(code)
  const result = html.replace(
    CALLOUT,
    (_, text) => `<span class="highlight-word">${text}</span>`
  )
  const hast = unified()
    .use(parse, { emitParseErrors: true, fragment: true })
    .parse(result)
  return hast['children']
}
