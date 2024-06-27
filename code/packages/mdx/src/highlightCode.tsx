import { toHtml } from 'hast-util-to-html'
import rangeParser from 'parse-numeric-range'
import { refractor } from 'refractor'
import css from 'refractor/lang/css.js'
import tsx from 'refractor/lang/tsx.js'

import { rehypeHighlightLine } from './rehypeLine'
import { rehypeHighlightWord } from './rehypeWord'

let highlighter: (
  source: string,
  language: 'tsx' | 'css' | string,
  line?: string
) => string

export function createCodeHighlighter() {
  if (highlighter) return highlighter

  refractor.register(tsx)
  refractor.register(css)

  highlighter = function codeToHtml(source, language, line = '0') {
    let result: any = refractor.highlight(source, language)
    result = rehypeHighlightLine(result, rangeParser(line))
    result = rehypeHighlightWord(result)
    result = toHtml(result)
    return result as string
  }

  return highlighter
}
