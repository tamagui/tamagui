import {
  FontSizeTokens,
  Stack,
  Text,
  createVariantContext,
  styled,
  withStaticProperties,
} from '@tamagui/core'

export const ButtonVariant = createVariantContext<{
  size: FontSizeTokens
}>()

export const ButtonFrame = styled(Stack, {
  variantContext: ButtonVariant,
  backgroundColor: 'red',
})

export const ButtonText = styled(Text, {
  variantContext: ButtonVariant,
  color: 'white',

  variants: {
    size: {
      '...fontSize': (val, { font }) => {
        return {
          fontSize: font?.size[val],
        }
      },
    },
  },
})

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
