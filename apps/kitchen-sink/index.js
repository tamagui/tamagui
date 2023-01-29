import { registerRootComponent } from 'expo'
import { Text, View } from 'react-native'

// import App from './src/App'

registerRootComponent(Root)

function Root() {
  return (
    <View style={{ backgroundColor: 'red', width: 500, height: 500, margin: 30 }}>
      <Text>{View.render.toString()}</Text>
    </View>
  )
}
