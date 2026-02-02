import { hsla, parseToHsla, toHex } from 'color2k'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
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

// Memoized slider components to prevent re-renders when other state changes
const HueSlider = memo(({ value, onChange, onSlideEnd }: {
  value: number
  onChange: (val: number) => void
  onSlideEnd: () => void
}) => {
  return (
    <Slider
      orientation="horizontal"
      min={0}
      max={360}
      step={10}
      value={[value]}
      onValueChange={(val) => onChange(val[0])}
      onSlideEnd={onSlideEnd}
    >
      <Slider.Track
        width="100%"
        minWidth={80}
        height={3}
        style={{
          background: hueLinearGradient,
        }}
      />
      <Slider.Thumb unstyled position="absolute" index={0} size="$1" bg="$color12" circular elevate />
    </Slider>
  )
})

const SatSlider = memo(({ value, hue, onChange, onSlideEnd }: {
  value: number
  hue: number
  onChange: (val: number) => void
  onSlideEnd: () => void
}) => {
  return (
    <Slider
      orientation="horizontal"
      min={0}
      max={1}
      step={0.03}
      value={[value]}
      onValueChange={(val) => onChange(val[0])}
      onSlideEnd={onSlideEnd}
    >
      <Slider.Track
        height={3}
        width="100%"
        minWidth={80}
        style={{
          background: `linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`,
        }}
      />
      <Slider.Thumb unstyled position="absolute" index={0} size="$1" bg="$color12" circular elevate />
    </Slider>
  )
})

const LightSlider = memo(({ value, onChange, onSlideEnd }: {
  value: number
  onChange: (val: number) => void
  onSlideEnd: () => void
}) => {
  return (
    <Slider
      orientation="horizontal"
      min={0}
      max={1}
      step={0.03}
      value={[value]}
      onValueChange={(val) => onChange(val[0])}
      onSlideEnd={onSlideEnd}
    >
      <Slider.Track
        height={3}
        rounded="$10"
        width="100%"
        minWidth={80}
        style={{
          background: `linear-gradient(to right, #000, #fff)`,
        }}
      />
      <Slider.Thumb unstyled position="absolute" index={0} size="$1" bg="$color12" circular elevate />
    </Slider>
  )
})

export const ColorPickerContents = memo((props: ColorPickerProps) => {
  const defaultValue = props.value || 'hsl(10, 50%, 50%)'
  const [state, setState] = useState(() => getNextState(defaultValue))

  function getNextState(nextValue: string) {
    const [hue, sat, light, alpha] = parseToHsla(nextValue)
    return {
      hue,
      sat,
      light,
      alpha,
    }
  }

  // skip state reset when the change came from our own slider interaction
  const isOwnChange = useRef(false)

  useEffect(() => {
    if (isOwnChange.current) {
      isOwnChange.current = false
      return
    }
    setState(getNextState(defaultValue))
  }, [defaultValue])

  const { hue, sat, light } = state

  // use ref so onSlideEnd always has latest state
  const stateRef = useRef(state)
  stateRef.current = state

  const sendOnChange = useEvent((color: HSLA) => {
    const hslaval = hsla(color.hue, color.sat, color.light, color.alpha)
    const outgoing = toHex(hslaval)
    props.onChange?.(outgoing, color)
  })

  // fire expensive onChange only on slide end (thumb release),
  // deferred so the pointer-up paints before heavy work runs
  const handleSlideEnd = useEvent(() => {
    const cur = stateRef.current
    // when setting a hue without any sat, bump sat so the hue is visible
    if (cur.sat === 0) {
      const fixed = { ...cur, sat: 1 }
      setState(fixed)
      stateRef.current = fixed
    }
    isOwnChange.current = true
    setTimeout(() => sendOnChange(stateRef.current), 0)
  })

  const updateHue = useCallback((newHue: number) => {
    setState((prev) => ({ ...prev, hue: newHue }))
  }, [])

  const updateSat = useCallback((newSat: number) => {
    setState((prev) => ({ ...prev, sat: newSat }))
  }, [])

  const updateLight = useCallback((newLight: number) => {
    setState((prev) => ({ ...prev, light: newLight }))
  }, [])

  const hex = toHex(hsla(hue, sat, light, 1))
  // separate state only for intermediate typed values in the hex input
  const [hexInputOverride, setHexInputOverride] = useState<string | null>(null)
  const hexDisplay = hexInputOverride ?? hex

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
        sendOnChange(newState)
        setHexInputOverride(null)
      } catch (error) {
        console.info(`invalid hex ${newHex}`)
      }
    }),
    2000
  )

  const updateHex = (newHex: string) => {
    setHexInputOverride(newHex)
    sendUpdateHexDelayed(newHex)
  }

  return (
    <XStack ml={20} gap="$4" items="center" flex={1}>
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
                value={hexDisplay}
                onChange={(e) => {
                  updateHex(e.target?.value ?? '')
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
        flex={1}
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
          flex={1}
        >
          <SizableText size="$1" select="none" color="$color9">
            Hue
          </SizableText>
          <HueSlider value={hue} onChange={updateHue} onSlideEnd={handleSlideEnd} />
        </YStack>

        <YStack
          {...(props.shouldDim && {
            opacity: 0.5,
          })}
          y="$-2"
          gap="$1"
          flex={1}
        >
          <SizableText size="$1" select="none" color="$color9">
            Saturation
          </SizableText>
          <SatSlider value={sat} hue={hue} onChange={updateSat} onSlideEnd={handleSlideEnd} />
        </YStack>

        {!props.disableLightness && (
          <YStack y="$-2" gap="$1" flex={1}>
            <SizableText size="$1" select="none" color="$color9">
              Lightness
            </SizableText>
            <LightSlider value={light} onChange={updateLight} onSlideEnd={handleSlideEnd} />
          </YStack>
        )}
      </XStack>
    </XStack>
  )
})
