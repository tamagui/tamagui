import React from 'react'
import { Theme, YStack, useThemeName } from 'tamagui'

export function HeroContainer({
  children,
  resetTheme,
}: {
  children?: React.ReactNode
  resetTheme?: boolean
}) {
  const themeName = useThemeName({ parent: true })
  const parentThemeBaseName = themeName.replace(/[a-z]+\-/, '')

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
      py={40}
      minHeight={380}
      borderRadius="$3"
      $gtLg={{
        mx: '$-2',
      }}
      // $notXl={{
      //   mx: '$-6',
      // }}
    >
      {resetTheme ? <Theme name={parentThemeBaseName}>{children}</Theme> : children}
    </YStack>
  )
}
