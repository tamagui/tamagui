import { Button, styled } from 'tamagui'

const PlainButton = styled(Button, {
  variants: {
    plain: {
      true: {
        backgroundColor: 'transparent hover:transparent press:transparent',
        padding: 0,
        borderWidth: 0,
        borderColor: 'hover:transparent press:transparent',
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
