import { ChevronDown } from '@tamagui/feather-icons'
import { Sheet } from '@tamagui/sheet'
import React, { useState } from 'react'
import { Button } from 'tamagui'

export const SheetDemo = () => {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onPress={() => setOpen(true)}>Open</Button>
      <Sheet open={open} snapPoints={[80, 10]} position={position} onChangePosition={setPosition}>
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
