import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { getConfig } from './getConfig'

Error.stackTraceLimit = Number.Infinity

export default getConfig(tamaguiPlugin)
