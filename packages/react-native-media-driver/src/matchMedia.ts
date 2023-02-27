// web-only use platform:

import type { MatchMedia } from '@tamagui/web'

export const matchMedia: MatchMedia = globalThis['matchMedia']
