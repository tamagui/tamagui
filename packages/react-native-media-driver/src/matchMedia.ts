// web-only use platform:

import { MatchMedia } from '@tamagui/core'

export const matchMedia: MatchMedia = globalThis['matchMedia']
