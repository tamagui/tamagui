import { Input, styled } from 'tamagui'

function TestStyledInputFocusStyle() {
  const StyledInput = styled(Input, {
    focusStyle: {
      borderWidth: 10,
      borderColor: 'blue',
    },
  })

  return <StyledInput debug="verbose" />
}
