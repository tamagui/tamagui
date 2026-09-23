// Styled Card = the unstyled @tamagui/ui Card behavior (structural layout) +
// the default v2-look skin (theme background) and the size table: size-derived
// radius on the frame, size-derived padding on Header/Footer. Single skin
// definition; the shadcn registry item is generated from this file.
import {
  CardBackground,
  CardFooter as CardFooterBehavior,
  CardFrame as UiCardFrame,
  CardHeader as CardHeaderBehavior,
} from '@tamagui/card'
import {
  type ComponentSize,
  createStyledContext,
  type GetProps,
  resolveSizing,
  styled,
  withStaticProperties,
} from '@tamagui/core'

export type CardSize = ComponentSize | boolean

const CardContext = createStyledContext<{ size?: CardSize }>({ size: 'md' })

const getCardFrameSize = styled.dynamic<CardSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  if (!sizing) return
  return {
    borderRadius: sizing.radius,
  }
})

const getCardPaddingSize = styled.dynamic<CardSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  if (!sizing) return
  return {
    padding: sizing.paddingInline,
  }
})

export const CardFrame = styled(UiCardFrame, {
  displayName: 'Card',
  context: CardContext,
  backgroundColor: 'background',
  variants: {
    size: getCardFrameSize,
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const CardHeader = styled(CardHeaderBehavior, {
  displayName: 'CardHeader',
  context: CardContext,
  variants: {
    size: getCardPaddingSize,
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const CardFooter = styled(CardFooterBehavior, {
  displayName: 'CardFooter',
  context: CardContext,
  variants: {
    size: getCardPaddingSize,
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const Card = withStaticProperties(CardFrame, {
  Header: CardHeader,
  Footer: CardFooter,
  Background: CardBackground,
})

export type CardProps = GetProps<typeof CardFrame>
