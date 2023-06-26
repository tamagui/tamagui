import { Button, styled } from 'tamagui'

const StyledButton = styled(Button, {
  variants: {
    reddish: {
      true: {
        pressStyle: {
          backgroundColor: 'red',
        },
        hoverStyle: {
          backgroundColor: 'green',
        },
      },
    },
  },
})

export const StyledButtonVariantPseudo = () => (
  <StyledButton id="test" reddish>
    test
  </StyledButton>
)
