import { Input, styled } from 'tamagui'

const StyledInput = styled(Input, {
  borderColor: 'red',
  borderWidth: 5,

  variants: {
    test: {
      true: {
        focusStyle: {
          borderWidth: 10,
          borderColor: 'blue',
        },
      },
    },
  } as const,
})

export function StyledInputFocusStyle() {
  return <StyledInput test />
}
