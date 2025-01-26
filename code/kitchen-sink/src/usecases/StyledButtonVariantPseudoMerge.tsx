// debug
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

    bigGreen: {
      true: {
        pressStyle: {
          backgroundColor: 'green',
          scale: 1.2,
        },
      },
    },
  } as const,
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
  } as const,
})

export const StyledButtonVariantPseudoMerge = () => (
  <>
    <StyledButton id="test" reddish>
      test
    </StyledButton>

    <StyledButton id="animated" reddish animation="quick">
      animated
    </StyledButton>

    <StyledButton id="variant-merge">variant-merge</StyledButton>
    <StyledButton id="variant-merge-red" reddish>
      variant-merge-red
    </StyledButton>
    <StyledButton id="variant-merge-green" reddish bigGreen>
      variant-merge-green
    </StyledButton>
    <StyledButton id="variant-merge-green-red" bigGreen reddish>
      variant-merge-green-red
    </StyledButton>

    <DoubleStyledButtonNoVariants reddish id="double-styled">
      double-styled
    </DoubleStyledButtonNoVariants>

    <Theme name="light">
      <YStack theme="green">
        <StyledButtonVariantTheme id="variant-theme" testVariant>
          variant-theme
        </StyledButtonVariantTheme>
      </YStack>
    </Theme>
  </>
)
