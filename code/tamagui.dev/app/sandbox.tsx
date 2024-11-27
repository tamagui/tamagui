import { styled, View } from '@tamagui/web'

export default function Sandbox() {
  return <Test />
}

const Test = styled(View, {
  width: 100,
  height: 100,
  backgroundColor: 'red',

  $md: {
    $web: {
      backgroundColor: 'green',
    },
  },
})
