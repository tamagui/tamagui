import { Check } from '@tamagui/feather-icons'
import React from 'react'
import { YStack } from 'tamagui'

export const CheckCircle = () => (
  <YStack mt={2} bc="$green12" w={25} h={25} ai="center" jc="center" br={100} mr="$2.5">
    <Check size={12} color="var(--green10)" />
  </YStack>
)
