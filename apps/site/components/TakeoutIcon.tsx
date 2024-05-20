import Image from 'next/image'
import * as React from 'react'
import { YStack } from 'tamagui'

export const TakeoutIcon = YStack.styleable((props, ref) => (
  <YStack {...props} ref={ref as any} p="$4" m="$-4">
    <Image alt="chinese takeout box icon" width={24} height={24} src="/takeouticon.svg" />
  </YStack>
))
