import type React from 'react'
import { memo, useEffect, useRef, useState } from 'react'
import {
  Button,
  Circle,
  type ColorTokens,
  Paragraph,
  Sheet,
  styled,
  Switch as TamaguiSwitch,
  type SwitchProps as TamaguiSwitchProps,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { TimedRender } from './components/TimedRender'

const StyledButton = styled(Button, {
  transition: 'quick',
})

// Test component that tracks render counts
const RenderCountBox = memo(({ id }: { id: string }) => {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <View
      testID={`render-count-box-${id}`}
      transition="quick"
      width={100}
      height={100}
      backgroundColor="$blue10"
      borderRadius="$4"
      alignItems="center"
      justifyContent="center"
      hoverStyle={{
        backgroundColor: '$green10',
        scale: 1.1,
      }}
      pressStyle={{
        backgroundColor: '$red10',
        scale: 0.95,
      }}
    >
      <Text testID={`render-count-${id}`} color="white" fontWeight="bold">
        {renderCount.current}
      </Text>
    </View>
  )
})

// Container that shows multiple boxes for render count testing
const RenderCountTest = () => {
  const [resetKey, setResetKey] = useState(0)

  return (
    <YStack gap="$4" padding="$4">
      <Paragraph>
        Hover/press boxes below. Lower render counts = better.
      </Paragraph>
      <Paragraph fontSize="$2" color="$gray11">
        With avoidRerenders, hover/press should NOT increment render count.
      </Paragraph>

      <Button testID="reset-render-counts" onPress={() => setResetKey((k) => k + 1)}>
        Reset Render Counts
      </Button>

      <XStack key={resetKey} gap="$4" flexWrap="wrap">
        <RenderCountBox id="1" />
        <RenderCountBox id="2" />
        <RenderCountBox id="3" />
      </XStack>
    </YStack>
  )
}

export const Sandbox = () => {
  const [mode, setMode] = useState<'sheet' | 'renderCount'>('renderCount')

  if (mode === 'renderCount') {
    return (
      <YStack flex={1}>
        <XStack padding="$2" gap="$2">
          <Button size="$2" onPress={() => setMode('sheet')}>
            Sheet Test
          </Button>
          <Button size="$2" onPress={() => setMode('renderCount')}>
            Render Count Test
          </Button>
        </XStack>
        <RenderCountTest />
      </YStack>
    )
  }

  return <SheetTest onBack={() => setMode('renderCount')} />
}

const SheetTest = ({ onBack }: { onBack: () => void }) => {
  const [open, setOpen] = useState(false)
  const [animationType, setAnimationType] = useState<'lazy' | 'quick' | 'bouncy'>('lazy')

  return (
    <YStack gap="$4" padding="$4">
      <Button size="$2" onPress={onBack}>
        Back to Render Count Test
      </Button>

      <XStack gap="$2">
        <Button onPress={() => setAnimationType('lazy')}>lazy</Button>
        <Button onPress={() => setAnimationType('quick')}>quick</Button>
        <Button onPress={() => setAnimationType('bouncy')}>bouncy</Button>
      </XStack>

      <Button onPress={() => setOpen(true)}>
        Open Sheet (transition="{animationType}")
      </Button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        transition={animationType}
        modal
        dismissOnSnapToBottom
        snapPoints={[50]}
      >
        <Sheet.Overlay
          transition={animationType}
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame padding="$4" bg="$background">
          <YStack gap="$4">
            <Paragraph>Sheet with transition="{animationType}"</Paragraph>
            <Button onPress={() => setOpen(false)}>Close</Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )

  // return (
  //   <>
  //     <Button onPress={() => setX(!x)}>set disbaled</Button>

  //     <Button disabledStyle={{ bg: 'red' }} disabled={x}>
  //       Hiii {x}
  //     </Button>
  //   </>
  // )

  // return <SwitchPerformance />
  // const [k, setK] = useState(0)

  // console.warn('re rendering sandbox')

  // return (
  //   <>
  //     <Button onPress={() => setK(Math.random())}>render</Button>
  //     <XStack
  //       debug="verbose"
  //       width={200}
  //       height={200}
  //       borderWidth={1}
  //       borderColor="$borderColor"
  //     />
  //   </>
  // )
}

const SwitchPerformance = () => {
  const [k, setK] = useState(0)

  return (
    <>
      <Button onPress={() => setK(Math.random())}>render</Button>
      <TimedRender key={k}>
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
      </TimedRender>
    </>
  )
}

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
  }: SwitchProps): React.JSX.Element => {
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
        transition={[
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
          transition={[
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
            transition="100ms"
            opacity={checked ? 1 : 0}
          >
            {/* <Check color={iconColor} size={14} /> */}
          </View>

          {/* fake thumb for width animation */}
          <View
            $group-item-hover={outerActiveStyle}
            $group-item-press={outerActiveStyle}
            transition={[
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
