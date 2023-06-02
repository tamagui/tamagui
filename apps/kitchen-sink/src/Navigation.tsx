import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomeScreen } from './features/home/screen'
import { DemoScreen } from './features/user/demo-screen'
import { Sandbox } from './Sandbox'

const Stack = createNativeStackNavigator<{
  home: undefined
  demo: {
    id: string
  }
  sandbox: undefined
}>()

export function Navigation() {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="sandbox"
        component={Sandbox}
        options={{
          title: 'Sandbox',
        }}
      />
      <Stack.Screen
        name="demo"
        component={DemoScreen}
        options={{
          title: 'Demo',
        }}
      />
    </Stack.Navigator>
  )
}
