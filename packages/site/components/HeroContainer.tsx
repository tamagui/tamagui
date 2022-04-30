import React from 'react'
import { Card, Theme, XStack, YStack, styled } from 'tamagui'

export function HeroContainer({
  children,
  demoMultiple,
  smaller,
  noPad,
}: {
  demoMultiple?: boolean
  children?: React.ReactNode
  smaller?: boolean
  noPad?: boolean
}) {
  return (
    <YStack
      className="hero-gradient hero-scroll"
      mt="$2"
      mb="$4"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={50}
      minHeight={300}
      y={0}
      borderRadius="$4"
      {...(noPad && {
        py: 0,
      })}
      $gtMd={{
        mx: smaller ? 0 : '$-4',
      }}
    >
      {demoMultiple ? (
        <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start">
          <XStack space="$6" px="$8">
            <Theme name="dark">
              <Card mih={200} p="$0">
                {children}
              </Card>
            </Theme>
            <Theme name="light">
              <Card mih={200} p="$0">
                {children}
              </Card>
            </Theme>
            <Theme name="blue">
              <Card mih={200} p="$0">
                {children}
              </Card>
            </Theme>
            <Theme name="red">
              <Card mih={200} p="$0">
                {children}
              </Card>
            </Theme>
            <Theme name="pink">
              <Card mih={200} p="$0">
                {children}
              </Card>
            </Theme>
            <Theme name="orange">
              <Card mih={200} p="$0">
                {children}
              </Card>
            </Theme>
            <Theme name="green">
              <Card mih={200} p="$0">
                {children}
              </Card>
            </Theme>
            <Theme name="yellow">
              <Card mih={200} p="$0">
                {children}
              </Card>
            </Theme>
          </XStack>
        </XStack>
      ) : (
        children
      )}
    </YStack>
  )
}
