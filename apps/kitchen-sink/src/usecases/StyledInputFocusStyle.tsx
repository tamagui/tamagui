import { Input, styled } from 'tamagui'

const StyledInput = styled(Input, {
  focusStyle: {
    borderWidth: 10,
    borderColor: 'blue',
  },
})

export function StyledInputFocusStyle() {
  return <StyledInput />
}
