import { Pocket, X } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Theme, Tooltip, XStack } from 'tamagui'

export function TooltipDemo() {
  return (
    <XStack space>
      <Theme name="dark">
        <Tooltip contents="This is a tooltips contents">
          <Button icon={Pocket} circular />
        </Tooltip>
      </Theme>
      <Theme name="light">
        <Tooltip size="$6" contents="This is a tooltips contents">
          <Button size="$6" icon={Pocket} circular />
        </Tooltip>
      </Theme>
      <Theme name="light">
        <Tooltip size="$8" contents="This is a tooltips contents">
          <Button size="$8" icon={Pocket} circular />
        </Tooltip>
      </Theme>
    </XStack>
  )
}
