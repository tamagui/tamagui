import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Data, Components } from '@tamagui/bento'
import type { FC } from 'react'
import { ScrollView, View } from 'tamagui'
import { Sandbox } from './Sandbox'
import { BentoPartScreenItem } from './features/bento/part-screen-items'
import { BentoScreen } from './features/bento/screen'
import { DemoScreen } from './features/demos/demo-screen'
import { HomeScreen } from './features/home/screen'
import { TestCasesScreen } from './features/testcases/screen'
import { TestScreen } from './features/testcases/test-screen'
import { ColorSchemeToggle } from './features/home/ColorSchemeListItem'

const bentoScreenNames = Data.listingData.sections.map(({ sectionName }) => sectionName)

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

const BentoScreenContainer: FC<{ children: React.ReactNode; name: string }> = ({
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
    <ScrollView
      flex={1}
      minWidth="100%"
      p="$2"
      bg="$background"
      keyboardShouldPersistTaps="always"
    >
      {children}
    </ScrollView>
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
      key={screenName}
      name={screenName}
      component={BentoPartScreenItem}
      options={{
        title: screenName,
      }}
    />
  )
})

const bentoScreensPerElement = Object.entries(Components)
  .filter(filterCamelCaseOnly)
  .map(sectionModuleToTuple)
  .reduce(flatArray, [])
  .filter(filterOutComponents)
  .map(([name, _Component]: [string, any]) => {
    const Component = _Component as React.ComponentType<any>
    return (
      <Stack.Screen
        key={name}
        name={name}
        options={{
          title: name,
        }}
      >
        {() => (
          <BentoScreenContainer name={name}>
            <Component />
          </BentoScreenContainer>
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
          headerRight() {
            return <ColorSchemeToggle />
          },
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
