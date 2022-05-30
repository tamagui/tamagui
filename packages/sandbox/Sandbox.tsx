// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { X } from '@tamagui/feather-icons'
import { KitchenSink } from '@tamagui/kitchen-sink'
import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Fieldset,
  Input,
  Label,
  Unspaced,
  YStack,
} from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const scheme = useColorScheme()
  const [theme, setTheme] = useState(scheme as any)
  return (
    <Tamagui.Provider injectCSS defaultTheme={theme}>
      <Button
        pos="absolute"
        b={10}
        l={10}
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch
      </Button>

      <div
        style={{
          width: '100vw',
          height: '100vh',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--backgroundStrong)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <YStack space ai="center">
          <DialogDemo />
          {/* <KitchenSink /> */}
        </YStack>
      </div>
    </Tamagui.Provider>
  )
}

function DialogDemo() {
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay key="overlay" o={0.5} />
        {/*  animation="bouncy" */}
        <DialogContent bordered elevate key="content" space>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <Fieldset horizontal>
            <Label w={160} justifyContent="flex-end" htmlFor="name">
              Name
            </Label>
            <Input f={1} id="name" defaultValue="Pedro Duarte" />
          </Fieldset>
          <Fieldset horizontal>
            <Label w={160} justifyContent="flex-end" htmlFor="username">
              Username
            </Label>
            <Input f={1} id="username" defaultValue="@peduarte" />
          </Fieldset>

          <YStack ai="flex-end" mt="$2">
            <DialogClose asChild>
              <Button theme="green" aria-label="Close">
                Save changes
              </Button>
            </DialogClose>
          </YStack>

          <Unspaced>
            <DialogClose asChild>
              <Button pos="absolute" t="$4" r="$4" circular icon={X} />
            </DialogClose>
          </Unspaced>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

const Logog = (
  <svg width={373} height={41} viewBox="0 0 373 41">
    <polygon
      shapeRendering="crispEdges"
      fill="orange"
      points="24.3870968 40.1612903 24.3870968 8.67741935 32.2580645 8.67741935 32.2580645 0.806451613 0.774193548 0.806451613 0.774193548 8.67741935 8.64516129 8.67741935 8.64516129 40.1612903"
    />
    <path
      shapeRendering="crispEdges"
      fill="orange"
      d="M87.3548387,0.806451613 L87.3548387,8.67741935 L95.2258065,8.67741935 L95.2258065,40.1612903 L79.483871,40.1612903 L79.483871,24.4193548 L71.6129032,24.4193548 L71.6129032,40.1612903 L55.8709677,40.1612903 L55.8709677,8.67741935 L63.7419355,8.67741935 L63.7419355,0.806451613 L87.3548387,0.806451613 Z M79.483871,8.67741935 L71.6129032,8.67741935 L71.6129032,16.5483871 L79.483871,16.5483871 L79.483871,8.67741935 Z"
      fillRule="nonzero"
    />
    <polygon
      shapeRendering="crispEdges"
      fill="orange"
      points="130.645161 40.1612903 130.645161 22.4516129 138.516129 22.4516129 138.516129 40.1612903 154.258065 40.1612903 154.258065 0.806451613 142.451613 0.806451613 142.451613 8.67741935 126.709677 8.67741935 126.709677 0.806451613 114.903226 0.806451613 114.903226 40.1612903"
    />
    <path
      fill="orange"
      d="M205.419355,0.806451613 L205.419355,8.67741935 L213.290323,8.67741935 L213.290323,40.1612903 L197.548387,40.1612903 L197.548387,24.4193548 L189.677419,24.4193548 L189.677419,40.1612903 L173.935484,40.1612903 L173.935484,8.67741935 L181.806452,8.67741935 L181.806452,0.806451613 L205.419355,0.806451613 Z M197.548387,8.67741935 L189.677419,8.67741935 L189.677419,16.5483871 L197.548387,16.5483871 L197.548387,8.67741935 Z"
      fillRule="nonzero"
    />
    <polygon
      shapeRendering="crispEdges"
      fill="orange"
      points="264.451613 40.1612903 264.451613 32.2903226 272.322581 32.2903226 272.322581 16.5483871 256.580645 16.5483871 256.580645 32.2903226 248.709677 32.2903226 248.709677 8.67741935 272.322581 8.67741935 272.322581 0.806451613 240.83871 0.806451613 240.83871 8.67741935 232.967742 8.67741935 232.967742 32.2903226 240.83871 32.2903226 240.83871 40.1612903"
    />
    <polygon
      shapeRendering="crispEdges"
      fill="orange"
      points="323.483871 40.1612903 323.483871 32.2903226 331.354839 32.2903226 331.354839 0.806451613 315.612903 0.806451613 315.612903 32.2903226 307.741935 32.2903226 307.741935 0.806451613 292 0.806451613 292 32.2903226 299.870968 32.2903226 299.870968 40.1612903"
    />
    <polygon
      shapeRendering="crispEdges"
      fill="orange"
      points="372.677419 40.1612903 372.677419 0.806451613 356.935484 0.806451613 356.935484 40.1612903"
    />
  </svg>
)
