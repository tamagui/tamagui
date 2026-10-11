import { useState } from 'react'
import { AnimatePresence, Button, Text, View, styled } from 'tamagui'
import { RefreshCcw } from '../../icons'
import { tone } from '../../tone'

const DIGIT = 30
const COMMA = 12

/** ------ EXAMPLE ------ */
export const AnimatedNumbers = () => {
  const [value, setValue] = useState(48_210)
  const [previous, setPrevious] = useState(41_650)

  const change = ((value - previous) / previous) * 100
  const up = change >= 0

  // keys count from the right, so a digit only rolls when its own place changes
  const chars = value.toLocaleString('en-US').split('')
  const widths = chars.map((char) => (char === ',' ? COMMA : DIGIT))
  const total = widths.reduce((sum, width) => sum + width, 0)
  let offset = 0

  return (
    <View
      width={340}
      maxW="100%"
      p="5"
      gap="4"
      bg={tone.surface}
      borderWidth={1}
      borderColor={tone.border}
      rounded="6"
      boxShadow="0 1px 3px shadow-color"
    >
      <View flexDirection="row" items="center" justify="space-between">
        <Text fontFamily="body" fontSize="sm" color={tone.muted}>
          Revenue this month
        </Text>
        <Button
          size="sm"
          circular
          variant="quiet"
          aria-label="Refresh"
          icon={RefreshCcw}
          onPress={() => {
            setPrevious(value)
            setValue(Math.round(20_000 + Math.random() * 80_000))
          }}
        />
      </View>

      <View flexDirection="row" items="flex-end" gap="1">
        <Digit position="relative" width={26} color={tone.muted}>
          $
        </Digit>
        <View height={60} width={total} position="relative" overflow="hidden">
          <AnimatePresence initial={false}>
            {chars.map((char, index) => {
              const x = offset
              offset += widths[index]
              return (
                <Digit
                  key={`${chars.length - index}-${char}`}
                  x={x}
                  width={widths[index]}
                  y="enter:-40px exit:40px"
                  opacity="enter:0 exit:0"
                  transition="quick"
                >
                  {char}
                </Digit>
              )
            })}
          </AnimatePresence>
        </View>
      </View>

      <View flexDirection="row" items="center" gap="2">
        <Text
          fontFamily="body"
          fontSize="xs"
          fontWeight="600"
          px="2"
          py="0.5"
          rounded="full"
          color={up ? 'green-11' : 'red-11'}
          bg={up ? 'green-3' : 'red-3'}
        >
          {up ? '+' : ''}
          {change.toFixed(1)}%
        </Text>
        <Text fontFamily="body" fontSize="xs" color={tone.muted}>
          vs last month
        </Text>
      </View>
    </View>
  )
}

const Digit = styled(Text, {
  fontFamily: 'body',
  fontSize: '5xl',
  lineHeight: '6xl',
  fontWeight: '600',
  letterSpacing: -1,
  color: 'color-12',
  position: 'absolute',
  t: 0,
  l: 0,
  width: DIGIT,
  textAlign: 'center',
})
