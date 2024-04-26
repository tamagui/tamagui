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
import { ScrollView, View } from 'tamagui'
import { KeyboardAvoidingView, LogBox } from 'react-native'
import { Key } from '@tamagui/lucide-icons/types'

LogBox.ignoreLogs(['Warning'])
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

const BentoScreenContainer: React.FC<{ children: React.ReactNode; name: string }> = ({
  children,
  name,
}) => {
  //NOTE: Components using Flatlist can't have a ScrollView wrapper. This breaks scrolling on Android.
  if (['FlatGrid', 'ChatList'].includes(name)) {
    return (
      <View flex={1} minWidth="100%" p="$2" bg="$background">
        {children}
      </View>
    )
  }
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
      <ScrollView minWidth="100%" p="$2" bg="$red10" keyboardShouldPersistTaps="always">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const filterCamelCaseOnly = ([key, _]: [string, unknown]) =>
  /\b[A-Z][a-z0-9]+(?:[A-Z][a-z0-9]+)*\b/.test(key)
const sectionModuleToTuple = ([, sectionModules]) => Object.entries(sectionModules as any)
const flatArray = (acc, curr) => acc.concat(curr)
const filterOutComponents = ([key]: [string]) =>
  ![
    'default',
    'SizableText',
    'Example',
    'VerticalCheckboxes',
    'LocationNotification',
  ].includes(key)

const bentoScreenSections = bentoScreenNames.map((screenName) => {
  return (
    <Stack.Screen
      name={screenName}
      component={BentoPartScreenItem}
      options={{
        title: screenName,
      }}
    />
  )
})
const bentoScreensPerElement = Object.entries(sections)
  .filter(filterCamelCaseOnly)
  .map(sectionModuleToTuple)
  .reduce(flatArray, [])
  .filter(filterOutComponents)
  .map(([name, _Component]: [string, any]) => {
    const Component = _Component as React.ComponentType<any>
    return (
      <Stack.Screen
        name={name}
        options={{
          headerShown: false,
        }}
      >
        {() => (
          <KeyboardAvoidingView behavior="padding" flex={1}>
            <View
              backgroundColor={'$color1'}
              flex={1}
              justifyContent="center"
              alignItems="center"
              paddingHorizontal="$2"
            >
              <Component />
            </View>
          </KeyboardAvoidingView>
        )}
      </Stack.Screen>
    )
  })
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
      {bentoScreensPerElement}
      {bentoScreenSections}
    </Stack.Navigator>
  )
}
