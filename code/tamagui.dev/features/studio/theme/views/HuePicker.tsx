import { hsla } from 'color2k'
import { memo, useState } from 'react'
import { Slider, View, XGroup, XStack, YStack, useDebounce, useEvent } from 'tamagui'

export const HuePicker = memo(
  ({ value = 0, onChange }: { value: number; onChange: (next: number) => void }) => {
    const [cur, setCur] = useState(value)
    const onChangeDelayed = useDebounce(useEvent(onChange), 500)

    return (
      <XStack gap="$4" items="center">
        <XGroup>
          <View width="$2" height="$2" overflow="hidden">
            <YStack
              select="none"
              pointerEvents="none"
              position="absolute"
              fullscreen
              items="center"
              justify="center"
            >
              <YStack fullscreen bg={hsla(cur, 0.5, 0.5, 1) as any} />
            </YStack>
          </View>
        </XGroup>

        <XStack items="center" gap="$4" height="$3">
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
                borderWidth={0.5}
                borderColor="$color12"
                width={145}
                style={{
                  background: hueLinearGradient,
                }}
              ></Slider.Track>
              <Slider.Thumb bg="$color1" size="$1" index={0} rounded="$10" elevate />
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
