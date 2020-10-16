import * as babelParser from '@babel/parser'

export const parserOptions: babelParser.ParserOptions = Object.freeze({
  plugins: [
    'asyncGenerators',
    'classProperties',
    'dynamicImport',
    'functionBind',
    'jsx',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'decorators-legacy',
    'typescript',
    'optionalChaining',
    'nullishCoalescingOperator',
  ],
  sourceType: 'module',
})

const parser = babelParser.parse.bind(babelParser)

export function parse(code: string | Buffer) {
  return parser(code.toString(), parserOptions)
}
