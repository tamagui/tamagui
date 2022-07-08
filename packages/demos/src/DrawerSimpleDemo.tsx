import { Drawer } from '@tamagui/drawer-simple'
import { ChevronDown } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { Button, H1 } from 'tamagui'

export const DrawerSimpleDemo = () => {
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
