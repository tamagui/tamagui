process.env.SNACKUI_COMPILE_PROCESS = '1'

export { SnackOptions } from './types'
export * from './getStylesAtomic'
export { createExtractor } from './extractor/createExtractor'
export { literalToAst } from './extractor/literalToAst'
export * from './constants'
export * from './extractor/extractToClassNames'
