import { styled, View } from '@tamagui/web'

export default function Sandbox() {
  return (
    <Test
      $platform-web={{
        position: 'fixed',
      }}
    />
  )
}

const Test = styled(View, {
  width: 100,
  height: 100,
  backgroundColor: 'red',

  $md: {
    '$platform-web': {
      backgroundColor: 'green',
    },
  },
})
