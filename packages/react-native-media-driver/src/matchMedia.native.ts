import { MatchMedia } from '@tamagui/core'
import { NativeMediaQueryList } from './mediaQueryList'

export const matchMedia: MatchMedia = (query) => new NativeMediaQueryList(query)
