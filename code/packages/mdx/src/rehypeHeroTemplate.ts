import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

import visit from 'unist-util-visit'

// @ts-ignore
const requireFn =
  typeof require === 'undefined' ? createRequire(import.meta.url) : require
const demosPath = requireFn.resolve('@tamagui/demos')
const demosRoot = path.join(demosPath, '..', '..', '..')

export default (options = {}) => {
  return (tree) => {
    visit(tree, 'element', visitor)
  }

  function visitor(node, index, parent) {
    if (node.tagName !== 'code' || !node.properties.template) return
    const templateName = node.properties.template
    if (!templateName) return
    const templatePath = path.join(demosRoot, 'src', `${templateName}Demo.tsx`)
    try {
      let source = fs.readFileSync(path.join(templatePath), 'utf8')
      // can do any extra transforms here
      // source = source.replace('', '')
      node.children[0].value = source
    } catch (err) {
      // @ts-ignore
      console.warn(`Error setting template`, err.message)
    }
  }
}
