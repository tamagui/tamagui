process.env.TAMAGUI_COMPILE_PROCESS = '1'

export { TamaguiOptions } from './types'
export { createExtractor } from './extractor/createExtractor'
export { literalToAst } from './extractor/literalToAst'
export * from './constants'
export * from './extractor/extractToClassNames'
export * from './extractor/extractHelpers'
export * from './patchReactNativeWeb'
