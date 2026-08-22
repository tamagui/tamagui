import { animationsMotion } from '@tamagui/config/animations-motion'
import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

// The rule 5 config control: a driver whose outputStyle is not 'css' means every
// animated component in this graph needs a component animation runtime.
export const config = createTamagui({ ...defaultConfig, animations: animationsMotion })

export default config
