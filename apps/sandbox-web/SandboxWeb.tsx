import '@tamagui/web/reset.css'
import '@tamagui/polyfill-dev'

import { addFont } from '@tamagui/font'
import { createSilkscreenFont } from '@tamagui/font-silkscreen'
import { Stack, TamaguiProvider, createFont } from '@tamagui/web'
import { useState } from 'react'
import { Button, SizableText, Text } from 'tamagui'

import config from './tamagui.config'

//

const mySilk = createSilkscreenFont()

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')
  const [fontFamily, setFontFamily] = useState('$body')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <button
        style={{
          position: 'absolute',
          bottom: 30,
          left: 20,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        🌗
      </button>

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

      <Stack ai="center" jc="center" f={1} bc="red">
        <SizableText fontFamily={fontFamily} size={'$15'}>
          Good job
        </SizableText>
      </Stack>
      <Button
        onPress={() => {
          addFont({
            fontFamilyName: 'mySilk',
            fontFamily: mySilk,
            insertCSS: true,
            update: true,
          })
          setFontFamily('$mySilk')
        }}
      >
        Change font family
      </Button>

      {/*  */}
    </TamaguiProvider>
  )
}
