import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Sandbox } from './Sandbox'
import { DemoScreen } from './features/demos/demo-screen'
import { HomeScreen } from './features/home/screen'
import { TestCasesScreen } from './features/testcases/screen'
import { TestScreen } from './features/testcases/test-screen'
import { ColorSchemeToggle } from './features/home/ColorSchemeListItem'

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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen
        name="sandbox"
        component={Sandbox}
        options={{
          title: 'Sandbox',
          headerRight() {
            return <ColorSchemeToggle />
          },
        }}
      />
      <Stack.Screen
        name="demo"
        component={DemoScreen}
        options={{
          title: 'Demo',
          headerRight() {
            return <ColorSchemeToggle />
          },
        }}
      />
      <Stack.Screen
        name="tests"
        component={TestCasesScreen}
        options={{
          title: 'Test Cases',
          headerRight() {
            return <ColorSchemeToggle />
          },
        }}
      />
      <Stack.Screen
        name="test"
        component={TestScreen}
        options={{
          title: 'Test Case',
          headerRight() {
            return <ColorSchemeToggle />
          },
        }}
      />
    </Stack.Navigator>
    </NavigationContainer>
  )
}
