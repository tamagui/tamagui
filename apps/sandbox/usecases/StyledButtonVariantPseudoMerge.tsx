import { Button, Theme, YStack, styled } from 'tamagui'

const StyledButton = styled(Button, {
  pressStyle: {
    scale: 0.5,
  },

  variants: {
    reddish: {
      true: {
        pressStyle: {
          backgroundColor: 'red',
        },
      },
    },
  },
})

const DoubleStyledButtonNoVariants = styled(StyledButton, {})

const StyledButtonVariantTheme = styled(Button, {
  pressStyle: {
    scale: 0.5,
  },

  variants: {
    testVariant: {
      true: {
        backgroundColor: '$background',
      },
    },
  },
})

export default () => (
  <>
    <StyledButton id="test" reddish>
      test
    </StyledButton>
    <StyledButton id="animated" reddish animation="quick">
      test
    </StyledButton>
    <DoubleStyledButtonNoVariants reddish id="double-styled">
      test
    </DoubleStyledButtonNoVariants>

    <Theme name="light">
      <YStack theme="green">
        <StyledButtonVariantTheme id="variant-theme" testVariant>
          test
        </StyledButtonVariantTheme>
      </YStack>
    </Theme>
  </>
)
