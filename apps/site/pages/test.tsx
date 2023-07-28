// debug
import { Text } from 'tamagui'
import { H1, H2 } from 'tamagui'

// export default () => <Square size={100} animation="quick" bc="$background" />
export default () => {
  console.warn('rendering')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flex: 1,
      }}
    >
      <Text
        debug="verbose"
        ff="$body"
        fontSize="$3"
        color="$color10"
        $sm={{ dsp: 'none' }}
      >
        our new pro starter kit
      </Text>
    </div>
  )
}
