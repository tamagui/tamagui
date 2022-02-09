import React from 'react'
import { Theme, YStack } from 'tamagui'

export function HeroContainer({ children }: { children?: React.ReactNode }) {
  return (
    <YStack
      // In case any semantic content sneaks through in a hero, let's hide it
      // from the a11y tree since this is a presentational component.
      // role="presentation"
      className="hero-gradient"
      mt="$2"
      mb="$4"
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
      {children}
    </YStack>
  )
}

// not ssr safe
// function ResetTheme({ children }: { children?: any }) {
//   const themeName = useThemeName({ parent: true })
//   const parentThemeBaseName = themeName.replace(/[a-z]+\-/, '')
//   console.log('resetting to', themeName, parentThemeBaseName)

//   return (
//     <Theme debug name={parentThemeBaseName as any}>
//       {children}
//     </Theme>
//   )
// }
