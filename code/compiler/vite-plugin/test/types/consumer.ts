import { tamaguiPlugin } from '@tamagui/vite-plugin'
import type { PluginOption } from 'vite'

const plugin: PluginOption = tamaguiPlugin({
  components: ['@fixture/components/static'],
  disableExtraction: true,
})

void plugin
