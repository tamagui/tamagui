import { isWeb } from './platform'

const loadRNW = process.env.IS_STATIC !== 'is_static' && isWeb

const interopRequire = (src: any) => ('default' in src ? src.default : src)

export const rnw: any | null = loadRNW
  ? interopRequire(require('react-native-web').TamaguiExports)
  : null
