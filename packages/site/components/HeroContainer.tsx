import React from 'react'
import { Theme, XStack, YStack, styled } from 'tamagui'

export function HeroContainer({
  children,
  demoMultiple,
}: {
  demoMultiple?: boolean
  children?: React.ReactNode
}) {
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
      overflow="auto"
      pt={30}
      pb={50}
      minHeight={380}
      borderRadius="$3"
      $gtLg={{
        mx: '$-2',
      }}
      // $notXl={{
      //   mx: '$-6',
      // }}
    >
      {demoMultiple ? (
        <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start">
          <XStack space px="$8">
            {/* <Theme name="dark">
              <Card>{children}</Card>
            </Theme>
            <Theme name="light">
              <Card>{children}</Card>
            </Theme> */}
            <Theme name="blue">
              <Card>{children}</Card>
            </Theme>
            <Theme name="red">
              <Card>{children}</Card>
            </Theme>
            <Theme name="pink">
              <Card>{children}</Card>
            </Theme>
            <Theme name="orange">
              <Card>{children}</Card>
            </Theme>
            <Theme name="green">
              <Card>{children}</Card>
            </Theme>
            <Theme name="yellow">
              <Card>{children}</Card>
            </Theme>
          </XStack>
        </XStack>
      ) : (
        children
      )}
    </YStack>
  )
}

const Card = styled(YStack, {
  ai: 'center',
  jc: 'center',
  elevation: '$6',
  minWidth: 180,
  bc: '$background',
  minHeight: 220,
  br: '$4',
})

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
