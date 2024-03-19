import { GetBaseStyles, GetVariantProps, styled } from "@tamagui/web";

const SomeNonTamaguiTextComponent = (props: {}) => {
  return null
}

export const SomeTextComponent = styled(
  SomeNonTamaguiTextComponent,
  {
    color: '$background',

    variants: {
      foo: {
        true: {
          // making sure this has color
          color: '$background'
        }
      }
    } as const
  },

  { isText: true }
)
