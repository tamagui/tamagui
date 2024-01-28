import * as babelParser from '@babel/parser'
import type * as t from '@babel/types'

const plugins: babelParser.ParserPlugin[] = [
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
]

export const parserOptions: babelParser.ParserOptions = Object.freeze({
  plugins,
  sourceType: 'module',
})

const parser = babelParser.parse.bind(babelParser)

export function babelParse(code: string | Buffer, fileName?: string): t.File {
  const codeString = code.toString()
  try {
    return parser(codeString, parserOptions) as any
  } catch (err) {
    throw new Error(
      `Error parsing babel: ${err} in ${fileName}, code:\n${codeString}\n ${
        (err as any).stack
      }`
    )
  }
}
