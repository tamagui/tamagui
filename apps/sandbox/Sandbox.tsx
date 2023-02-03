import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Accordion } from '@tamagui/accordion'
// debug
import { Collapsible } from '@tamagui/collapsible'
import { useState } from 'react'
import {
  AnimatePresence,
  Button,
  H1,
  Paragraph,
  Popover,
  Spinner,
  Square,
  TamaguiProvider,
  XStack,
  YStack,
  useMedia,
  useTheme,
} from 'tamagui'

import config from './tamagui.config'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')
  const [open, setOpen] = useState(false)

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <YStack>
        <Collapsible>
          <Collapsible.Trigger asChild>
            <Button>Open Collapsible</Button>
          </Collapsible.Trigger>
          <Paragraph>Some paragraph here</Paragraph>
          <Collapsible.Content>
            <Paragraph>Some random content here</Paragraph>
            <Paragraph>Some another random content here</Paragraph>
          </Collapsible.Content>
        </Collapsible>
      </YStack>
      <YStack width={'$20'}>
        <Accordion type="single">
          <Accordion.Item value="1">
            <Accordion.Trigger asChild>
              <Button>First Item</Button>
            </Accordion.Trigger>
            <Accordion.Content>
              <Paragraph>There are some texts in here</Paragraph>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="2">
            <Accordion.Trigger asChild>
              <Button>Second Item</Button>
            </Accordion.Trigger>
            <Accordion.Content>
              <Paragraph>There are another some texts in here iajsdfo</Paragraph>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </YStack>
    </TamaguiProvider>
  )
}
