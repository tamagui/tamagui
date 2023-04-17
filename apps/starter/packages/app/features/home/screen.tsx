import { Button, YStack } from '@my/ui'
import React from 'react'
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
