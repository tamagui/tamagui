import { animationCode, compilationCode } from './codeExamples'
import { createCodeHighlighter } from './highlightCode'

export function getCompilationExamples() {
  const highlightCode = createCodeHighlighter()
  const compilationExamples = compilationCode.map((item) => {
    return {
      ...item,
      input: {
        ...item.input,
        examples: item.input.examples.map((ex) => {
          return {
            ...ex,
            code: highlightCode(ex.code, ex.language),
          }
        }),
      },
      output: {
        ...item.output,
        examples: item.output.examples.map((ex) => {
          return {
            ...ex,
            code: highlightCode(ex.code, ex.language),
          }
        }),
      },
    }
  })

  return {
    compilationExamples,
    animationCode: highlightCode(animationCode, 'tsx'),
  }
}
