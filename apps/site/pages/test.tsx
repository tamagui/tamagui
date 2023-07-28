// debug
import { Circle, Text } from 'tamagui'
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
      <Circle
        debug="verbose"
        animation="quick"
        bg="red"
        size={100}
        enterStyle={{ y: 100 }}
      />
    </div>
  )
}
