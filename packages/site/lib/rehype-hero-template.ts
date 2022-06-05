import fs from 'fs'
import path from 'path'

import visit from 'unist-util-visit'

const ROOT_PATH = process.cwd()
const HERO_PATH = 'components/demos'

export default (options = {}) => {
  return (tree) => {
    visit(tree, 'element', visitor)
  }

  function visitor(node, index, parent) {
    if (node.tagName !== 'code' || !node.properties.template) return
    const templateName = node.properties.template
    if (!templateName) return
    const templatePath = path.join(`${ROOT_PATH}/${HERO_PATH}/${templateName}Demo.tsx`)
    let source = fs.readFileSync(path.join(templatePath), 'utf8')
    // can do any extra transforms here
    // source = source.replace('', '')
    node.children[0].value = source
  }
}
