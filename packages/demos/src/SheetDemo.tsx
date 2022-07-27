import { ChevronDown } from '@tamagui/feather-icons'
import { Sheet } from '@tamagui/sheet'
import React, { useState } from 'react'
import { Button, XStack, isWeb } from 'tamagui'

export const SheetDemo = () => {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(!isWeb)

  return (
    <>
      <XStack space>
        <Button onPress={() => setOpen(true)}>Open</Button>
        {isWeb && <Button onPress={() => setModal((x) => !x)}>{modal ? 'Modal' : 'Inline'}</Button>}
      </XStack>
      <Sheet
        modal={modal}
        open={open}
        onChangeOpen={setOpen}
        snapPoints={[80, 30]}
        dismissOnSnapToBottom
        position={position}
        onChangePosition={setPosition}
      >
        <Sheet.Overlay />
        <Sheet.Frame ai="center" jc="center">
          <Sheet.Handle />
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
