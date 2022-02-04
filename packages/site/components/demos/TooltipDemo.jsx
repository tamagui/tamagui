import { Menu } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Theme, Tooltip, XStack } from 'tamagui'

export function TooltipDemo() {
  return (
    <XStack space>
      <Theme name="dark">
        <Tooltip contents="This is a tooltips contents">
          <Button icon={Menu} circular />
        </Tooltip>
      </Theme>
      <Theme name="light">
        <Tooltip size="$6" contents="This is a tooltips contents">
          <Button size="$6" icon={Menu} circular />
        </Tooltip>
      </Theme>
    </XStack>
  )
}
