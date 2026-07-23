// Styled Card = the unstyled @tamagui/ui Card behavior (structural layout + the
// size mechanism: size-derived radius on the frame, size-derived padding on
// Header/Footer) + the default v2-look skin (theme background). Single skin
// definition; the shadcn registry item is generated from this file.
import {
  CardBackground,
  CardFooter,
  CardFrame as UiCardFrame,
  CardHeader,
  type GetProps,
  styled,
  withStaticProperties,
} from '@tamagui/ui'

export const CardFrame = styled(UiCardFrame, {
  name: 'Card',
  backgroundColor: '$background',
})

export const Card = withStaticProperties(CardFrame, {
  Header: CardHeader,
  Footer: CardFooter,
  Background: CardBackground,
})

export type CardProps = GetProps<typeof CardFrame>
