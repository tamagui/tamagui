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
  createStyledContext,
  type GetProps,
  styled,
  withStaticProperties,
} from '@tamagui/core'

export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | boolean

const CardContext = createStyledContext<{ size?: CardSize }>({ size: 'md' })

const cardRadius = {
  xs: { borderRadius: 'sm' },
  sm: { borderRadius: 'md' },
  md: { borderRadius: 'md' },
  lg: { borderRadius: 'md' },
  xl: { borderRadius: 'lg' },
} as const

const cardPadding = {
  xs: { padding: '2' },
  sm: { padding: '3' },
  md: { padding: '4' },
  lg: { padding: '6' },
  xl: { padding: '8' },
} as const

export const CardFrame = styled(UiCardFrame, {
  displayName: 'Card',
  context: CardContext,
  backgroundColor: 'background',
  variants: {
    size: {
      ...cardRadius,
      true: cardRadius.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const CardHeader = styled(CardHeaderBehavior, {
  displayName: 'CardHeader',
  context: CardContext,
  variants: {
    size: {
      ...cardPadding,
      true: cardPadding.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const CardFooter = styled(CardFooterBehavior, {
  displayName: 'CardFooter',
  context: CardContext,
  variants: {
    size: {
      ...cardPadding,
      true: cardPadding.md,
    },
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
