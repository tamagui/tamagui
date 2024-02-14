import { Input as TamaguiInput, styled } from 'tamagui'

const TextInput2 = styled(TamaguiInput, {
  unstyled: true,
  name: 'bla',
  height: '$5',
  borderRadius: '$1',
  borderWidth: 1,
  fontSize: '$1',
  keyboardAppearance: 'dark',
  paddingHorizontal: '$2',
  placeholderTextColor: 'rgba(255,255,255,0.3)',
  color: 'green',

  variants: {
    gameplay: {
      true: {
        fontSize: 100,
        lineHeight: '$5',
        letterSpacing: '$5',
        color: 'red',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'red',
        cursor: 'pointer',

        focusStyle: {
          borderColor: 'green',
        },
      },
    },
    gameplayMobile: {
      true: {
        fontSize: '$3',
        letterSpacing: '$3',
        marginTop: -2.35,
        marginBottom: -5.9,
        lineHeight: '$3',
      },
    },
  } as const,
})

export function StyledStyleableInputVariant() {
  return <TextInput2 id="input" gameplay />
}
