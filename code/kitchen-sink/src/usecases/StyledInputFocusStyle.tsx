import { Input, styled } from 'tamagui'

const StyledInput = styled(Input, {
  borderColor: 'red',
  borderWidth: 5,

  variants: {
    test: {
      true: {
        borderWidth: 'focus:10px',
        borderColor: 'focus:blue',
      },
    },
  } as const,
})

export function StyledInputFocusStyle() {
  return <StyledInput test />
}
