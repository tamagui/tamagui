// satteri hast plugin that reproduces the old @vxrn/mdx rehype chain so the
// tamagui-native <DocCodeBlock> keeps working under the satteri compiler:
//  - rehypeMetaAttribute: fence meta (line, hero, showMore, fileName, …) → props
//  - rehypeHighlightCode: refractor/prism tokens as the code block's children,
//    with per-line (`line=`) and per-word (`__word__`) highlighting
import { toHtml } from 'hast-util-to-html'
import { toString } from 'hast-util-to-string'
import rangeParser from 'parse-numeric-range'
import { refractor } from 'refractor'
import css from 'refractor/lang/css.js'
import tsx from 'refractor/lang/tsx.js'
import rehypeParse from 'rehype-parse'
import { unified } from 'unified'

refractor.register(tsx)
refractor.register(css)

// --- rehypeLine: wrap each line in a div, mark highlighted lines ---

function lineNumberify(ast: any[], lineNum = 1) {
  let lineNumber = lineNum
  return ast.reduce(
    (result: any, node: any) => {
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
            lineNumber,
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
    { nodes: [] as any[], lineNumber }
  )
}

function wrapLines(ast: any[], linesToHighlight: number[]) {
  const highlightAll = linesToHighlight.length === 1 && linesToHighlight[0] === 0
  const allLines: any[] = Array.from(new Set(ast.map((x) => x.lineNumber)))
  let i = 0
  return allLines.reduce((nodes: any[], marker: any) => {
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
      if (ast[i].lineNumber > line) break
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
}

const MULTILINE_TOKEN_SPAN = /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g

function applyMultilineFix(ast: any) {
  let html = toHtml(ast)
  html = html.replace(MULTILINE_TOKEN_SPAN, (match, token) =>
    match.replace(/\n/g, `</span>\n<span class="token ${token}">`)
  )
  const hast = unified()
    .use(rehypeParse, { emitParseErrors: true, fragment: true })
    .parse(html)
  return (hast as any).children
}

function rehypeHighlightLine(ast: any, lines: number[]) {
  const formattedAst = applyMultilineFix(ast)
  const numbered = lineNumberify(formattedAst).nodes
  return wrapLines(numbered, lines)
}

// --- rehypeWord: __word__ → highlighted span ---

const CALLOUT = /__(.*?)__/g

function rehypeHighlightWord(code: any) {
  const html = toHtml(code)
  const result = html.replace(
    CALLOUT,
    (_, text) => `<span class="highlight-word">${text}</span>`
  )
  const hast = unified()
    .use(rehypeParse, { emitParseErrors: true, fragment: true })
    .parse(result)
  return (hast as any).children
}

// --- the plugin ---

const metaRe = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g

export const highlightPlugin = {
  name: 'tamagui-prism-highlight',
  element: {
    filter: ['code'],
    visit(node: any, ctx: any) {
      const props: any = { ...node.properties }

      // meta attribute: surface fence meta as props for <DocCodeBlock>
      const meta: string = node.data?.meta || ''
      if (meta) {
        metaRe.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = metaRe.exec(meta))) {
          const key = m[1]
          const value = m[2] ?? m[3] ?? m[4] ?? ''
          if (key === 'class' || key === 'className') {
            props.className = [...(props.className || []), value]
          } else {
            props[key] = value
          }
        }
      }

      // syntax highlighting: refractor tokens + line/word highlighting
      const langClass = Array.isArray(props.className) ? props.className[0] : undefined
      const lang = langClass ? langClass.split('-')[1] : undefined
      let children = node.children
      if (lang && refractor.registered(lang)) {
        const codeString = toString(node)
        let result: any = refractor.highlight(codeString, lang)
        result = rehypeHighlightLine(result, rangeParser(String(props.line ?? '0')))
        children = rehypeHighlightWord(result)
      }

      ctx.replaceNode(node, { ...node, properties: props, children })
    },
  },
}

// standalone highlighter for raw code strings (compilation/animation examples on
// the homepage). same refractor + line/word pipeline as the plugin, but returns
// an html string instead of hast children. replaces @vxrn/mdx's createCodeHighlighter.
export function createCodeHighlighter() {
  return function highlightCode(source: string, language: string, line = '0'): string {
    let result: any = refractor.highlight(source, language)
    result = rehypeHighlightLine(result, rangeParser(line))
    result = rehypeHighlightWord(result)
    return toHtml(result)
  }
}
