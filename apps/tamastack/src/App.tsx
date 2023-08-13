import { View } from 'react-native'

module.url = '/src/App.tsx'
module.hot = createHotContext(module.url)

export function App() {
  globalThis['startViteHMR']()
  console.log('🍄🍄🍄', globalThis['lastHmrExports'])

  return (
    <>
      <View style={{ backgroundColor: 'red', width: 100, height: 100 }} />
    </>
  )
}

if (!exports.App) {
  exports = { App }
}
2
