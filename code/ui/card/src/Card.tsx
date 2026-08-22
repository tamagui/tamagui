import { YStack } from '@tamagui/stacks'
import { resolveSizeToken } from '@tamagui/size'
import type { GetProps, SizeTokens, VariantSpreadExtras } from '@tamagui/web'
import { createStyledContext, styled, withStaticProperties } from '@tamagui/web'

const CardContext = createStyledContext({
  size: true as SizeTokens | true,
})

const cardRadiusVariant = (
  val: SizeTokens | true,
  { tokens }: VariantSpreadExtras<any>
) => {
  const radiusToken = resolveSizeToken(val, 'radius')
  return {
    borderRadius: tokens.radius[radiusToken] ?? radiusToken,
  }
}

const cardPaddingVariant = (
  val: SizeTokens | true,
  { tokens }: VariantSpreadExtras<any>
) => {
  const spaceToken = resolveSizeToken(val, 'space')
  return {
    padding: tokens.space[spaceToken] ?? spaceToken,
  }
}

// Unstyled Card frame: structural layout + the size mechanism (size-derived
// radius on the frame, size-derived padding on Header/Footer) only. The theme
// background lives in the tamagui skin (code/ui/tamagui/src/components/Card.tsx).
export const CardFrame = styled(YStack, {
  displayName: 'Card',
  context: CardContext,
  size: true,
  position: 'relative',

  variants: {
    size: {
      true: cardRadiusVariant,
      Size: cardRadiusVariant,
    },
  } as const,
})

export const CardHeader = styled(YStack, {
  displayName: 'CardHeader',
  context: CardContext,
  zIndex: 10,
  backgroundColor: 'transparent',
  marginBottom: 'auto',

  variants: {
    size: {
      true: cardPaddingVariant,
      Size: cardPaddingVariant,
    },
  } as const,
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
