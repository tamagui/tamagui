import { Button, styled } from 'tamagui'

const PlainButton = styled(Button, {
  variants: {
    plain: {
      true: {
        backgroundColor: 'transparent',
        padding: 0,
        borderWidth: 0,
        hoverStyle: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        pressStyle: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
      },
    },
  } as const,
})

const PlainStyled = styled(PlainButton, {
  plain: true,
})

const PlainMerged = styled(PlainButton, {
  plain: true,

  variants: {
    plain: {
      true: {
        borderWidth: 2,
        borderColor: 'green',
      },
    },
  },
})

export const ButtonUnstyled = () => (
  <>
    <PlainButton id="plain-inline" plain>
      hi
    </PlainButton>

    <PlainStyled id="plain-styled">hi</PlainStyled>

    <PlainMerged id="plain-merged">hi</PlainMerged>
  </>
)
