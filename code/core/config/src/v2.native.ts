import type { CreateTamaguiProps } from '@tamagui/web'

import { animations } from './animations'
import { config as configBase } from './v2-base'

export const config = {
  ...configBase,
  animations,
} satisfies CreateTamaguiProps
