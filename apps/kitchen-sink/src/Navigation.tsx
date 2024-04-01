import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as sections from '@tamagui/bento'
import { Sandbox } from './Sandbox'
import { BentoPartScreen } from './features/bento/part-screen'
import { BentoScreen } from './features/bento/screen'
import { DemoScreen } from './features/demos/demo-screen'
import { HomeScreen } from './features/home/screen'
import { TestCasesScreen } from './features/testcases/screen'
import { TestScreen } from './features/testcases/test-screen'
import { SectionScreen } from './features/bento/section-screen'
import { BentoPartScreenItem } from './features/bento/part-screen-items'
import React from 'react'
import { View } from 'tamagui'

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

const BentoScreenContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View flex={1} minWidth="100%" pt="$2">
      {children}
    </View>
  )
}
export function Navigation() {
  const bentoScreensPerElement = Object.entries(sections)
    .filter(([key]) => /\b[A-Z][a-z0-9]+(?:[A-Z][a-z0-9]+)*\b/.test(key))
    .map(([, sectionModules]) => Object.entries(sectionModules as any))
    .reduce((acc, curr) => acc.concat(curr), [])
    .filter(([key]) => !['default', 'SizableText', 'Example'].includes(key))
    .map(([name, _Component]: [string, any]) => {
      const Component = _Component as React.ComponentType<any>
      return (
        <Stack.Screen
          name={name}
          options={{
            title: name,
          }}
        >
          {() => (
            <BentoScreenContainer>
              <Component />
            </BentoScreenContainer>
          )}
        </Stack.Screen>
      )
    })

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
      {bentoScreensPerElement}
      {bentoScreenNames.map((screenName) => {
        return (
          <Stack.Screen
            name={screenName}
            component={BentoPartScreenItem}
            options={{
              title: screenName,
            }}
          />
        )
      })}
    </Stack.Navigator>
  )
}
