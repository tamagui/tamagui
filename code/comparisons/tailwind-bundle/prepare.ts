import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = import.meta.dirname
const write = (path: string, contents: string) => {
  mkdirSync(join(root, path, '..'), { recursive: true })
  writeFileSync(join(root, path), contents)
}

// generate identical app bodies so changing the fixture changes all three arms.
for (const name of ['tamagui', 'nativewind', 'uniwind']) {
  const components =
    name === 'tamagui'
      ? '@tamagui/core'
      : name === 'nativewind'
        ? 'react-native-css/components'
        : 'react-native'
  write(
    `${name}/src/App.tsx`,
    `import { useState } from 'react'
${name === 'nativewind' ? "import { View } from 'react-native-css/components/View'\nimport { Text } from 'react-native-css/components/Text'" : name === 'uniwind' ? "import { View } from 'uniwind/components/View'\nimport { Text } from 'uniwind/components/Text'" : `import { View, Text } from '${components}'`}

export default function App() {
  const [count, setCount] = useState(0)
  return <View className="flex flex-col gap-4 rounded-lg bg-white p-4">
    <Text className="text-xl font-bold text-black">Small app</Text>
    <Text className="text-base text-black">Count: {count}</Text>
    <button onClick={() => setCount(count + 1)}>Increment</button>
  </View>
}
`
  )
  write(
    `${name}/index.html`,
    '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Small app</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>'
  )
  write(
    `${name}/package.json`,
    JSON.stringify({ private: true, type: 'module' }, null, 2)
  )
  write(
    `${name}/src/main.tsx`,
    `import './global.css'
${name === 'tamagui' ? "import './tamagui.css'" : ''}
import { createRoot } from 'react-dom/client'
import App from './App'
${name === 'tamagui' ? "import { TamaguiProvider } from '@tamagui/core'\nimport config from './tamagui.config'" : ''}
createRoot(document.getElementById('root')!).render(${name === 'tamagui' ? '<TamaguiProvider config={config} defaultTheme="light"><App /></TamaguiProvider>' : '<App />'})
`
  )
}

write(
  'tamagui/src/tamagui.config.ts',
  `import { createTamagui } from '@tamagui/core'
export default createTamagui({
  themes: process.env.TAMAGUI_ENVIRONMENT === 'client' ? {} : {
    light: { background: '#ffffff', color: '#000000' },
    dark: { background: '#111111', color: '#eeeeee' },
  },
  tokens: { color: {}, radius: {}, size: {}, space: {}, zIndex: {} },
  media: {}, shorthands: {},
})
`
)
write('tamagui/src/global.css', "@import 'tailwindcss';\n@source './App.tsx';\n")
write(
  'tamagui/vite.config.ts',
  `import { tamaguiPlugin } from '@tamagui/tailwind/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { build } from '../build-config'
export default defineConfig({
  plugins: [tailwindcss(), tamaguiPlugin({ config: 'src/tamagui.config.ts', optimize: true,
    disableExtraction: false, outputCSS: 'src/tamagui.css' })],
  build,
})
`
)
write(
  'nativewind/src/global.css',
  `@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css';
@import 'nativewind/theme';
@source './App.tsx';
`
)
write(
  'nativewind/vite.config.ts',
  `import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { build } from '../build-config'
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: { alias: { 'react-native': 'react-native-web' } },
  define: { __DEV__: false, 'process.env.NODE_ENV': '"production"' },
  build,
})
`
)
write(
  'uniwind/src/global.css',
  `@import 'tailwindcss';
@import 'uniwind';
@source './App.tsx';
`
)
write(
  'uniwind/vite.config.ts',
  `import tailwindcss from '@tailwindcss/vite'
import { uniwind } from 'uniwind/vite'
import { rnw } from 'vite-plugin-rnw'
import { defineConfig } from 'vite'
import { build } from '../build-config'
export default defineConfig({
  plugins: [rnw(), tailwindcss(), uniwind({ cssEntryFile: './src/global.css' })],
  build,
})
`
)
