import { Drawer } from '@tamagui/drawer'
import { ChevronDown, ChevronUp } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { Button, H3, Paragraph, XStack, YStack } from 'tamagui'

export function DrawerDemo() {
  const [show, setShow] = useState(false)
  return (
    <YStack minWidth={260} w="100%" h="100%" ai="center" jc="center" position="relative">
      <Drawer.Provider>
        <Button
          size="$6"
          icon={show ? ChevronDown : ChevronUp}
          circular
          onPress={() => setShow((x) => !x)}
        />
        <Drawer open={show} onChange={setShow}>
          <YStack ai="center" jc="center" p="$6" space>
            <Paragraph selectable={false}>Hello.</Paragraph>
            <Button
              size="$6"
              icon={show ? ChevronDown : ChevronUp}
              circular
              onPress={() => setShow((x) => !x)}
            />
          </YStack>
        </Drawer>
      </Drawer.Provider>
    </YStack>
  )
}
