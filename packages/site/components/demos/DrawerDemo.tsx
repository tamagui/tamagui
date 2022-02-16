import { Drawer } from '@tamagui/drawer'
import { ChevronDown, ChevronUp } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { Button, H3, Paragraph, XStack, YStack } from 'tamagui'

export function DrawerDemo() {
  const [show, setShow] = useState(false)
  return (
    <Drawer.Provider>
      <Button
        size="$6"
        icon={show ? ChevronDown : ChevronUp}
        circular
        onPress={() => setShow((x) => !x)}
      />
      <Drawer open={show} onChange={setShow}>
        <YStack p="$6">
          <H3 selectable={false}>Drawer contents</H3>
          <Paragraph selectable={false}>Lorem ipsum dolor sit amet.</Paragraph>
        </YStack>
      </Drawer>
    </Drawer.Provider>
  )
}
