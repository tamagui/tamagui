import { View } from 'react-native'

export function App() {
  globalThis['startViteHMR']()
  console.log('🍄🍄🍄')

  x = new WebSocket('ws://127.0.0.1:5173/', 'vite-hmr')
  x.onmessage = (y) => console.log(`gotem`)

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
22
22
22
22
22
22
22
2
22
