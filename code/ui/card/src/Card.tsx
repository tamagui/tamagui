import { YStack } from '@tamagui/stacks'
import type { GetProps } from '@tamagui/web'
import { styled, withStaticProperties } from '@tamagui/web'

// Unstyled Card frame: structural layout only. Radius, padding, and the theme
// background live in the tamagui skin (code/ui/tamagui/src/components/Card.tsx).
export const CardFrame = styled(YStack, {
  displayName: 'Card',
  position: 'relative',
})

export const CardHeader = styled(YStack, {
  displayName: 'CardHeader',
  zIndex: 10,
  backgroundColor: 'transparent',
  marginBottom: 'auto',
})

export const CardFooter = styled(CardHeader, {
  displayName: 'CardFooter',
  zIndex: 5,
  flexDirection: 'row',
  marginTop: 'auto',
  marginBottom: 0,
})

export const CardBackground = styled(YStack, {
  displayName: 'CardBackground',
  zIndex: 0,
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  padding: 0,
})

export type CardHeaderProps = GetProps<typeof CardHeader>
export type CardFooterProps = GetProps<typeof CardFooter>
export type CardProps = GetProps<typeof CardFrame>

export const Card = withStaticProperties(CardFrame, {
  Header: CardHeader,
  Footer: CardFooter,
  Background: CardBackground,
})
