import { hsla, parseToHsla, toHex } from 'color2k'
import { memo, useEffect, useState } from 'react'
import {
  Input,
  Separator,
  SizableText,
  Slider,
  Stack,
  XGroup,
  XStack,
  YStack,
  useDebounce,
  useEvent,
} from 'tamagui'

import { Checkerboard } from '../components/Checkerboard'

type ColorPickerProps = {
  showColors?: [string, string]
  value?: string
  onChange?: (val: string, hsla: HSLA) => void
  id?: string
  onClear?: () => void
  disableLightness?: boolean
  disabled?: boolean
  isActive?: boolean
  shouldDim?: boolean
}

export type HSLA = {
  hue: number
  sat: number
  light: number
  alpha: number
}

export const ColorPicker = memo((props: ColorPickerProps) => {
  // can't do the hover effect with hoverStyle - not sure why
  // const [hovered, setHovered] = useState(false)
  return <></>
})

const hueLinearGradient = `linear-gradient(to right, ${Array.from(Array(36))
  .map((_, idx) => `hsl(${(idx + 1) * 10}, 100%, 50%)`)
  .join(', ')})`

export const ColorPickerContents = memo((props: ColorPickerProps) => {
  const defaultValue = props.value || 'hsl(10, 50%, 50%)'
  const [state, setState] = useState(() => getNextState(defaultValue))

  function getNextState(nextValue: string) {
    const [hue, sat, light, alpha] = parseToHsla(defaultValue)
    return {
      hue,
      sat,
      light,
      alpha,
    }
  }

  useEffect(() => {
    setState(getNextState(defaultValue))
  }, [defaultValue])

  const { hue, sat, light } = state

  // debounce so drags are smoother
  const sendOnChange = useEvent((color: HSLA) => {
    const hslaval = hsla(color.hue, color.sat, color.light, color.alpha)
    const outgoing = toHex(hslaval)
    props.onChange?.(outgoing, color)
  })

  const sendOnChangeDelayed = useDebounce(sendOnChange, 600)

  const updateHue = (newHue: number) => {
    const newState = { ...state, hue: newHue }
    if (state.sat <= 0.1) {
      // when setting a hue without any sat, set sat up to half
      state.sat = 0.5
    }
    setState(newState)
    sendOnChangeDelayed(newState)
  }

  const updateSat = (newSat: number) => {
    const newState = { ...state, sat: newSat }
    setState(newState)
    sendOnChangeDelayed(newState)
  }

  const updateLight = (newLight: number) => {
    const newState = { ...state, light: newLight }
    setState(newState)
    sendOnChangeDelayed(newState)
  }

  const nextHex = toHex(hsla(hue, sat, light, 1))
  const [hex, setHex] = useState(nextHex)

  useEffect(() => {
    setHex(nextHex)
  }, [nextHex])

  const sendUpdateHexDelayed = useDebounce(
    useEvent((newHex: string) => {
      try {
        const hsl = parseToHsla(toHex(newHex))
        const newState: typeof state = {
          hue: hsl[0],
          sat: hsl[1],
          light: hsl[2],
          alpha: hsl[3],
        }
        setState(newState)
        sendOnChangeDelayed(newState)
      } catch (error) {
        console.info(`invalid hex ${newHex}`)
      }
    }),
    2000
  )

  const updateHexInput = (newHex: string) => {
    setHex(newHex)
    sendUpdateHexDelayed(newHex)
  }

  return (
    <XStack gap="$4" ai="center">
      <XGroup bw={1} bc="$borderColor">
        <Stack width="$3" height="$3" ov="hidden">
          <YStack
            userSelect="none"
            pointerEvents="none"
            pos="absolute"
            fullscreen
            ai="center"
            jc="center"
          >
            {!props.value && <Checkerboard rotate="45deg" />}
            <YStack fullscreen backgroundColor={hex as any} />
          </YStack>
        </Stack>

        {!props.disableLightness && (
          <>
            <Separator vertical />
            <Input
              disabled={props.disabled}
              placeholder="Hex"
              bw={0}
              size="$3"
              width={75}
              als="center"
              selectTextOnFocus
              value={hex}
              fontFamily="$mono"
              onChangeText={(newText) => {
                updateHexInput(newText)
              }}
              onEndEditing={() => {
                sendUpdateHexDelayed(hex)
              }}
            />
          </>
        )}
      </XGroup>

      <XStack
        ai="center"
        gap="$4"
        h="$3"
        {...(props.disabled && {
          o: 0.5,
          pe: 'none',
        })}
      >
        <YStack
          {...(props.shouldDim && {
            o: 0.5,
          })}
          y="$-2"
          gap="$1"
        >
          <SizableText size="$1" userSelect="none" theme="alt2">
            Hue
          </SizableText>
          <Slider
            orientation="horizontal"
            min={0}
            max={360}
            step={1}
            value={[hue]}
            onValueChange={(val) => updateHue(val[0])}
          >
            <Slider.Track
              bw={0.5}
              bc="$color12"
              width={100}
              style={{
                background: hueLinearGradient,
              }}
            ></Slider.Track>
            <Slider.Thumb bg="$color1" size="$1" index={0} circular elevate />
          </Slider>
        </YStack>

        <YStack
          {...(props.shouldDim && {
            o: 0.5,
          })}
          y="$-2"
          gap="$1"
        >
          <SizableText size="$1" userSelect="none" theme="alt2">
            Saturation
          </SizableText>
          <YStack bg="$color" br="$2">
            <Slider
              orientation="horizontal"
              min={0}
              max={1}
              step={0.01}
              value={[sat]}
              onValueChange={(val) => updateSat(val[0])}
            >
              <Slider.Track
                bw={0.5}
                bc="$color12"
                width={80}
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`,
                }}
              ></Slider.Track>
              <Slider.Thumb bg="$color1" size="$1" index={0} circular elevate />
            </Slider>
          </YStack>
        </YStack>

        {!props.disableLightness && (
          <YStack y="$-2" gap="$1">
            <SizableText size="$1" userSelect="none" theme="alt2">
              Lightness
            </SizableText>
            <YStack br="$2">
              <Slider
                orientation="horizontal"
                min={0}
                max={1}
                step={0.01}
                value={[light]}
                onValueChange={(val) => updateLight(val[0])}
              >
                <Slider.Track
                  bw={0.5}
                  bc="$color12"
                  width={80}
                  style={{
                    background: `linear-gradient(to right, #000, #fff)`,
                  }}
                />

                <Slider.Thumb bg="$color1" size="$1" index={0} circular elevate />
              </Slider>
            </YStack>
          </YStack>
        )}
      </XStack>
    </XStack>
  )
})
