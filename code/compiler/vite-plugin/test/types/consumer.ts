import { tamaguiPlugin } from '@tamagui/vite-plugin'
import type { PluginOption } from 'vite'
import { createTamagui, type CreateTamaguiProps } from '@tamagui/core'
import type { OpaqueColorValue } from '@tamagui/react-native-types/legacy'
import type { NativeColorValue } from '@tamagui/react-native-types'

declare const nativeColor: OpaqueColorValue
declare const modernNativeColor: NativeColorValue
const themes = {
  light: { color: nativeColor, background: 'white', modern: modernNativeColor },
  dark: { color: nativeColor, background: 'black' },
} satisfies NonNullable<CreateTamaguiProps['themes']>
const nativeConfig = createTamagui({ themes })
const inferredColor: OpaqueColorValue = nativeConfig.themes.light.color.val
const inferredModernColor: NativeColorValue = nativeConfig.themes.light.modern.val
// @ts-expect-error unrelated objects are not native colors
const invalidThemes: CreateTamaguiProps = { themes: { light: { color: {} } } }

void inferredColor
void inferredModernColor
void invalidThemes

const plugin: PluginOption = tamaguiPlugin({
  components: ['@fixture/components/static'],
  disableExtraction: true,
})

void plugin
