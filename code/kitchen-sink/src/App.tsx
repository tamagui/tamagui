import '@tamagui/core/reset.css'

import * as Demos from '@tamagui/demos'
import React from 'react'
import { Input, Separator, Theme, XStack, YStack, SizableText } from 'tamagui'
import { Provider } from './provider'
import { Sandbox } from './Sandbox'
import * as TestCases from './usecases'
import type { TextInput } from 'react-native'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

export default function App() {
  const kitchenSink = new URLSearchParams(window.location.search).get('kitchen')
  const demoComponentName = new URLSearchParams(window.location.search).get('demo')
  const useCaseComponentName = new URLSearchParams(window.location.search).get('test')

  const Component = kitchenSink
    ? // solito breaking
      () => null //require('../kitchen-sink/src/features/home/screen').HomeScreen
    : demoComponentName
      ? Demos[
          demoComponentName.endsWith('Demo')
            ? demoComponentName
            : `${demoComponentName}Demo`
        ]
      : useCaseComponentName
        ? TestCases[useCaseComponentName]
        : Sandbox

  return (
    <SandboxFrame centered={!!demoComponentName}>
      <Component />
    </SandboxFrame>
  )
}

const SandboxFrame = (props: { children: any; centered?: boolean }) => {
  const params = new URLSearchParams(window.location.search)
  const [theme, setTheme] = React.useState(
    params.get('theme') === 'dark' ? 'dark' : 'light'
  )
  const [screenshot] = React.useState(params.has('screenshot'))
  const showThemeSwitch = !screenshot
  const splitView = params.has('splitView')
  const centered = props.centered ?? params.has('centered')

  return (
    <Provider defaultTheme={theme as any}>
      <link href="/fonts/inter.css" rel="stylesheet" />

      {screenshot && (
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: `
            html, body, #root { background-color: transparent !important; }
          `,
          }}
        />
      )}

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `
            html, body, #root { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; }
          `,
        }}
      />

      <Theme name={screenshot ? 'blue' : undefined}>
        <XStack w="100%" h="100%" fullscreen>
          {/* <YStack
            {...(centered && {
              ai: 'center',
              jc: 'center',
            })}
            f={1}
            h="100%"
          >
            {props.children}
          </YStack> */}

          <InputDemo />

          {splitView ? (
            <>
              <Separator vertical />
              <Theme name="dark">
                <YStack
                  f={1}
                  {...(centered && {
                    ai: 'center',
                    jc: 'center',
                    h: '100%',
                  })}
                  bg={screenshot ? 'transparent' : '$background'}
                >
                  {props.children}
                </YStack>
              </Theme>
            </>
          ) : null}
        </XStack>
      </Theme>
      {showThemeSwitch && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          style={{
            position: 'fixed',
            bottom: 30,
            left: 20,
            fontSize: 30,
          }}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          🌗
        </div>
      )}
    </Provider>
  )
}

const InputDemo = () => {
  const [value, setValue] = React.useState('')
  const [nativeValue, setNativeValue] = React.useState('')
  const inputRef = React.useRef<TextInput>(null)
  const nativeInputRef = React.useRef<HTMLInputElement>(null)
  const [focusDelay, setFocusDelay] = React.useState<number | null>(null)
  const [nativeFocusDelay, setNativeFocusDelay] = React.useState<number | null>(null)

  React.useEffect(() => {
    console.info('inputRef', inputRef.current)
    if (!inputRef.current) return

    const element = inputRef.current as unknown as HTMLInputElement

    console.info('element', element)

    const handleMouseDown = () => {
      performance.mark('input-mousedown-start')
    }

    const handleFocus = () => {
      performance.mark('input-focus-end')
      performance.measure('input-focus-time', 'input-mousedown-start', 'input-focus-end')

      const measurements = performance.getEntriesByName('input-focus-time')
      const latestMeasurement = measurements[measurements.length - 1]
      setFocusDelay(latestMeasurement.duration)

      performance.clearMarks('input-mousedown-start')
      performance.clearMarks('input-focus-end')
      performance.clearMeasures('input-focus-time')
    }

    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('focus', handleFocus)

    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Native input measurement
  React.useEffect(() => {
    if (!nativeInputRef.current) return

    const element = nativeInputRef.current

    const handleMouseDown = () => {
      performance.mark('native-mousedown-start')
    }

    const handleFocus = () => {
      performance.mark('native-focus-end')
      performance.measure(
        'native-focus-time',
        'native-mousedown-start',
        'native-focus-end'
      )

      const measurements = performance.getEntriesByName('native-focus-time')
      const latestMeasurement = measurements[measurements.length - 1]
      setNativeFocusDelay(latestMeasurement.duration)

      // クリーンアップ
      performance.clearMarks('native-mousedown-start')
      performance.clearMarks('native-focus-end')
      performance.clearMeasures('native-focus-time')
    }

    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('focus', handleFocus)

    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('focus', handleFocus)
    }
  }, [])

  return (
    <YStack space="$4">
      <YStack>
        <Input
          ref={inputRef}
          value={value}
          onChangeText={setValue}
          placeholder="Enter your name (Tamagui Input)"
        />
        {focusDelay && (
          <SizableText theme="alt2" size="$2">
            Tamagui Input focus delay: {focusDelay.toFixed(2)}ms
          </SizableText>
        )}
      </YStack>

      <YStack>
        <input
          ref={nativeInputRef}
          type="text"
          value={nativeValue}
          onChange={(e) => setNativeValue(e.target.value)}
          placeholder="Native input for comparison"
          style={{ padding: 8, fontSize: 16 }}
        />
        {nativeFocusDelay && (
          <SizableText theme="alt2" size="$2">
            Native Input focus delay: {nativeFocusDelay.toFixed(2)}ms
          </SizableText>
        )}
      </YStack>
    </YStack>
  )
}
