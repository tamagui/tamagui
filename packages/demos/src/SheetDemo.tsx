import { ChevronDown } from '@tamagui/feather-icons'
import { Drawer } from '@tamagui/sheet'
import React, { useState } from 'react'
import { Button } from 'tamagui'

export const SheetDemo = () => {
  const [position, setPosition] = useState(0)

  return (
    <Drawer snapPoints={[80, 10]} position={position} onChangePosition={setPosition}>
      <Drawer.Backdrop />
      <Drawer.Frame ai="center" jc="center">
        <Drawer.Handle />
        <Button
          size="$6"
          circular
          icon={ChevronDown}
          onPress={() => {
            setPosition(1)
          }}
        />
      </Drawer.Frame>
    </Drawer>
  )
}
