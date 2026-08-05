import {
  modulePath as tamaguiPackagePath,
  resolution as tamaguiPackageResolution,
} from '@tamagui/evaluation-fixture/value'
import { resolution as userAliasResolution } from '~/user-alias'
import config from './tamagui.config'
import { oneTsconfigPathsOrder } from '#evaluation-pipeline'

globalThis.__tamaguiFixtureOneTsconfigPathsOrder = oneTsconfigPathsOrder
globalThis.__tamaguiFixturePackageExportPath = tamaguiPackagePath
globalThis.__tamaguiFixturePackageExportResolution = tamaguiPackageResolution

export * from './tamagui.config'
export const tamaguiPackageExportLoaded =
  tamaguiPackageResolution === 'package-export-esm'
export { userAliasResolution }
export default config
