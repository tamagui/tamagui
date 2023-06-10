import { Button, H1, Square, Stack } from 'tamagui'

export const Sandbox = () => {
  return (
    <Stack
      space="$4"
      $md={{
        space: '$5',
      }}
    >
      <Square size={20} bc="red" />
      <Square size={20} bc="red" />
      <Square size={20} bc="red" />
    </Stack>
  )

  return <Button>test things here</Button>
}
