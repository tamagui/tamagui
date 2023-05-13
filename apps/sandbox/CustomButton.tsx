import {
  FontSizeTokens,
  Stack,
  Text,
  createVariantContext,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import { stepTokenUpOrDown } from '@tamagui/get-size'

export const ButtonVariant = createVariantContext<{
  size: FontSizeTokens
}>()

export const ButtonFrame = styled(Stack, {
  variantContext: ButtonVariant,

  variants: {
    size: {
      '...size': (name, { tokens }) => {
        return {
          width: tokens.size[name],
          paddingHorizontal: stepTokenUpOrDown('size', name, -2),
        }
      },
    },
  } as const,
})

export const ButtonText = styled(Text, {
  variantContext: ButtonVariant,
  color: 'white',

  variants: {
    size: {
      '...fontSize': (name, { font }) => {
        return {
          fontSize: font?.size[name],
        }
      },
    },
  } as const,
})

// const ButtonVariant = combineVariantContexts(ButtonFrame.Variant, ButtonText.Variant)

export const Button = withStaticProperties(ButtonFrame, {
  Variant: ButtonVariant,
  Text: ButtonText,
})

export const CustomButtonDemo = () => {
  return (
    <Button.Variant size="$10">
      <Button>
        <Button.Text>hi</Button.Text>
      </Button>
    </Button.Variant>
  )
}
