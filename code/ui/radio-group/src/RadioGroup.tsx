import type { GetProps } from '@tamagui/core'
import { createStyledHOC, isWeb, styled, View, withStaticProperties } from '@tamagui/core'
import type {
  RadioGroupContextValue,
  RadioGroupItemContextValue,
} from '@tamagui/radio-headless'
import {
  useRadioGroup,
  useRadioGroupItem,
  useRadioGroupItemIndicator,
} from '@tamagui/radio-headless'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import React from 'react'

const RADIO_GROUP_ITEM_NAME = 'RadioGroupItem'

export const RadioGroupItemFrame = styled(View, {
  name: RADIO_GROUP_ITEM_NAME,
  render: 'button',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
        userSelect: 'none',
      },
    },
  } as const,
})

const RADIO_GROUP_INDICATOR_NAME = 'RadioGroupIndicator'

export const RadioGroupIndicatorFrame = styled(View, {
  name: RADIO_GROUP_INDICATOR_NAME,
})

const RADIO_GROUP_NAME = 'RadioGroup'

export const RadioGroupFrame = styled(View, {
  name: RADIO_GROUP_NAME,

  variants: {
    orientation: {
      horizontal: {
        flexDirection: 'row',
        spaceDirection: 'horizontal',
      },
      vertical: {
        flexDirection: 'column',
        spaceDirection: 'vertical',
      },
    },
  } as const,
})

export type RadioGroupIndicatorProps = GetProps<typeof RadioGroupIndicatorFrame> & {
  forceMount?: boolean
}

export const RadioGroupContext = React.createContext<RadioGroupContextValue>({})
export const RadioGroupItemContext = React.createContext<RadioGroupItemContextValue>({
  checked: false,
  disabled: false,
})

export type RadioGroupItemProps = GetProps<typeof RadioGroupItemFrame> & {
  value: string
  id?: string
  labelledBy?: string
  disabled?: boolean
}

export type RadioGroupProps = GetProps<typeof RadioGroupFrame> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  required?: boolean
  disabled?: boolean
  name?: string
  native?: boolean
  accentColor?: string
}

const RadioGroupComponent = createStyledHOC(RadioGroupFrame)<RadioGroupProps>(
  (props, ref) => {
    const {
      value,
      defaultValue,
      onValueChange,
      required = false,
      disabled = false,
      name,
      native,
      accentColor,
      orientation = 'vertical',
      ...rest
    } = props

    const { providerValue, frameAttrs, rovingFocusGroupAttrs } = useRadioGroup({
      orientation,
      name,
      defaultValue,
      value,
      onValueChange,
      required,
      disabled,
      native,
      accentColor,
    })

    return (
      <RadioGroupContext.Provider value={providerValue}>
        <RovingFocusGroup {...rovingFocusGroupAttrs}>
          <RadioGroupFrame {...frameAttrs} ref={ref} {...rest} />
        </RovingFocusGroup>
      </RadioGroupContext.Provider>
    )
  }
)

const RadioGroupItem = createStyledHOC(RadioGroupItemFrame)<RadioGroupItemProps>(
  (props, ref) => {
    const { value, labelledBy, onPress, onKeyDown, disabled, id, ...rest } = props

    const {
      providerValue,
      bubbleInput,
      rovingFocusGroupAttrs,
      frameAttrs,
      isFormControl,
      native,
    } = useRadioGroupItem({
      radioGroupContext: RadioGroupContext,
      value,
      id,
      labelledBy,
      disabled,
      onPress: onPress!,
      onKeyDown,
    })

    return (
      <RadioGroupItemContext.Provider value={providerValue}>
        {isWeb && native ? (
          bubbleInput
        ) : (
          <>
            <RovingFocusGroup.Item {...rovingFocusGroupAttrs}>
              <RadioGroupItemFrame {...frameAttrs} ref={ref} {...rest} />
            </RovingFocusGroup.Item>
            {isFormControl && bubbleInput}
          </>
        )}
      </RadioGroupItemContext.Provider>
    )
  }
)

RadioGroupItem.displayName = 'RadioGroupItem'

const RadioGroupIndicator = createStyledHOC(
  RadioGroupIndicatorFrame
)<RadioGroupIndicatorProps>((props, forwardedRef) => {
  const { forceMount, disabled, ...indicatorProps } = props
  const { checked, ...useIndicatorRest } = useRadioGroupItemIndicator({
    radioGroupItemContext: RadioGroupItemContext,
    disabled,
  })

  if (forceMount || checked) {
    return (
      <RadioGroupIndicatorFrame
        {...useIndicatorRest}
        ref={forwardedRef}
        {...indicatorProps}
      />
    )
  }

  return null
})

RadioGroupIndicator.displayName = 'RadioGroupIndicator'

export const RadioGroup = withStaticProperties(RadioGroupComponent, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
})

RadioGroup.displayName = 'RadioGroup'
