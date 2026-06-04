import * as Linking from 'expo-linking'
import { useURL } from 'expo-linking'
import { useRef } from 'react'
import { PixelRatio, View as RNView, Text as RNText } from 'react-native'
import { TamaguiProvider, View, Text } from 'tamagui'
import config from './tamagui.config'
import { cases } from '../cases'

// dedicated conformance host: deep-link exp://HOST/--/?case=<name> renders that case (remounts
// on each new link, no relaunch). the #cfm-root box self-measures (measureInWindow) and POSTs its
// exact on-screen rect to the harness, which crops the screenshot to it — so native crops match
// the web #cfm-root crop precisely (no luma guessing).
const HARNESS_RECT_URL = 'http://localhost:8090/rect'

// leaf Box: a tamagui View that, for the case root (id="cfm-root"), reports its window rect.
function Box(props: any) {
  const ref = useRef<any>(null)
  if (props.id === 'cfm-root') {
    return (
      <View
        ref={ref}
        {...props}
        onLayout={() => {
          ref.current?.measureInWindow?.((x: number, y: number, w: number, h: number) => {
            if (w > 0 && h > 0) {
              fetch(HARNESS_RECT_URL, {
                method: 'POST',
                body: JSON.stringify({ x, y, width: w, height: h, scale: PixelRatio.get() }),
              }).catch(() => {})
            }
          })
        }}
      />
    )
  }
  return <View {...props} />
}

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
      <RNView style={{ flex: 1, backgroundColor: '#ffffff', paddingTop: 220, alignItems: 'flex-start' }}>
        {found ? (
          // key by url so every deep-link (with a unique counter param) remounts the case →
          // onLayout fires → #cfm-root re-measures + re-POSTs, even when re-linking the same case
          <RNView key={url ?? ''} style={{ alignItems: 'flex-start' }}>
            {found.render({ Box, Text })}
          </RNView>
        ) : (
          <RNText style={{ padding: 20 }}>
            {caseName ? `unknown case: ${caseName}` : 'waiting for ?case='}
          </RNText>
        )}
      </RNView>
    </TamaguiProvider>
  )
}
