import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomeScreen } from './features/home/screen'
import { DemoScreen } from './features/user/demo-screen'

const Stack = createNativeStackNavigator<{
  home: undefined
  demo: {
    id: string
  }
}>()

export function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
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
