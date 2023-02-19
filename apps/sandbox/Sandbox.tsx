import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { ButtonDemo, CheckboxDemo, InputsDemo, SwitchDemo } from '@tamagui/demos'
import { useState } from 'react'
import { SolitoImage } from 'solito/image'
import { ScrollView, TamaguiProvider, XStack, YStack, styled } from 'tamagui'

import config from './tamagui.config'

// import './wdyr'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

/**

the ideal is:

- styled(a, b) - b accepts any subset of a.props
- returns type where props defined in b become nullable


 */
const Image = styled(
  SolitoImage,
  {
    alt: '',
    resizeMode: 'contain',
    src: '',
    style: {},
  },
  {
    inlineProps: new Set(['width', 'height']),
    acceptsClassName: true,
  }
)

const SolitoImageExample = () => (
  <Image
    alt=""
    style={{}}
    resizeMode="contain"
    width={200}
    height={200}
    src="/favicon.svg"
    bc="$color"
  />
)

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')

  const demos = (
    <>
      <SwitchDemo />
      <CheckboxDemo />
      <InputsDemo />
      <ButtonDemo />
    </>
  )

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <link href="/fonts/inter.css" rel="stylesheet" />

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

      <XStack bc="$backgroundStrong" fullscreen ai="center" jc="center">
        <ScrollView fullscreen horizontal>
          <ScrollView fullscreen>
            <SolitoImageExample />

            <YStack>
              <XStack gap={20} px="$4" flexWrap="wrap">
                {demos}
              </XStack>

              <XStack theme="alt1" gap={20} px="$4" flexWrap="wrap">
                {demos}
              </XStack>

              <XStack px="$4" theme="blue" gap={20} flexWrap="wrap">
                {demos}
              </XStack>

              <XStack px="$4" theme="blue_alt1" gap={20} flexWrap="wrap">
                {demos}
              </XStack>
            </YStack>
          </ScrollView>
        </ScrollView>
      </XStack>

      {/*  */}
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
    </TamaguiProvider>
  )
}

// function TestUseStyle() {
//   console.log('wtf', Square.staticConfig.validStyles)
//   const style = useStyle(Square, {
//     backgroundColor: 'red',
//   })

//   console.log('style', style, Square.staticConfig.validStyles)

//   return null
// }

// function TestUseMediaRenders() {
//   const media = useMedia()

//   console.warn('render')

//   return <H1>{media.sm ? 'sm' : 'not sm'}</H1>
// }

// function TestUseTheme() {
//   const u = useTheme()
//   console.log(u.color)
//   return null
// }
