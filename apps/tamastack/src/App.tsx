import { View } from 'react-native'

module.url = '/src/App.tsx'
module.hot = createHotContext(module.url)

export function App() {
  globalThis['startViteHMR']()
  console.log('🍄🍄🍄')

  return (
    <>
      <View style={{ backgroundColor: 'red', width: 100, height: 100 }} />
    </>
  )
}
2
2
22
22
222
22
2
22
22
22
22
2
22
22
222222
22
