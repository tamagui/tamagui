import React from 'react'
import type {
  RadioGroupContextValue,
  RadioGroupItemContextValue,
} from '@tamagui/radio-headless'
import type { GetProps } from '@tamagui/core'
import { isWeb, withStaticProperties } from '@tamagui/core'

import {
  RadioGroupFrame,
  RadioGroupIndicatorFrame,
  RadioGroupItemFrame,
} from './RadioGroup'

const ensureContext = (x: any) => {
  if (!x.context) {
    x.context = RadioGroupContext
  }
}

type RadioIndicatorProps = GetProps<typeof RadioGroupIndicatorFrame> & {
  forceMount?: boolean
  unstyled?: boolean
}

import {
  useRadioGroup,
  useRadioGroupItem,
  useRadioGroupItemIndicator,
} from '@tamagui/radio-headless'
import { RovingFocusGroup } from '@tamagui/roving-focus'

const RadioGroupContext = React.createContext<RadioGroupContextValue>({})
const RadioGroupItemContext = React.createContext<RadioGroupItemContextValue>({
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

type RadioGroupComponent = (props: RadioGroupProps) => any

type RadioGroupIndicatorComponent = (props: RadioIndicatorProps) => any

type RadioGroupItemComponent = (props: RadioGroupItemProps) => any

export function createRadioGroup<
  F extends RadioGroupComponent,
  D extends RadioGroupIndicatorComponent,
  I extends RadioGroupItemComponent,
>(createProps: { disableActiveTheme?: boolean; Frame?: F; Indicator?: D; Item?: I }) {
  const {
    disableActiveTheme,
    Frame = RadioGroupFrame,
    Indicator = RadioGroupIndicatorFrame,
    Item = RadioGroupItemFrame,
  } = createProps as any as {
    disableActiveTheme?: boolean
    Frame: typeof RadioGroupFrame
    Indicator: typeof RadioGroupIndicatorFrame
    Item: typeof RadioGroupItemFrame
  }

  ensureContext(Frame)
  ensureContext(Indicator)
  ensureContext(Item)

  type RadioGroupProps = GetProps<typeof RadioGroupFrame> & {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    required?: boolean
    disabled?: boolean
    name?: string
    native?: boolean
    accentColor?: string
  }

  const RadioGroupImp = Frame.styleable<RadioGroupProps>((props, ref) => {
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
  })

  const RadioGroupItemImp = Item.styleable<RadioGroupItemProps>((props, ref) => {
    const {
      value,
      labelledBy,
      onPress,
      //@ts-expect-error
      onKeyDown,
      disabled,
      id,
      ...rest
    } = props

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
  })

  RadioGroupItemImp.displayName = 'RadioGroupItem'

  const RadioIndicator = Indicator.styleable<RadioIndicatorProps>(
    (props: RadioIndicatorProps, forwardedRef) => {
      const { forceMount, disabled, ...indicatorProps } = props
      const { checked, ...useIndicatorRest } = useRadioGroupItemIndicator({
        radioGroupItemContext: RadioGroupItemContext,
        disabled,
      })

      if (forceMount || checked) {
        return <Indicator {...useIndicatorRest} ref={forwardedRef} {...indicatorProps} />
      }

      return null
    }
  )

  RadioIndicator.displayName = 'RadioIndicator'

  const RadioGroup = withStaticProperties(RadioGroupImp, {
    Item: RadioGroupItemImp,
    Indicator: RadioIndicator,
  })
  RadioGroup.displayName = 'RadioGroup'

  return RadioGroup
}
