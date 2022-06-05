import { NavigationContainer } from '@react-navigation/native'
// causes metro bundle issue it seems:
// import * as Linking from 'expo-linking'
import { useMemo } from 'react'

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  return (
    <NavigationContainer
      linking={useMemo(
        () => ({
          // Linking.createURL('/')
          prefixes: [],
          config: {
            initialRouteName: 'home',
            screens: {
              home: '',
              demo: 'demo/:id',
            },
          },
        }),
        []
      )}
    >
      {children}
    </NavigationContainer>
  )
}
