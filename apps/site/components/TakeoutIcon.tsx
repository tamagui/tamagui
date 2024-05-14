import * as React from 'react'
import { YStack } from 'tamagui'

export const TakeoutIcon = YStack.styleable((props, ref) => (
  <YStack {...props} ref={ref as any} p="$4" m="$-4">
    <img src="/takeouticon.svg" />
  </YStack>
))
