import { View } from 'react-native'

// @ts-ignore
module.url = '/src/App.tsx'
// @ts-ignore
module.hot = createHotContext(module.url)

console.log('🌶️')

export function App() {
  globalThis['startViteHMR']()
  console.log('wtf' + !!globalThis['_ReactRefreshRuntime'])
  console.log('🍄🍄🍄', globalThis['lastHmrExports'])

  setTimeout(() => {
    console.log('✔️')
  })

  return (
    <>
      <View style={{ backgroundColor: 'red', width: 100, height: 100 }} />
    </>
  )
}

if (!exports.App) {
  exports = { App }
}
