import { AppRegistry, LogBox, View } from 'react-native'

AppRegistry.registerComponent('main', () => Root)

LogBox.install()

console.log('loading hmr client')

function Root() {
  console.log('🍄🍄🍄')
  
  return (
    <>
      <View style={{ backgroundColor: 'red', width: 100, height: 100 }} />
    </>
  )
}
