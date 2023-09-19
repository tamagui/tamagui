export * from './useStore'
export { configureUseStore } from './configureUseStore'
export * from './interfaces'
export * from './observe'
export { UNWRAP_PROXY } from './constants'
export * from './comparators'
export * from './decorators'

// to extend for prop types
export class Store<Props extends Record<string, any>> {
  constructor(public props: Props) {}
}
