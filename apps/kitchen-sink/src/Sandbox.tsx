// debug-verbose
// import './wdyr'

import { View } from 'react-native'
import { H2, Square, styled } from 'tamagui'

const Test = styled(Square, {
  $gtSm: {
    backgroundColor: 'red',
  },
})

export const Sandbox = () => {
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        <H2
          mt="$5"
          animation="bouncy"
          y={0}
          enterStyle={{ scale: 0.95, y: 4, opacity: 0 }}
          exitStyle={{ scale: 0.95, y: 4, opacity: 0 }}
          opacity={1}
          scale={1}
          size="$6"
          color="$color12"
          selectable={false}
          textAlign="center"
          $md={{
            size: '$7',
            mt: '$4',
          }}
        >
          Hello
        </H2>
      </>
    </View>
  )
}
