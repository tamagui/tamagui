process.env.SNACKUI_COMPILE_PROCESS = '1'

export { SnackOptions } from './types'
export * from './getStylesAtomic'
export { createExtractor } from './extractor/createExtractor'
export { literalToAst } from './extractor/literalToAst'
export * from './constants'
export * from './extractor/extractToClassNames'
export * from './extractor/extractHelpers'

export const rnwPatch = `
export const internal = {
  css,
  TextAncestorContext,
  forwardPropsList,
  pick,
  useElementLayout,
  useMergeRefs,
  usePlatformMethods,
  useResponderEvents,
  createElement,
}      
`
