import { ChevronDown, ChevronUp, ChevronsUp, Menu } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { Button, Drawer, H1, H2, H3, Paragraph, XStack, YStack } from 'tamagui'

export function DrawerDemo() {
  const [show, setShow] = useState(false)
  return (
    <Drawer.Provider>
      <XStack space>
        <Button
          size="$8"
          icon={show ? ChevronDown : ChevronUp}
          circular
          onPress={() => setShow((x) => !x)}
        />
        <Drawer open={show} onChange={setShow}>
          <YStack p="$6">
            <H3>Drawer contents</H3>
            <Paragraph>Lorem ipsum dolor sit amet.</Paragraph>
          </YStack>
        </Drawer>
      </XStack>
    </Drawer.Provider>
  )
}
