import * as Linking from 'expo-linking'
import { useURL } from 'expo-linking'
import { View as RNView, Text as RNText } from 'react-native'
import { TamaguiProvider, View, Text } from 'tamagui'
import config from './tamagui.config'
import { cases } from '../cases'

// dedicated conformance host: deep-link exp://HOST/--/?case=<name> renders that case (remounts
// on each new link, no relaunch). renders the case content with tamagui View/Text in tailwind
// mode on a plain white stage; the harness screenshots and luma-crops to the colored content.
export function App() {
  const url = useURL()
  let caseName: string | null = null
  if (url) {
    try {
      caseName = (Linking.parse(url).queryParams?.case as string) ?? null
    } catch {}
  }
  const found = caseName ? cases.find((c) => c.name === caseName) : null
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <RNView
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          paddingTop: 80,
          alignItems: 'flex-start',
        }}
      >
        {found ? (
          found.render({ Box: View, Text })
        ) : (
          <RNText style={{ padding: 20 }}>
            {caseName ? `unknown case: ${caseName}` : 'waiting for ?case='}
          </RNText>
        )}
      </RNView>
    </TamaguiProvider>
  )
}
