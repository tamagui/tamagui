import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import * as Demos from '@tamagui/demos'
import { SelectDemo, SliderDemo, TooltipDemo } from '@tamagui/demos'
import { ToastProvider } from '@tamagui/toast'
import { Suspense, forwardRef, lazy, useState } from 'react'
import {
  Button,
  Separator,
  Square,
  TamaguiProvider,
  Theme,
  XStack,
  YStack,
  getStylesAtomic,
  styled,
} from 'tamagui'

import config from './tamagui.config'

// useful for debugging why things render:
// import './wdyr'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

export const Sandbox = () => {
  const componentName = new URLSearchParams(window.location.search).get('test')
  const demoName = new URLSearchParams(window.location.search).get('demo')
  const Component = componentName
    ? // vite wants a .js ending here, but webpack doesn't :/
      lazy(() => import(`./usecases/${componentName}`))
    : demoName
    ? Demos[`${demoName}Demo`]
    : SandboxInner

  return (
    <SandboxFrame>
      <Suspense fallback="Loading...">
        <Component />
      </Suspense>
    </SandboxFrame>
  )
}

const StyledButton = styled(Button, {
  height: '$5',
  borderRadius: '$1',
  paddingHorizontal: '$2',
  variants: {
    circular: {
      true: {
        padding: '$0',
        paddingLeft: 1,
        height: '$5',
        width: '$5',
        maxHeight: '$5',
        maxWidth: '$5',
        borderRadius: '$10',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    red: {
      true: {
        borderWidth: 1,
        theme: 'red',
      },
    },
    blue: {
      true: {
        borderWidth: 1,
        theme: 'blue',
      },
    },
    wrapper: {
      true: {
        padding: 0,
        margin: 0,
        height: 'unset',
        width: 'unset',
        borderRadius: 'unset',
        alignItems: undefined,
        justifyContent: undefined,
      },
    },
  },
})

export const CustomButton = forwardRef(
  ({ children, theme, ...props }: ButtonProps, ref: Ref<TamaguiElement>) => {
    const buttonTheme = theme || 'yellow'

    return (
      <StyledButton
        ref={ref}
        theme={buttonTheme}
        textProps={{
          fontSize: '$2',
          textTransform: 'uppercase',
          marginTop: 0,
          marginBottom: 0,
        }}
        {...props}
      >
        {children}
      </StyledButton>
    )
  }
)

const SandboxInner = () => {
  return (
    <>
      <CustomButton theme="blue">Should be blue (styled)</CustomButton>
      <Button theme="blue">Should be blue (og)</Button>
    </>
  )
  return <TooltipDemo />
  // return <TestPerf />
  // return <Square animation="bouncy" size={100} bc="red" />
}

function TestPerf() {
  return <Button onPress={runTestPerf}>run</Button>
}

function runTestPerf() {
  const start0 = performance.now()

  function baseline() {
    return new Array().fill(1000).map(() => {
      return [...new Set([`${Math.random() * Math.random() * Math.random()}`])]
    })
  }

  for (let i = 0; i < 10000; i++) {
    baseline()
  }

  const end0 = performance.now() - start0
  console.log('end0', end0)

  const start = performance.now()

  function run() {
    getStylesAtomic({
      backgroundColor: 'red',
      width: 100,
      height: 200,
      scale: 2,

      $gtLg: {
        backgroundColor: 'green',
      },

      hoverStyle: {
        margin: 20,
        padding: 20,
      },
    })
  }

  for (let i = 0; i < 10000; i++) {
    run()
  }

  console.log('took', performance.now() - start)
}

const SandboxFrame = (props: { children: any }) => {
  const [theme, setTheme] = useState('light')
  const splitView = new URLSearchParams(window.location.search).get('splitView')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <ToastProvider swipeDirection="horizontal">
        <link href="/fonts/inter.css" rel="stylesheet" />

        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: `
            html, body, #root { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; }
          `,
          }}
        />

        <XStack fullscreen>
          <YStack ai="center" jc="center" f={1} h="100%" bg="$background">
            {props.children}
          </YStack>

          {splitView ? (
            <>
              <Separator vertical />
              <Theme name="dark">
                <YStack ai="center" jc="center" f={1} h="100%" bg="$background">
                  {props.children}
                </YStack>
              </Theme>
            </>
          ) : null}
        </XStack>

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
      </ToastProvider>
    </TamaguiProvider>
  )
}
