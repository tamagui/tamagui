import { getNativeOnlyMarker } from './nativeOnly'

export { nestedHello } from './nested'

export const greet = (name: string): string => {
  return `Hello, ${name}!`
}

export const paltformGreeter = (name: string): string => {
  let salutation
  process.env.TAMAGUI_TARGET === 'web' ? (salutation = 'Hi') : (salutation = 'Hello')
  process.env.TAMAGUI_TARGET === 'native' ? (salutation = 'Hey') : (salutation = 'Hello')
  return `${salutation}, ${name}!`
}

export function runNativeSideEffect(items: string[]) {
  items.push('ran')
}

export function guardNativeSideEffects(items: string[], debug?: string) {
  runNativeSideEffect(items)

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.log(items.length)
  }

  return items
}

export function getPlatformMarker() {
  return process.env.TAMAGUI_TARGET === 'native' ? 'native-only-marker' : 'web-only-marker'
}

export function getNativeImportMarker() {
  if (process.env.TAMAGUI_TARGET === 'native') {
    return getNativeOnlyMarker()
  }

  return 'web-import-marker'
}

export function getNodeEnvMarker() {
  if (process.env.NODE_ENV === 'test') {
    return 'test-env-marker'
  }

  if (process.env.NODE_ENV === 'development') {
    return 'development-env-marker'
  }

  return 'runtime-env-marker'
}

export function applyNativeLogicalMarker(items: string[]) {
  process.env.TAMAGUI_TARGET === 'native' && items.push('native-logical-marker')
  process.env.TAMAGUI_TARGET !== 'native' && items.push('web-logical-marker')

  return items
}
