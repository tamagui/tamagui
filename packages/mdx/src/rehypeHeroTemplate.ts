import fs from 'fs'
import path from 'path'

import visit from 'unist-util-visit'

// eval here because webpack compiles this poorly
const demosPath = path.resolve(eval(`require.resolve('@tamagui/demos')`))
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
