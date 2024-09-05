import { Unspaced, XStack, YStack } from 'tamagui'

// TODO: rendering these is very expensive, converting to svg might help
export const Ruler = ({
  size,
  max = size,
  orientation = 'horizontal',
  disableColorDiff = false,
  rotate = false,
}: {
  size: number
  max?: number
  orientation?: 'horizontal' | 'vertical'
  disableColorDiff?: boolean
  rotate?: boolean
}) => {
  const applied = Math.floor(size / 10)
  const Stack = orientation === 'horizontal' ? XStack : YStack
  return (
    <Stack ai={rotate ? 'flex-end' : undefined} space={9}>
      <Unspaced>
        <YStack
          pos="absolute"
          width={orientation === 'horizontal' ? max : undefined}
          height={orientation === 'vertical' ? max : undefined}
          borderColor="$color6"
          borderBottomWidth={orientation === 'horizontal' ? 1 : undefined}
          borderLeftWidth={orientation === 'vertical' ? 1 : undefined}
        />
        <YStack
          pos="absolute"
          width={orientation === 'horizontal' ? size : undefined}
          height={orientation === 'vertical' ? size : undefined}
        />
      </Unspaced>
      {Array.from(Array(Math.floor(max / 10) + 1).keys()).map((_, idx) => {
        const currentPx = idx * 10
        const prominent = currentPx % 100 === 0
        const active = currentPx < applied * 10
        return (
          <RulerLine
            key={idx}
            orientation={orientation}
            active={active}
            disableColorDiff={disableColorDiff}
            prominent={prominent}
          />
        )
      })}
    </Stack>
  )
}

export const RulerLine = ({
  prominent,
  active,
  orientation,
  disableColorDiff = false,
}: {
  prominent?: boolean
  active?: boolean
  orientation: 'horizontal' | 'vertical'
  disableColorDiff?: boolean
}) => {
  const size = prominent ? 12 : 5
  return (
    <YStack
      backgroundColor={
        disableColorDiff
          ? '$color6'
          : active
          ? prominent
            ? '$color11'
            : '$color10'
          : '$color6'
      }
      width={orientation === 'horizontal' ? 1 : size}
      height={orientation === 'vertical' ? 1 : size}
    />
  )
}
