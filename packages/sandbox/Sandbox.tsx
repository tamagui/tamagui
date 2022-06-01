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
        Switch theme
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
          {/* <DialogDemo /> */}
          <KitchenSink />
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
        <DialogContent
          bordered
          elevate
          key="content"
          space
          animation={[
            'bouncy',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -40, opacity: 0, scale: 0.975 }}
          exitStyle={{ x: 0, y: 40, opacity: 0, scale: 0.975 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <Fieldset horizontal>
            <Label w={160} justifyContent="flex-end" htmlFor="name">
              Name
            </Label>
            <Input f={1} id="name" defaultValue="Nate Wienert" />
          </Fieldset>
          <Fieldset horizontal>
            <Label w={160} justifyContent="flex-end" htmlFor="username">
              Username
            </Label>
            <Input f={1} id="username" defaultValue="@natebirdman" />
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
