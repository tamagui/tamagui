import { ChevronDown } from '@tamagui/feather-icons'
import { Sheet } from '@tamagui/sheet'
import React, { useState } from 'react'
import { Button, XStack } from 'tamagui'

export const SheetDemo = () => {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(true)
  const [modal, setModal] = useState(false)

  return (
    <>
      <XStack space>
        <Button onPress={() => setOpen(true)}>Open</Button>
        <Button onPress={() => setModal((x) => !x)}>{modal ? 'Modal' : 'Inline'}</Button>
      </XStack>
      <Sheet
        modal={modal}
        open={open}
        onChangeOpen={setOpen}
        snapPoints={[80, 10]}
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
