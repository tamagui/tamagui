import { hsla } from 'color2k'
import { memo, useState } from 'react'
import { Slider, Stack, XGroup, XStack, YStack, useDebounce, useEvent } from 'tamagui'

export const HuePicker = memo(
  ({ value = 0, onChange }: { value: number; onChange: (next: number) => void }) => {
    const [cur, setCur] = useState(value)
    const onChangeDelayed = useDebounce(useEvent(onChange), 500)

    return (
      <XStack gap="$4" ai="center">
        <XGroup>
          <Stack width="$2" height="$2" ov="hidden">
            <YStack
              userSelect="none"
              pointerEvents="none"
              pos="absolute"
              fullscreen
              ai="center"
              jc="center"
            >
              <YStack fullscreen backgroundColor={hsla(cur, 0.5, 0.5, 1) as any} />
            </YStack>
          </Stack>
        </XGroup>

        <XStack ai="center" gap="$4" h="$3">
          <YStack gap="$1">
            <Slider
              orientation="horizontal"
              min={0}
              max={360}
              step={0.001}
              value={[cur]}
              onValueChange={([val]) => {
                setCur(val)
                onChangeDelayed(val)
              }}
            >
              <Slider.Track
                bw={0.5}
                bc="$color12"
                width={145}
                style={{
                  background: hueLinearGradient,
                }}
              ></Slider.Track>
              <Slider.Thumb bg="$color1" size="$1" index={0} circular elevate />
            </Slider>
          </YStack>
        </XStack>
      </XStack>
    )
  }
)

const hueLinearGradient = `linear-gradient(to right, ${Array.from(Array(36))
  .map((_, idx) => `hsl(${(idx + 1) * 10}, 100%, 50%)`)
  .join(', ')})`
