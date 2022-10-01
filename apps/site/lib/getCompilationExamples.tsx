import { toHtml } from 'hast-util-to-html'
import rangeParser from 'parse-numeric-range'
import { refractor } from 'refractor'
import css from 'refractor/lang/css'
import tsx from 'refractor/lang/tsx'

import { animationCode, compilationCode } from './codeExamples'
import rehypeHighlightLine from './rehype-highlight-line'
import rehypeHighlightWord from './rehype-highlight-word'

export function getCompilationExamples() {
  refractor.register(tsx)
  refractor.register(css)

  function codeToHTML(source: string, language: 'tsx' | 'css' | string, line = '0') {
    let result: any = refractor.highlight(source, language)
    result = rehypeHighlightLine(result, rangeParser(line))
    result = rehypeHighlightWord(result)
    result = toHtml(result)
    return result as string
  }

  const compilationExamples = compilationCode.map((item) => {
    return {
      ...item,
      input: {
        ...item.input,
        examples: item.input.examples.map((ex) => {
          return {
            ...ex,
            code: codeToHTML(ex.code, ex.language),
          }
        }),
      },
      output: {
        ...item.output,
        examples: item.output.examples.map((ex) => {
          return {
            ...ex,
            code: codeToHTML(ex.code, ex.language),
          }
        }),
      },
    }
  })

  return {
    compilationExamples,
    animationCode: codeToHTML(animationCode, 'tsx'),
  }
}
