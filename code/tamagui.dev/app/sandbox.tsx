import { styled, View } from '@tamagui/web'

export default function Sandbox() {
  return (
    <Test
      animation="bouncy"
      debug="verbose"
      pressStyle={{
        scale: 2,
      }}
      hoverStyle={{
        scale: 1.5,
      }}
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
      position: 'fixed',
      gridColumnGap: 12,
      backgroundColor: 'green',
    },
  },
})
