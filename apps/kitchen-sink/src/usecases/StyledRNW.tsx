import { Platform } from 'react-native'
import { Input as TamaguiInput, styled, useThemeName } from 'tamagui'

export function StyledRNW() {
  return <Input id="styled-rnw-input" accessibilityLabel="ok" placeholder="search" />
}

            const TextInput = styled(
  TamaguiInput,
  {
    fontSize: 16,
    fontFamily: '$silkscreen',
    color: '$color5',
    minWidth: 0,
    borderWidth: 0,
    borderColor: 'transparent',

    variants: {
      unset: {
        false: {
          borderWidth: 2,
          py: 12,
          px: 14,
          borderRadius: 6,
          bg: '$color3',
          focusStyle: {
            bg: '$color4',
            margin: 0,
          },
        },
      },
    } as const,

    defaultVariants: {
      unset: false,
    },
  },
  {
    inlineProps: new Set(['id', 'testID']),
  }
)

export const Input = TamaguiInput.styleable(function MyInput({ ...props }, ref) {
  const parentTheme = useThemeName()

  return (
    <TextInput
      unstyled
      keyboardAppearance={parentTheme?.includes('dark') ? 'dark' : 'default'}
      {...props}
      focusStyle={{ margin: 0, ...props.focusStyle }}
      id={Platform.select({
        // on native, this leads to duplicates?
        web: props.id,
      })}
      ref={ref}
    />
  )
})
