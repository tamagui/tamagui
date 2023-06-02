import { Input, styled } from 'tamagui'

export function StyledInputFocusStyle() {
  const StyledInput = styled(Input, {
    debug: 'verbose',

    focusStyle: {
      borderWidth: 10,
      borderColor: 'blue',
    },
  })

  return <StyledInput />
}
