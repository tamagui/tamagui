import { Menu } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { Button, Drawer, H1, Paragraph, XStack } from 'tamagui'

export function DrawerDemo() {
  const [show, setShow] = useState(false)
  return (
    <Drawer.Provider>
      <XStack space>
        <Button size="$8" icon={Menu} circular onPress={() => setShow((x) => !x)} />
        <Drawer open={show}>
          <H1>Drawer contents</H1>
          <Paragraph>Lorem ipsum dolor sit amet.</Paragraph>
        </Drawer>
      </XStack>
    </Drawer.Provider>
  )
}
