import { tamaguiPlugin } from '@tamagui/vite-plugin'
import inspectPlugin from 'vite-plugin-inspect'
import { start } from 'vite-react-native2'

export const dev = async () => {
  const tamaguiVitePlugin = tamaguiPlugin({
    components: ['@tamagui/core'],
    config: 'src/tamagui.config.ts',
  })

  await start({
    root: process.cwd(),
    host: '127.0.0.1',
    webConfig: {
      plugins: [tamaguiVitePlugin, inspectPlugin()],
    },
    buildConfig: {
      plugins: [],
    },
  })
}
