// Style site extraction over sucrase's token stream.
//
// The ultra-light path for in-browser IDEs: sucrase's tokenizer already
// resolves the hard ambiguities (JSX vs TS generics, template boundaries), and
// a token walk over its output is a few kilobytes on top. The parser is
// injected rather than imported so a host that already bundles sucrase reuses
// its copy:
//
//   import { parse } from 'sucrase/dist/parser'
//   import { TokenType } from 'sucrase/dist/parser/tokenizer/types'
//   const extract = createSucraseStyleSiteExtractor({ parse, TokenType })
//
// Two site shapes are recognized, matching the eslint rule and the tsserver
// plugin: string-valued JSX attributes on tamagui components, and string
// property values anywhere inside a styled() call's definition object
// (variants nest arbitrarily). Sites whose raw text differs from its cooked
// value (escapes, entities, template substitutions) are skipped: replacing an
// approximate span risks deleting a runtime clause.

import type { ExtractStyleSites, StyleSite } from './document'

export interface SucraseToken {
  type: number
  start: number
  end: number
}

export interface SucraseParser {
  parse(
    code: string,
    isJSXEnabled: boolean,
    isTypeScriptEnabled: boolean,
    isFlowEnabled: boolean
  ): { tokens: SucraseToken[] }
  TokenType: Readonly<Record<string, number>>
}

export interface SucraseExtractorOptions {
  /** which prop names produce sites; default: every prop */
  isStyleProp?: (name: string) => boolean
  /**
   * which import sources mark components and `styled` as tamagui's.
   * default: `tamagui`, `tamagui/*`, `@tamagui/*`
   */
  isTamaguiModule?: (source: string) => boolean
  /** treat every capitalized JSX element as a tamagui component */
  allComponents?: boolean
}

function defaultIsTamaguiModule(source: string): boolean {
  return (
    source === 'tamagui' ||
    source.startsWith('tamagui/') ||
    source.startsWith('@tamagui/')
  )
}

export function createSucraseStyleSiteExtractor(
  parser: SucraseParser,
  options: SucraseExtractorOptions = {}
): ExtractStyleSites {
  const { TokenType } = parser
  const T = {
    import: TokenType._import,
    string: TokenType.string,
    name: TokenType.name,
    comma: TokenType.comma,
    colon: TokenType.colon,
    eq: TokenType.eq,
    dot: TokenType.dot,
    star: TokenType.star,
    slash: TokenType.slash,
    braceL: TokenType.braceL,
    braceR: TokenType.braceR,
    dollarBraceL: TokenType.dollarBraceL,
    parenL: TokenType.parenL,
    parenR: TokenType.parenR,
    backQuote: TokenType.backQuote,
    template: TokenType.template,
    jsxTagStart: TokenType.jsxTagStart,
    jsxTagEnd: TokenType.jsxTagEnd,
    jsxName: TokenType.jsxName,
  }
  const isStyleProp = options.isStyleProp ?? (() => true)
  const isTamaguiModule = options.isTamaguiModule ?? defaultIsTamaguiModule

  return (source) => {
    const tokens = parser.parse(source, true, true, false).tokens
    const sites: StyleSite[] = []

    const text = (token: SucraseToken): string => source.slice(token.start, token.end)

    /** cooked content span of a string/template value token run, else null */
    const stringContent = (
      index: number
    ): { start: number; end: number; next: number } | null => {
      const token = tokens[index]
      if (token.type === T.string) {
        const content = source.slice(token.start + 1, token.end - 1)
        // escapes and JSX entities cook differently than they read; skip
        if (content.includes('\\') || content.includes('&')) return null
        return { start: token.start + 1, end: token.end - 1, next: index + 1 }
      }
      if (token.type === T.backQuote) {
        const inner = tokens[index + 1]
        if (inner?.type === T.backQuote) {
          return { start: token.end, end: inner.start, next: index + 2 }
        }
        if (inner?.type === T.template && tokens[index + 2]?.type === T.backQuote) {
          if (text(inner).includes('\\')) return null
          return { start: inner.start, end: inner.end, next: index + 3 }
        }
      }
      return null
    }

    // ── pass 1: imported vocabulary ────────────────────────────────────────
    const styledBindings = new Set<string>()
    const componentNames = new Set<string>()

    for (let index = 0; index < tokens.length; index++) {
      if (tokens[index].type !== T.import) continue
      // find the module string: the first string token before the next
      // statement-ish token; import statements are short, scan ahead
      let cursor = index + 1
      const specifiers: Array<{ imported: string; local: string }> = []
      let namespace: string | null = null
      let sawBrace = false
      while (cursor < tokens.length) {
        const token = tokens[cursor]
        if (token.type === T.string) break
        if (token.type === T.braceL) sawBrace = true
        if (token.type === T.star && tokens[cursor + 2]?.type === T.name) {
          namespace = text(tokens[cursor + 2])
          cursor += 2
        }
        if (token.type === T.name && sawBrace) {
          const imported = text(token)
          if (imported !== 'as' && imported !== 'type' && imported !== 'from') {
            let local = imported
            if (
              tokens[cursor + 1]?.type === T.name &&
              text(tokens[cursor + 1]) === 'as' &&
              tokens[cursor + 2]?.type === T.name
            ) {
              local = text(tokens[cursor + 2])
              cursor += 2
            }
            specifiers.push({ imported, local })
          }
        }
        cursor++
      }
      const moduleToken = tokens[cursor]
      if (!moduleToken || moduleToken.type !== T.string) continue
      const moduleSource = source.slice(moduleToken.start + 1, moduleToken.end - 1)
      if (!isTamaguiModule(moduleSource)) continue
      if (namespace) componentNames.add(namespace)
      for (const specifier of specifiers) {
        if (specifier.imported === 'styled') {
          styledBindings.add(specifier.local)
        } else if (/^[A-Z]/.test(specifier.imported)) {
          componentNames.add(specifier.local)
        }
      }
      index = cursor
    }

    // `const X = styled(...)` marks X as a tamagui component
    for (let index = 0; index + 3 < tokens.length; index++) {
      if (
        tokens[index].type === T.name &&
        tokens[index + 1].type === T.eq &&
        tokens[index + 2].type === T.name &&
        styledBindings.has(text(tokens[index + 2])) &&
        tokens[index + 3].type === T.parenL
      ) {
        componentNames.add(text(tokens[index]))
      }
    }

    // ── pass 2: sites ──────────────────────────────────────────────────────
    // open JSX tags nest through attribute expressions, so both trackers are
    // stacks maintained by one linear walk over brace/paren depth
    const tagStack: Array<string | null> = []
    const styledStack: Array<{ parenDepth: number; braceDepth: number; arg: number }> = []
    let parenDepth = 0
    let braceDepth = 0

    const jsxRootAccepted = (name: string | null): boolean => {
      if (!name) return false
      if (options.allComponents) return /^[A-Z]/.test(name)
      return componentNames.has(name)
    }

    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index]

      if (token.type === T.parenL) parenDepth++
      else if (token.type === T.parenR) {
        parenDepth--
        const styledContext = styledStack[styledStack.length - 1]
        if (styledContext && parenDepth < styledContext.parenDepth) styledStack.pop()
      } else if (token.type === T.braceL || token.type === T.dollarBraceL) {
        braceDepth++
      } else if (token.type === T.braceR) braceDepth--
      else if (token.type === T.jsxTagStart) {
        // every tag head — opening `<X`, self-closing, closing `</X` — ends at
        // exactly one jsxTagEnd, so heads push and pop unconditionally.
        // attributes only ever occur inside the innermost head; nesting comes
        // from attribute expressions like render={<Y a="1" />}
        const isClosing = tokens[index + 1]?.type === T.slash
        const root =
          !isClosing && tokens[index + 1]?.type === T.jsxName
            ? text(tokens[index + 1])
            : null
        tagStack.push(root)
        continue
      } else if (token.type === T.jsxTagEnd) {
        tagStack.pop()
        continue
      }

      // styled(...) call opens a context
      if (
        token.type === T.name &&
        styledBindings.has(text(token)) &&
        tokens[index + 1]?.type === T.parenL
      ) {
        styledStack.push({ parenDepth: parenDepth + 1, braceDepth, arg: 0 })
        continue
      }

      // commas at call depth separate styled()'s arguments; only the second
      // argument is the definition object
      const styledContext = styledStack[styledStack.length - 1]
      if (
        styledContext &&
        token.type === T.comma &&
        parenDepth === styledContext.parenDepth &&
        braceDepth === styledContext.braceDepth
      ) {
        styledContext.arg++
        continue
      }

      // styled definition property: `{ key: 'value' }` at any nesting
      if (
        styledContext?.arg === 1 &&
        (token.type === T.name || token.type === T.string) &&
        (tokens[index - 1]?.type === T.braceL || tokens[index - 1]?.type === T.comma) &&
        tokens[index + 1]?.type === T.colon &&
        braceDepth > styledContext.braceDepth
      ) {
        const property =
          token.type === T.string
            ? source.slice(token.start + 1, token.end - 1)
            : text(token)
        const content = stringContent(index + 2)
        if (content && isStyleProp(property)) {
          const after = tokens[content.next]
          if (after?.type === T.comma || after?.type === T.braceR) {
            sites.push({
              property,
              value: source.slice(content.start, content.end),
              start: content.start,
              end: content.end,
              kind: 'styled-property',
            })
          }
        }
        continue
      }

      // JSX attribute: jsxName not part of the tag name itself
      if (
        token.type === T.jsxName &&
        tokens[index - 1]?.type !== T.jsxTagStart &&
        tokens[index - 1]?.type !== T.dot &&
        tokens[index - 1]?.type !== T.slash &&
        jsxRootAccepted(tagStack[tagStack.length - 1] ?? null)
      ) {
        const property = text(token)
        if (!isStyleProp(property)) continue
        if (tokens[index + 1]?.type !== T.eq) continue
        const valueIndex = index + 2
        let content: { start: number; end: number; next: number } | null = null
        if (tokens[valueIndex]?.type === T.braceL) {
          const inner = stringContent(valueIndex + 1)
          if (inner && tokens[inner.next]?.type === T.braceR) content = inner
        } else {
          content = stringContent(valueIndex)
        }
        if (content) {
          sites.push({
            property,
            value: source.slice(content.start, content.end),
            start: content.start,
            end: content.end,
            kind: 'jsx-attribute',
          })
        }
      }
    }

    return sites
  }
}
