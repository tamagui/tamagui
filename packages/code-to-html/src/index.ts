import { toHtml } from 'hast-util-to-html'
import rangeParser from 'parse-numeric-range'
import { refractor } from 'refractor'
import css from 'refractor/lang/css'
import tsx from 'refractor/lang/tsx'

import { highlightLine } from './highlightLine'
import { highlightWord } from './highlightWord'

refractor.register(tsx)
refractor.register(css)

export function codeToHTML(source: string, language: 'tsx' | 'css' | string, line = '0') {
  let result: any = refractor.highlight(source, language)
  result = highlightLine(result, rangeParser(line))
  result = highlightWord(result)
  result = toHtml(result)
  return result as string
}
