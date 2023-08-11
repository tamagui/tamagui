import { AppRegistry, View } from 'react-native'

AppRegistry.registerComponent('main', () => Root)

function Root() {
  return (
    <>
      <View style={{ backgroundColor: 'red', width: 100, height: 100 }} />
    </>
  )
}
