import { createTamagui } from "tamagui"
import { config } from "@tamagui/config/v2-native"

const tamaguiConfig = createTamagui(config)

// this makes typescript properly type everything based on the config
type Conf = typeof tamaguiConfig

declare module "tamagui" {
	interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
// depending on if you chose tamagui, @tamagui/core, or @tamagui/web

// be sure the import and declare module lines both use that same name
