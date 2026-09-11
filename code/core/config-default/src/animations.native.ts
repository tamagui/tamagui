// css transitions don't exist on native, so the driver differs. the presets do
// not: one table, the same motion on both.
import { createAnimations } from '@tamagui/animations-react-native'

import { presets } from './presets'

export const animations = createAnimations(presets)
