import { Button, XStack } from 'tamagui'
import { AlertDialog, styled } from 'tamagui'

export const MyOverlay = styled(AlertDialog.Overlay, {
  animation: 'quick',
  backgroundColor: 'gray',
  opacity: 0.7,
  enterStyle: { opacity: 0 },
})

export const MyAlert = AlertDialog

export function OverlayStyled() {
  return (
    <XStack p="$10" gap="$4">
      <WorkingExample />
      <NotWorkingExample />
    </XStack>
  )
}

const WorkingExample = () => {
  return (
    <MyAlert>
      <MyAlert.Trigger asChild>
        <Button>Open working</Button>
      </MyAlert.Trigger>
      <MyAlert.Portal>
        <MyAlert.Overlay
          key="overlay"
          animation="quick"
          backgroundColor="gray"
          opacity={0.7}
          enterStyle={{ opacity: 0 }}
        />
        <MyAlert.Content>
          <MyAlert.Title>Test</MyAlert.Title>
          <MyAlert.Description>Lorem ipsum dolor sit amet</MyAlert.Description>
          <MyAlert.Cancel asChild>
            <Button>OK</Button>
          </MyAlert.Cancel>
        </MyAlert.Content>
      </MyAlert.Portal>
    </MyAlert>
  )
}

const NotWorkingExample = () => {
  return (
    <MyAlert>
      <MyAlert.Trigger asChild>
        <Button>Open not working </Button>
      </MyAlert.Trigger>
      <MyAlert.Portal>
        <MyOverlay key="overlay" />
        <MyAlert.Content>
          <MyAlert.Title>Test</MyAlert.Title>
          <MyAlert.Description>Lorem ipsum dolor sit amet</MyAlert.Description>
          <MyAlert.Cancel asChild>
            <Button>OK</Button>
          </MyAlert.Cancel>
        </MyAlert.Content>
      </MyAlert.Portal>
    </MyAlert>
  )
}
