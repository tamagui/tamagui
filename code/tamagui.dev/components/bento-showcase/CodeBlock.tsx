import rangeParser from 'parse-numeric-range'
import React from 'react'
import { refractor } from 'refractor'
import tsx from 'refractor/lang/tsx'
import type { GetProps } from 'tamagui'
import { YStack } from 'tamagui'
import { toHtml } from 'hast-util-to-html'
import parse from 'rehype-parse'
import { unified } from 'unified'
import { renderSafeHastNodes } from '~/features/security/renderSafeHtml'

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
    const classes = `language-${language} ${className}`
    // if (mode === 'typewriter') {
    //   return <CodeTypewriter className={classes} variant="" value={result} {...props} />
    // }

    return (
      <Pre
        ref={forwardedRef as any}
        className={classes}
        data-line-numbers={showLineNumbers}
        {...props}
      >
        <Code className={classes}>{renderSafeHastNodes(result)}</Code>
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

const highlightWord = (nodes) => {
  return nodes.flatMap((node) => wrapCallouts(node))
}

const wrapCallouts = (node) => {
  if (node?.type === 'text' && typeof node.value === 'string') {
    return splitCallouts(node)
  }

  if (node?.children) {
    return [
      {
        ...node,
        children: node.children.flatMap((child) => wrapCallouts(child)),
      },
    ]
  }

  return [node]
}

const splitCallouts = (node) => {
  const value = node.value
  const parts: any[] = []
  const callout = /__(.*?)__/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = callout.exec(value))) {
    if (match.index > lastIndex) {
      parts.push({
        ...node,
        value: value.slice(lastIndex, match.index),
      })
    }

    parts.push({
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['highlight-word'],
      },
      children: [
        {
          ...node,
          value: match[1],
        },
      ],
    })

    lastIndex = match.index + match[0].length
  }

  if (parts.length === 0) {
    return [node]
  }

  if (lastIndex < value.length) {
    parts.push({
      ...node,
      value: value.slice(lastIndex),
    })
  }

  return parts
}

import { Paragraph, styled } from 'tamagui'

const Code = styled(Paragraph, {
  name: 'Code',
  render: 'code',
  fontFamily: '$mono',
  size: '$3',
  lineHeight: 18,
  cursor: 'inherit',
  whiteSpace: 'pre',
  p: '$1',
  rounded: '$4',

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
  render: 'pre',
  p: '$4',
  rounded: '$4',
  bg: '$background',
})
