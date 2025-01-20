import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { type ReactNode, useContext, useMemo } from 'react'
import { Components, Data } from '@tamagui/bento'

import { ThemeContext } from '../../useKitchenSinkTheme'

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V4_6'

const bentoScreensPerElementRoutes = Object.entries(Components)
  .filter(([key]) => /\b[A-Z][a-z0-9]+(?:[A-Z][a-z0-9]+)*\b/.test(key))
  .map(([, sectionModules]) => Object.entries(sectionModules as any))
  .slice(0, -1)
  .reduce((acc, curr) => acc.concat(curr), [])
  .reduce((acc, [key, value]) => ({ ...acc, [key]: key }), {})

const bentoScreens = Data.listingData.sections.reduce((acc, { sectionName }) => {
  acc[sectionName] = `${sectionName}/:id`
  return acc
}, {})

const bentoElementScreens = Object.entries(Components['Inputs']).reduce(
  (acc, component) => {
    acc[component[0]] = `${component[0]}`
    return acc
  },
  {}
)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const storage = useAsyncStorage(PERSISTENCE_KEY)
  const themeContext = useContext(ThemeContext)

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

  const theme = themeContext.value === 'dark' ? DarkTheme : DefaultTheme

  return (
    <NavigationContainer
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
