import { Button, styled } from 'tamagui'

const Unstyled = styled(Button, {
  unstyled: true,
})

export default () => (
  <>
    <Button id="unstyled-inline" unstyled>
      hi
    </Button>

    <Unstyled id="unstyled-styled">hi2</Unstyled>
  </>
)
