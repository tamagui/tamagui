import { View } from 'react-native'

// @ts-ignore
module.url = '/src/App.tsx'
// @ts-ignore
module.hot = createHotContext(module.url)

export function App() {
  globalThis['startViteHMR']()
  console.log('🍄🍄🍄')

  return (
    <>
      <View style={{ backgroundColor: 'yellow', width: 100, height: 100 }} />
    </>
  )
}
