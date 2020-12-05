process.env.SNACKUI_COMPILE_PROCESS = '1'

export { default as GlossWebpackLoader } from './loader'
export * from './getStylesAtomic'
export { createExtractor } from './ast/createExtractor'
export { literalToAst } from './ast/literalToAst'
