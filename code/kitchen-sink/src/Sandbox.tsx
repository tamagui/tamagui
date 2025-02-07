import { memo, useEffect, useState } from 'react'
import {
  Button,
  type ColorTokens,
  styled,
  Switch as TamaguiSwitch,
  type SwitchProps as TamaguiSwitchProps,
  View,
  XStack,
} from 'tamagui'

const StyledButton = styled(Button, {
  animation: 'quick',
})

export const Sandbox = () => {
  const [k, setK] = useState(0)

  console.warn('re rendering sandbox')

  return (
    <>
      <Button onPress={() => setK(Math.random())}>render</Button>
      <XStack
        debug="verbose"
        width={200}
        height={200}
        borderWidth={1}
        borderColor="$borderColor"
      />
    </>
  )
}

// const SwitchPerformance = () => {
//   const [k, setK] = useState(0)

//   return (
//     <>
//       <Button onPress={() => setK(Math.random())}>render</Button>
//       <TimedRender key={k}>
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//         <Switch />
//       </TimedRender>
//     </>
//   )
// }

// // export const Sandbox = () => {

// //   // return <UndefinedThemeBug />
// // }

// function TestButton() {
//   const [isDisabled, setIsDisabled] = useState(false)

//   return (
//     <>
//       <Button onPress={() => setIsDisabled(!isDisabled)}>
//         {isDisabled ? 'Enable' : 'Disable'}
//       </Button>

//       <StyledButton onPress={() => setIsDisabled(!isDisabled)} disabled={isDisabled}>
//         State: {isDisabled ? 'Disabled' : 'Enabled'}
//       </StyledButton>
//     </>
//   )
// }

// function UndefinedThemeBug() {
//   const [theme, setTheme] = useState<ThemeName | undefined>('red')

//   return (
//     <YStack f={1} ai="center" gap="$8" px="$10" pt="$5" bg="$background">
//       <Paragraph>Current Theme: {`${theme}`}</Paragraph>
//       <XStack gap="$3">
//         <Button onPress={() => setTheme(undefined)} size="$3">
//           Undefined
//         </Button>
//         <Button onPress={() => setTheme('red')} size="$3">
//           Red
//         </Button>
//         <Button onPress={() => setTheme('blue')} size="$3">
//           Blue
//         </Button>
//       </XStack>
//       <View theme={theme}>
//         <View bw={2} bc="$borderColor" backgroundColor="$background" p="$4" br="$3">
//           <Button>Button!</Button>
//         </View>
//         <Label>Test label</Label>
//       </View>
//     </YStack>
//   )
// }

export type SwitchProps = TamaguiSwitchProps & {
  variant?: any
}

const Switch = memo(
  ({
    checked: checkedProp,
    onCheckedChange: onCheckedChangeProp,
    disabled,
    disabledStyle,
    ...rest
  }: SwitchProps): JSX.Element => {
    const [checked, setChecked] = useState(checkedProp)
    // const colors = useTheme()

    const isBranded = true

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
        return '$color10'
      }
      if (isBranded) {
        return checked ? '$color10' : '$red10'
      }
      return checked ? '$color10' : '$red10'
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
        width={100}
        alignItems="center"
        animation={[
          'bouncy',
          {
            backgroundColor: {
              overshootClamping: true,
            },
          },
        ]}
        aria-disabled={disabled}
        aria-selected={checked}
        backgroundColor={frameBackgroundColor}
        borderWidth={0}
        checked={checked}
        defaultChecked={checked}
        group="testy"
        hoverStyle={{
          backgroundColor: isBranded
            ? checked
              ? '$color10'
              : '$red4'
            : checked
              ? '$color5'
              : '$red4',
          cursor: 'pointer',
        }}
        justifyContent="center"
        minHeight={TRACK_HEIGHT}
        minWidth={100}
        p={4}
        pointerEvents={disabled ? 'none' : 'auto'}
        disabledStyle={{
          ...(checked && { opacity: 0.6 }),
          ...disabledStyle,
        }}
        onCheckedChange={disabled ? undefined : onCheckedChange}
        {...rest}
      >
        <TamaguiSwitch.Thumb
          alignItems="center"
          animation={[
            'bouncy',
            {
              backgroundColor: {
                overshootClamping: true,
              },
            },
          ]}
          backgroundColor={thumbBackgroundColor}
          justifyContent="center"
          minHeight={THUMB_HEIGHT}
          width={24}
        >
          <View
            $group-item-hover={frameActiveStyle}
            $group-item-press={frameActiveStyle}
            animation="100ms"
            opacity={checked ? 1 : 0}
          >
            {/* <Check color={iconColor} size={14} /> */}
          </View>

          {/* fake thumb for width animation */}
          <View
            $group-item-hover={outerActiveStyle}
            $group-item-press={outerActiveStyle}
            animation={[
              'bouncy',
              {
                backgroundColor: {
                  overshootClamping: true,
                },
              },
            ]}
            backgroundColor={thumbBackgroundColor}
            borderRadius={100}
            inset={0}
            minHeight={THUMB_HEIGHT}
            position="absolute"
            width={24}
            zIndex={-2}
          />
        </TamaguiSwitch.Thumb>
      </TamaguiSwitch>
    )
  }
)
