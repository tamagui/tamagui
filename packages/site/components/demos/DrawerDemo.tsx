import { Drawer } from '@tamagui/drawer'
import { ChevronDown, ChevronUp } from '@tamagui/feather-icons'
import { useState } from 'react'
import { Button, Paragraph, YStack } from 'tamagui'

export default function DrawerDemo() {
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
        <Drawer open={show} onChangeOpen={setShow}>
          <Drawer.Frame ai="center" jc="center" p="$6" space>
            <Paragraph selectable={false}>Hello.</Paragraph>
            <Button
              size="$6"
              icon={show ? ChevronDown : ChevronUp}
              circular
              onPress={() => setShow((x) => !x)}
            />
          </Drawer.Frame>
        </Drawer>
      </Drawer.Provider>
    </YStack>
  )
}
