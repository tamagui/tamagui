import { Input, styled } from 'tamagui'

export default function TestStyledInputFocusStyle() {
  const StyledInput = styled(Input, {
    debug: 'verbose',

    focusStyle: {
      borderWidth: 10,
      borderColor: 'blue',
    },
  })

  return <StyledInput />
}
