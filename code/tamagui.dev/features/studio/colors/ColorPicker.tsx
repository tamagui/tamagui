import { hsla, parseToHsla, toHex } from 'color2k'
import { memo, useEffect, useState } from 'react'
import {
  Input,
  Popover,
  Separator,
  SizableText,
  Slider,
  View,
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
    if (state.sat === 0) {
      // when setting a hue without any sat, set up
      state.sat = 1
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
    <XStack ml={20} gap="$4" items="center">
      <Popover hoverable>
        <Popover.Trigger>
          <View
            y={4}
            width={24}
            height={24}
            overflow="hidden"
            rounded={100}
            rotateX="0.001deg"
            borderWidth={1}
            borderColor="$color10"
          >
            <YStack
              select="none"
              pointerEvents="none"
              position="absolute"
              fullscreen
              items="center"
              justify="center"
            >
              {!props.value && <Checkerboard rotate="45deg" />}
              <YStack fullscreen bg={hex as any} />
            </YStack>
          </View>
        </Popover.Trigger>

        <Popover.Content
          transition="quick"
          elevation="$8"
          borderWidth={1}
          borderColor="$color10"
          p={0}
          enterStyle={{
            y: -10,
            opacity: 0,
          }}
          exitStyle={{
            y: -10,
            opacity: 0,
          }}
        >
          <Popover.Arrow borderWidth={1} borderColor="$color10" size="$4" />
          {!props.disableLightness && (
            <>
              <Separator vertical />
              <Input
                disabled={props.disabled as boolean}
                placeholder="Hex"
                borderWidth={0}
                size="$3"
                width={75}
                self="center"
                onFocus={(e) => e.currentTarget.select()}
                style={{
                  fontFamily: '$mono',
                }}
                value={hex}
                onChange={(e) => {
                  updateHexInput(e.target?.value ?? '')
                }}
                onBlur={() => {
                  sendUpdateHexDelayed(hex)
                }}
              />
            </>
          )}
        </Popover.Content>
      </Popover>

      <XStack
        items="center"
        gap="$4"
        height="$3"
        {...(props.disabled && {
          opacity: 0.5,
          pointerEvents: 'none',
        })}
      >
        <YStack
          {...(props.shouldDim && {
            opacity: 0.5,
          })}
          y="$-2"
          gap="$1"
        >
          <SizableText size="$1" select="none" color="$color9">
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
              width={160}
              height={3}
              style={{
                background: hueLinearGradient,
              }}
            ></Slider.Track>
            <Slider.Thumb
              borderWidth={0}
              focusStyle={{
                bg: '$color1',
              }}
              hoverStyle={{
                bg: '$color1',
              }}
              pressStyle={{
                bg: '$color1',
              }}
              bg="$color1"
              size="$1"
              index={0}
              circular
              elevate
            />
          </Slider>
        </YStack>

        <YStack
          {...(props.shouldDim && {
            opacity: 0.5,
          })}
          y="$-2"
          gap="$1"
        >
          <SizableText size="$1" select="none" color="$color9">
            Saturation
          </SizableText>
          <YStack>
            <Slider
              orientation="horizontal"
              min={0}
              max={1}
              step={0.01}
              value={[sat]}
              onValueChange={(val) => updateSat(val[0])}
            >
              <Slider.Track
                height={3}
                width={120}
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`,
                }}
              ></Slider.Track>
              <Slider.Thumb
                borderWidth={0}
                focusStyle={{
                  bg: '$color1',
                }}
                hoverStyle={{
                  bg: '$color1',
                }}
                pressStyle={{
                  bg: '$color1',
                }}
                bg="$color1"
                size="$1"
                index={0}
                circular
                elevate
              />
            </Slider>
          </YStack>
        </YStack>

        {!props.disableLightness && (
          <YStack y="$-2" gap="$1">
            <SizableText size="$1" select="none" color="$color9">
              Lightness
            </SizableText>
            <YStack rounded="$2">
              <Slider
                orientation="horizontal"
                min={0}
                max={1}
                step={0.01}
                value={[light]}
                onValueChange={(val) => updateLight(val[0])}
              >
                <Slider.Track
                  height={3}
                  rounded="$10"
                  width={120}
                  style={{
                    background: `linear-gradient(to right, #000, #fff)`,
                  }}
                />

                <Slider.Thumb
                  borderWidth={0}
                  focusStyle={{
                    bg: '$color1',
                  }}
                  hoverStyle={{
                    bg: '$color1',
                  }}
                  pressStyle={{
                    bg: '$color1',
                  }}
                  bg="$color1"
                  size="$1"
                  index={0}
                  circular
                  elevate
                />
              </Slider>
            </YStack>
          </YStack>
        )}
      </XStack>
    </XStack>
  )
})
