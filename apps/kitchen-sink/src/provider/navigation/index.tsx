import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
// causes metro bundle issue it seems:
// import * as Linking from 'expo-linking'
import * as sections from '@tamagui/bento'
import React, { useContext, useMemo } from 'react'
import { Linking, Platform } from 'react-native'
import { ThemeContext } from '../../useKitchenSinkTheme'

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V4_5'

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = React.useState(false)
  const [initialState, setInitialState] = React.useState()
  const storage = useAsyncStorage(PERSISTENCE_KEY)
  const themeContext = useContext(ThemeContext)

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL()

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await storage.getItem()
          const state = savedStateString ? JSON.parse(savedStateString) : undefined

          if (state !== undefined) {
            setInitialState(state)
          }
        }
      } finally {
        setIsReady(true)
      }
    }

    if (!isReady) {
      restoreState()
    }
  }, [isReady])

  const bentoScreens = sections.listingData.sections.reduce((acc, { sectionName }) => {
    acc[sectionName] = `${sectionName}/:id`
    return acc
  }, {})

  const bentoElementScreens = Object.entries(sections['Inputs']).reduce(
    (acc, component) => {
      acc[component[0]] = `${component[0]}`
      return acc
    },
    {}
  )

  let bentoScreensPerElementRoutes = Object.entries(sections)
    .filter(([key]) => /\b[A-Z][a-z0-9]+(?:[A-Z][a-z0-9]+)*\b/.test(key))
    .map(([, sectionModules]) => sectionModules)
    .map(Object.entries)
    .slice(0, -1)
    .reduce((acc, curr) => acc.concat(curr), [])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: key }), {})

  const linking = useMemo(
    () => ({
      // Linking.createURL('/')
      prefixes: [],
      config: {
        initialRouteName: 'home',
        screens: {
          home: '',
          demo: 'demo/:id',
          tests: 'tests',
          test: 'test/:id',
          sandbox: 'sandbox',
          bento: 'bento',
          ...bentoScreens,
          ...bentoElementScreens,
          ...bentoScreensPerElementRoutes,
        },
      } as const,
    }),
    []
  )

  if (!isReady) {
    return null
  }

  const theme = themeContext.value === 'dark' ? DarkTheme : DefaultTheme

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => {
        storage.setItem(JSON.stringify(state))
      }}
      linking={linking}
      theme={theme}
    >
      {children}
    </NavigationContainer>
  )
}
