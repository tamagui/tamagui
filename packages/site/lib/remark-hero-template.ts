const fs = require('fs')
const path = require('path')
const utilvisit = require('unist-util-visit')

const ROOT_PATH = process.cwd()
const HERO_PATH = 'components/demos'

export default (options = {}) => {
  return (tree) => {
    utilvisit(tree, 'code', visitor)
  }

  function visitor(node, index, parent) {
    if (!node.meta) return
    const [_, templateName] = node.meta?.split('template=') ?? []
    if (!templateName) return
    const templatePath = path.join(`${ROOT_PATH}/${HERO_PATH}/${templateName}Demo.tsx`)
    let source = fs.readFileSync(path.join(templatePath), 'utf8')
    node.value = source
  }
}
