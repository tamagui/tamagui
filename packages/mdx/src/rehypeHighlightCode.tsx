// Inspired by https://github.com/j0lv3r4/mdx-prism

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { toString } from 'hast-util-to-string'
import rangeParser from 'parse-numeric-range'
import { refractor } from 'refractor'
import tsx from 'refractor/lang/tsx.js'
import visit from 'unist-util-visit'

import { rehypeHighlightLine } from './rehypeLine'
import { rehypeHighlightWord } from './rehypeWord'

refractor.register(tsx)

export const rehypeHighlightCode = (options = {}) => {
  return (tree) => {
    visit(tree, 'element', visitor)
  }

  function visitor(node, index, parent) {
    if (
      !parent ||
      parent.tagName !== 'pre' ||
      node.tagName !== 'code' ||
      !node.properties.className
    ) {
      return
    }

    const [_, lang] = node.properties.className[0].split('-')
    const codeString = toString(node)
    let result = refractor.highlight(codeString, lang)

    const linesToHighlight = rangeParser(node.properties.line || '0')

    result = rehypeHighlightLine(result, linesToHighlight)

    node.children = rehypeHighlightWord(result)
  }
}
