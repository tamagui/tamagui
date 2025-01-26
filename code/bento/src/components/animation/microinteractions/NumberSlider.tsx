import { useState } from 'react'
import { AnimatePresence, Button, Text, View, XGroup, styled } from 'tamagui'
import { useContainerDim } from '../../hooks/useContainerDim'

/** ------ EXAMPLE ------ */
export const AnimatedNumbers = () => {
  const [numbers, setNumbers] = useState(100_000)
  const len = `${numbers}`.length
  const { width } = useContainerDim('window')

  const WIDTH = width * 0.6
  const NUM_WIDTH = WIDTH / 3

  return (
    <View justifyContent="center" alignItems="center" maxWidth="100%" gap="$5">
      <XGroup justifyContent="flex-start" gap="$1">
        <XGroup.Item>
          <Button
            onPress={() => {
              setNumbers(Math.ceil(Math.random() * 1_000_000))
            }}
          >
            Next
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button
            onPress={() => {
              setNumbers(+`${numbers}1`)
            }}
          >
            Add
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button
            onPress={() => {
              setNumbers(+`${numbers}`.slice(0, -1))
            }}
          >
            Remove
          </Button>
        </XGroup.Item>
      </XGroup>

      <View
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        height={100}
        width={WIDTH}
      >
        <AnimatePresence initial={false}>
          {`${numbers}`.split('').map((num, i) => {
            const key = `${i}${num}`
            const x = (() => {
              const indexFromCenter = i + 0.5 - len / 2
              return Math.min(NUM_WIDTH, WIDTH / len) * indexFromCenter
            })()

            return (
              <AnimatedNumber
                key={key}
                animation="medium"
                animateOnly={['transform', 'opacity']}
                enterStyle={{
                  y: -50,
                  opacity: 0,
                }}
                exitStyle={{
                  y: 50,
                  opacity: 0,
                }}
                x={x}
              >
                {num}
              </AnimatedNumber>
            )
          })}
        </AnimatePresence>
      </View>
    </View>
  )
}

AnimatedNumbers.fileName = 'NumberSlider'

const AnimatedNumber = styled(Text, {
  fontFamily: '$silkscreen',
  fontSize: '$12',
  lineHeight: '$12',
  color: '$color',
  position: 'absolute',
  y: 0,
  opacity: 1,

  '$group-window-xs': {
    fontSize: '$8',
  },
})
