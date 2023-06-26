import { Button, styled } from 'tamagui'

const Unstyled = styled(Button, {
  unstyled: true,
})

const UnstyledMerged = styled(Button, {
  unstyled: true,

  variants: {
    // override one thing
    unstyled: {
      true: {
        borderWidth: 2,
        borderColor: 'green',
      },
    },
  },
})

export const ButtonUnstyled = () => (
  <>
    <Button id="unstyled-inline" unstyled>
      hi
    </Button>

    <Unstyled id="unstyled-styled">hi</Unstyled>

    <UnstyledMerged id="unstyled-merged">hi</UnstyledMerged>
  </>
)
