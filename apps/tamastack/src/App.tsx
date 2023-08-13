import { View } from 'react-native'

export function App() {
  globalThis['startViteHMR']()
  console.log('🍄🍄🍄')

  return (
    <>
      <View style={{ backgroundColor: 'red', width: 100, height: 100 }} />
    </>
  )
}
