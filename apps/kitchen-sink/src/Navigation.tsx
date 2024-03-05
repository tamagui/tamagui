import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as sections from '@tamagui/bento'
import { Sandbox } from './Sandbox'
import { BentoPartScreen } from './features/bento/part-screen'
import { BentoScreen } from './features/bento/screen'
import { DemoScreen } from './features/demos/demo-screen'
import { HomeScreen } from './features/home/screen'
import { TestCasesScreen } from './features/testcases/screen'
import { TestScreen } from './features/testcases/test-screen'

const bentoScreenNames = sections.listingData.sections.map(
  ({ sectionName }) => sectionName
)

type BentoScreens = {
  [K in (typeof bentoScreenNames)[number]]: {
    id: string
  }
}

const Stack = createNativeStackNavigator<
  {
    bento: undefined
    home: undefined
    demo: {
      id: string
    }
    tests: undefined
    test: {
      id: string
    }
    sandbox: undefined
  } & BentoScreens
>()

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
      <Stack.Screen
        name="bento"
        component={BentoScreen}
        options={{
          title: 'Bento',
        }}
      />
      {bentoScreenNames.map((screenName) => {
        return (
          <Stack.Screen
            name={screenName}
            component={BentoPartScreen}
            options={{
              title: screenName,
            }}
          />
        )
      })}
    </Stack.Navigator>
  )
}
