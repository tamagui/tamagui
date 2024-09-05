import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { getConfig } from './getConfig'

Error.stackTraceLimit = Infinity

export default getConfig(tamaguiPlugin)
