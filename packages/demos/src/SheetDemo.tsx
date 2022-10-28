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
        <Button onPress={() => setModal((x) => !x)}>{modal ? 'Modal' : 'Inline'}</Button>
      </XStack>

      <Sheet
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 50, 25]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} p="$4" jc="center" ai="center" space="$5">
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
            }}
          />
          <Square size="$2" bc="$red9" />
          <Circle size="$2" bc="$orange9" />
          <Square size="$2" bc="$yellow9" />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
