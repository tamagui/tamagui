import { NavigationContainer } from '@react-navigation/native'
// causes metro bundle issue it seems:
// import * as Linking from 'expo-linking'
import React, { useMemo } from 'react'
import { AsyncStorage, Linking, Platform } from 'react-native'

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V4'

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = React.useState(false)
  const [initialState, setInitialState] = React.useState()

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL()

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
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

  const linking = useMemo(
    () => ({
      // Linking.createURL('/')
      prefixes: [],
      config: {
        initialRouteName: 'home',
        screens: {
          home: '',
          demo: 'demo/:id',
        },
      } as const,
    }),
    [],
  )

  if (!isReady) {
    return null
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))}
      linking={linking}
    >
      {children}
    </NavigationContainer>
  )
}
