import { memo, useEffect, useLayoutEffect, useState } from 'react'
import {
  Button,
  type ColorTokens,
  Switch as TamaguiSwitch,
  type SwitchProps as TamaguiSwitchProps,
  Text,
  View,
  YStack,
  type YStackProps,
} from 'tamagui'

export default function Sandbox() {
  const [x, setX] = useState(Date.now())
  const [time, setTime] = useState(0)

  useLayoutEffect(() => {
    if (x) {
      setTime(Date.now() - x)
    }
  }, [x])

  return (
    <>
      <Button>hello world</Button>

      <View p={20} onPress={() => setX(Date.now())}>
        <Text>
          Re-render {x} in {time}ms
        </Text>
      </View>
      <YStack key={x}>
        <Switch />
        {/* <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch /> */}
      </YStack>
    </>
  )
}

export type SwitchProps = TamaguiSwitchProps & {
  variant?: any
}

const animationProp = {
  animation: [
    'bouncy',
    {
      backgroundColor: {
        overshootClamping: true,
      },
    },
  ] as YStackProps['animation'],
}

const Switch = memo(
  ({
    checked: checkedProp,
    onCheckedChange: onCheckedChangeProp,
    disabled,
    variant,
    disabledStyle,
    ...rest
  }: SwitchProps): JSX.Element => {
    const [checked, setChecked] = useState(checkedProp)
    // const colors = useTheme()

    console.log('render!')

    const isBranded = variant === 'branded'

    useEffect(() => {
      setChecked(checkedProp)
    }, [checkedProp])

    const onCheckedChange = (val: boolean): void => {
      // If the checked prop is undefined, we are in an uncontrolled state
      // and should update the internal state
      // Otherwise, we are in a controlled state and should not update the internal state
      // (because the checked prop will be updated from the outside)
      if (typeof checkedProp === 'undefined') {
        setChecked(val)
      }
      onCheckedChangeProp?.(val)
    }

    const THUMB_HEIGHT = 24
    const THUMB_PADDING = 6
    const TRACK_HEIGHT = THUMB_HEIGHT + THUMB_PADDING * 2

    const isDisabledStyling = disabled && !checked

    const frameBackgroundColor = ((): ColorTokens => {
      if (isDisabledStyling) {
        return '$color3'
      }
      if (isBranded) {
        return checked ? '$color1' : '$red3'
      }
      return checked ? '$color3' : '$red3'
    })()

    const thumbBackgroundColor = ((): ColorTokens => {
      if (isDisabledStyling) {
        if (isBranded) {
          return checked ? '$red2' : '$red3'
        }
        return checked ? '$red2' : '$red3'
      }
      if (isBranded) {
        return checked ? '$green1' : '$red1'
      }
      return checked ? '$color1' : '$red1'
    })()

    const iconColor = ((): string => {
      return '#ff0000'
      // if (isDisabledStyling) {
      //   return colors.green1.val
      // }
      // return isBranded ? colors.color1.val : colors.red1.val
    })()

    // Switch is a bit performance sensitive on native, memo to help here
    const frameActiveStyle = {
      x: checked ? -2 : 0,
    }

    const outerActiveStyle = {
      width: 28,
      x: checked ? -4 : 0,
    }

    return (
      <TamaguiSwitch
        alignItems="center"
        {...animationProp}
        aria-disabled={disabled}
        aria-selected={checked}
        backgroundColor={frameBackgroundColor}
        borderWidth={0}
        checked={checked}
        defaultChecked={checked}
        debug="profile"
        group="card"
        hoverStyle={{
          backgroundColor: isBranded
            ? checked
              ? '$color3'
              : '$red4'
            : checked
              ? '$color5'
              : '$red4',
          cursor: 'pointer',
        }}
        justifyContent="center"
        minHeight={TRACK_HEIGHT}
        minWidth={60}
        p={4}
        pointerEvents={disabled ? 'none' : 'auto'}
        disabledStyle={{
          ...(checked && { opacity: 0.6 }),
          ...disabledStyle,
        }}
        onCheckedChange={disabled ? undefined : onCheckedChange}
        {...rest}
      ></TamaguiSwitch>
    )
  }
)
