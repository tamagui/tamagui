import { Check } from '@tamagui/feather-icons'
import React from 'react'
import { YStack } from 'tamagui'

export const CheckCircle = () => (
  <YStack w={25} h={25} ai="center" jc="center" bc="$green3" br={100} mr="$3">
    <Check size={12} color="var(--color)" />
  </YStack>
)
