import React from 'react'
import { YStack } from 'tamagui'

export function HeroContainer({ children }: { children?: React.ReactNode }) {
  return (
    <YStack
      // In case any semantic content sneaks through in a hero, let's hide it
      // from the a11y tree since this is a presentational component.
      // role="presentation"
      className="hero-gradient"
      mt="$2"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={100}
      borderRadius="$3"
      $gtLg={{
        mx: '$-2',
      }}
      // $notXl={{
      //   mx: '$-6',
      // }}
    >
      {children}
    </YStack>
  )
}
