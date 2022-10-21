import { ChevronDown } from '@tamagui/lucide-icons'
import { Sheet } from '@tamagui/sheet'
import { useState } from 'react'
import { Button, Circle, Square, XStack, YStack, isWeb } from 'tamagui'

export const SheetDemo = () => {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(true)

  return (
    <>
      <XStack space>
        <Button onPress={() => setOpen(true)}>Open</Button>
        {isWeb && <Button onPress={() => setModal((x) => !x)}>{modal ? 'Modal' : 'Inline'}</Button>}
      </XStack>

      <Sheet
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 50, 25]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame>
          {/* <Sheet.ScrollView
            contentContainerStyle={{
              minHeight: '100%',
            }}
          > */}
          <YStack f={1} p="$4" jc="center" ai="center">
            <Button
              size="$6"
              circular
              icon={ChevronDown}
              onPress={() => {
                setOpen(false)
              }}
            />
          </YStack>

          <Square m="$4" size={120} bc="$red9" />
          <Circle m="$4" size={120} bc="$orange9" />
          <Square m="$4" size={120} bc="$yellow9" />
          {/* </Sheet.ScrollView> */}
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
