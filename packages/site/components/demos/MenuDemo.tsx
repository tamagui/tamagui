import { Menu as MenuIcon } from '@tamagui/feather-icons'
import { Menu } from '@tamagui/menu'
import React, { useState } from 'react'
import { Button, H4, Paragraph, YStack } from 'tamagui'

export default function MenuDemo() {
  const [show, setShow] = useState(false)

  return (
    <Menu.Provider>
      <Menu
        open={show}
        onChangeOpen={setShow}
        trigger={
          <Button
            size="$6"
            icon={MenuIcon}
            theme={show ? 'active' : null}
            circular
            onPress={() => setShow((x) => !x)}
          />
        }
      >
        <Menu.Item>
          <YStack p="$2">
            <H4>Menu contents</H4>
            <Paragraph>Lorem ipsum dolor sit amet.</Paragraph>
          </YStack>
        </Menu.Item>
      </Menu>
    </Menu.Provider>
  )
}
