import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Sandbox } from './Sandbox'
import { DemoScreen } from './features/demos/demo-screen'
import { ColorSchemeToggle } from './features/home/ColorSchemeListItem'
import { HomeScreen } from './features/home/screen'
import { TestCasesScreen } from './features/testcases/screen'
import { TestScreen } from './features/testcases/test-screen'

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

const linking = {
  prefixes: [],
  config: {
    screens: {
      home: '',
      demo: 'demo/:id',
      tests: 'tests',
      test: 'test/:id',
      sandbox: 'sandbox',
    },
  },
}

export function Navigation() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options={{
            title: 'Home',
            headerRight() {
              return <ColorSchemeToggle />
            },
          }}
        />
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
