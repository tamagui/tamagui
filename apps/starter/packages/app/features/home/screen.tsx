import {
  Anchor,
  Button,
  H1,
  Input,
  Paragraph,
  Separator,
  Sheet,
  XStack,
  YStack,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { useLink } from 'solito/link'

export function HomeScreen() {
  const linkProps = useLink({
    href: '/user/nate',
  })

  return (
    <YStack bc="red" f={1} ai="center" jc="center">
      <Button {...linkProps}>Go to Nate</Button>
    </YStack>
  )
}
