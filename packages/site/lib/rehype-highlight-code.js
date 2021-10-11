// Inspired by https://github.com/j0lv3r4/mdx-prism

const rangeParser = require('parse-numeric-range');
const visit = require('unist-util-visit');
const nodeToString = require('hast-util-to-string');
const refractor = require('refractor');
const highlightLine = require('./rehype-highlight-line');
const highlightWord = require('./rehype-highlight-word');

module.exports = (options = {}) => {
  return (tree) => {
    visit(tree, 'element', visitor);
  };

  function visitor(node, index, parent) {
    if (
      !parent ||
      parent.tagName !== 'pre' ||
      node.tagName !== 'code' ||
      !node.properties.className
    ) {
      return;
    }

    const [_, lang] = node.properties.className[0].split('-');
    const codeString = nodeToString(node);
    let result = refractor.highlight(codeString, lang);

    const linesToHighlight = rangeParser(node.properties.line || '0');
    result = highlightLine(result, linesToHighlight);

    result = highlightWord(result);

    node.children = result;
  }
};
