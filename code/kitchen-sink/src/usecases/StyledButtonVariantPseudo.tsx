import { Button, styled } from 'tamagui'

const StyledButton = styled(Button, {
  variants: {
    reddish: {
      true: {
        backgroundColor: 'yellow hover:green press:red',
      },
    },
  } as const,
})

export const StyledButtonVariantPseudo = () => (
  <StyledButton id="test" reddish>
    test
  </StyledButton>
)
