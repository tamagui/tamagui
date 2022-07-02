import { Drawer } from '@tamagui/drawer'
import { ChevronDown, ChevronUp } from '@tamagui/feather-icons'
import React from 'react'
import { useState } from 'react'
import { Button, Paragraph, YStack } from 'tamagui'

export function DrawerDemo() {
  const [show, setShow] = useState(false)
  return (
    <YStack minWidth={230} w="100%" h="100%" ai="center" jc="center" position="relative">
      <Drawer.Provider>
        <Button
          size="$6"
          icon={show ? ChevronDown : ChevronUp}
          circular
          onPress={() => setShow((x) => !x)}
          elevation="$2"
        />
        <Drawer open={show} onChangeOpen={setShow}>
          <Drawer.Frame h={200} ai="center" jc="center" p="$6" space>
            <Paragraph selectable={false}>Hello.</Paragraph>
            <Button
              size="$6"
              icon={show ? ChevronDown : ChevronUp}
              circular
              onPress={() => setShow((x) => !x)}
              elevation="$2"
            />
          </Drawer.Frame>
        </Drawer>
      </Drawer.Provider>
    </YStack>
  )
}
