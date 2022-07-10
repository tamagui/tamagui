import { ChevronDown } from '@tamagui/feather-icons'
import { Sheet } from '@tamagui/sheet'
import React, { useState } from 'react'
import { Button } from 'tamagui'

export const SheetDemo = () => {
  const [position, setPosition] = useState(0)

  return (
    <Sheet snapPoints={[80, 10]} position={position} onChangePosition={setPosition}>
      <Sheet.Overlay />
      <Sheet.Frame ai="center" jc="center">
        <Sheet.Handle />
        <Button
          size="$6"
          circular
          icon={ChevronDown}
          onPress={() => {
            setPosition(1)
          }}
        />
      </Sheet.Frame>
    </Sheet>
  )
}
