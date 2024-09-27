import pkg from '@tamagui/vite-plugin-cjs'
const { tamaguiPlugin } = pkg
import { getConfig } from './getConfig'

export default getConfig(tamaguiPlugin)
