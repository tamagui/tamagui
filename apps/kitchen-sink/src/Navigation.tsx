import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { DemoScreen } from './features/demos/demo-screen'
import { HomeScreen } from './features/home/screen'
import { TestCasesScreen } from './features/testcases/screen'
import { TestScreen } from './features/testcases/test-screen'
import { Sandbox } from './Sandbox'

const Stack = createNativeStackNavigator<{
  home: undefined
  demo: {
    id: string
  }
  tests: undefined
  test: {
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
      <Stack.Screen
        name="tests"
        component={TestCasesScreen}
        options={{
          title: 'Test Cases',
        }}
      />
      <Stack.Screen
        name="test"
        component={TestScreen}
        options={{
          title: 'Test Case',
        }}
      />
    </Stack.Navigator>
  )
}
