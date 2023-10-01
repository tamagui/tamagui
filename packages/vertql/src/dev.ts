import { CLIResolvedOptions } from '@tamagui/types'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { InlineConfig } from 'vite'
import inspectPlugin from 'vite-plugin-inspect'
import { start } from 'vite-react-native2'

export const dev = async (options: CLIResolvedOptions) => {
  const tamaguiVitePlugin = tamaguiPlugin({
    ...options.tamaguiOptions,
  })

  const plugins = [tamaguiVitePlugin, inspectPlugin()] satisfies InlineConfig['plugins']

  await start({
    webConfig: {
      plugins,
    },
    serverConfig: {
      plugins,
    },
  })
}
