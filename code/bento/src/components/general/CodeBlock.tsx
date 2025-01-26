import rangeParser from 'parse-numeric-range'
import React from 'react'
import { refractor } from 'refractor'
import tsx from 'refractor/lang/tsx'
import type { GetProps } from 'tamagui'
import { YStack } from 'tamagui'
import { toHtml } from 'hast-util-to-html'
import parse from 'rehype-parse'
import { unified } from 'unified'

refractor.register(tsx)

type PreProps = Omit<GetProps<typeof Pre>, 'css'>

export type CodeBlockProps = PreProps & {
  language: 'tsx'
  value: string
  line?: string
  css?: any
  mode?: 'static' // | 'typewriter' | 'interactive'
  showLineNumbers?: boolean
}

export default React.forwardRef<HTMLPreElement, CodeBlockProps>(
  function CodeBlock(_props, forwardedRef) {
    const {
      language,
      value,
      line = '0',
      className = '',
      mode,
      showLineNumbers,
      ...props
    } = _props
    let result: any = refractor.highlight(value, language)
    result = highlightLine(result, rangeParser(line))
    result = highlightWord(result)
    result = toHtml(result)
    const classes = `language-${language} ${className}`
    // if (mode === 'typewriter') {
    //   return <CodeTypewriter className={classes} variant="" value={result} {...props} />
    // }

    return (
      <Pre
        ref={forwardedRef}
        className={classes}
        data-line-numbers={showLineNumbers}
        {...props}
      >
        <Code className={classes} dangerouslySetInnerHTML={{ __html: result }} />
      </Pre>
    )
  }
)

const lineNumberify = function lineNumberify(ast, lineNum = 1) {
  let lineNumber = lineNum
  return ast.reduce(
    (result, node) => {
      if (node.type === 'text') {
        if (node.value.indexOf('\n') === -1) {
          node.lineNumber = lineNumber
          result.nodes.push(node)
          return result
        }

        const lines = node.value.split('\n')
        for (let i = 0; i < lines.length; i++) {
          if (i !== 0) ++lineNumber
          if (i === lines.length - 1 && lines[i].length === 0) continue
          result.nodes.push({
            type: 'text',
            value: i === lines.length - 1 ? lines[i] : `${lines[i]}\n`,
            lineNumber: lineNumber,
          })
        }

        result.lineNumber = lineNumber
        return result
      }

      if (node.children) {
        node.lineNumber = lineNumber
        const processed = lineNumberify(node.children, lineNumber)
        node.children = processed.nodes
        result.lineNumber = processed.lineNumber
        result.nodes.push(node)
        return result
      }

      result.nodes.push(node)
      return result
    },
    { nodes: [], lineNumber: lineNumber }
  )
}

const wrapLines = function wrapLines(ast: any[], linesToHighlight) {
  const highlightAll = linesToHighlight.length === 1 && linesToHighlight[0] === 0
  const allLines: any[] = Array.from(new Set(ast.map((x) => x.lineNumber)))
  let i = 0
  const wrapped = allLines.reduce((nodes, marker) => {
    const line = marker
    const children: any[] = []
    for (; i < ast.length; i++) {
      if (ast[i].lineNumber < line) {
        nodes.push(ast[i])
        continue
      }

      if (ast[i].lineNumber === line) {
        children.push(ast[i])
        continue
      }

      if (ast[i].lineNumber > line) {
        break
      }
    }

    nodes.push({
      type: 'element',
      tagName: 'div',
      properties: {
        dataLine: line,
        className: 'highlight-line',
        dataHighlighted:
          linesToHighlight.includes(line) || highlightAll ? 'true' : 'false',
      },
      children,
      lineNumber: line,
    })

    return nodes
  }, [])

  return wrapped
}

// https://github.com/gatsbyjs/gatsby/pull/26161/files
const MULTILINE_TOKEN_SPAN = /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g

const applyMultilineFix = (ast) => {
  // AST to HTML
  let html = toHtml(ast)

  // Fix JSX issue
  html = html.replace(MULTILINE_TOKEN_SPAN, (match, token) =>
    match.replace(/\n/g, `</span>\n<span class="token ${token}">`)
  )

  // HTML to AST
  const hast = unified().use(parse, { emitParseErrors: true, fragment: true }).parse(html)

  return hast['children']
}

function highlightLine(ast, lines) {
  const formattedAst = applyMultilineFix(ast)
  const numbered = lineNumberify(formattedAst).nodes
  return wrapLines(numbered, lines)
}

const CALLOUT = /__(.*?)__/g

const highlightWord = (code) => {
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

import { Paragraph, styled } from 'tamagui'

const Code = styled(Paragraph, {
  name: 'Code',
  tag: 'code',
  fontFamily: '$mono',
  size: '$3',
  lineHeight: 18,
  cursor: 'inherit',
  whiteSpace: 'pre',
  padding: '$1',
  borderRadius: '$4',

  variants: {
    colored: {
      true: {
        color: '$color',
        backgroundColor: '$background',
      },
    },
  } as const,
})

const Pre = styled(YStack, {
  overflow: 'visible',
  tag: 'pre',
  padding: '$4',
  borderRadius: '$4',
  backgroundColor: '$background',
})
