// forked from Radix UI
// https://github.com/radix-ui/primitives/blob/main/packages/react/radio-group/src/RadioGroup.tsx

import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { GetProps } from '@tamagui/core'
import { getVariableValue, styled } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { registerFocusable } from '@tamagui/focusable'
import { getSize } from '@tamagui/get-token'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { useLabelContext } from '@tamagui/label'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { usePrevious } from '@tamagui/use-previous'
import * as React from 'react'
import type { View } from 'react-native'

const RADIO_GROUP_NAME = 'RadioGroup'

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

const [createRadioGroupContext, createRadioGroupScope] =
  createContextScope(RADIO_GROUP_NAME)
type RadioGroupContextValue = {
  value?: string
  disabled?: boolean
  required?: boolean
  onChange?: (value: string) => void
  name?: string
  native?: boolean
  accentColor?: string
}
const [RadioGroupProvider, useRadioGroupContext] =
  createRadioGroupContext<RadioGroupContextValue>(RADIO_GROUP_NAME)

const getState = (checked: boolean) => {
  return checked ? 'checked' : 'unchecked'
}

/* -------------------------------------------------------------------------
 * RadioIndicator
 * ------------------------------------------------------------------------ */

const RADIO_GROUP_INDICATOR_NAME = 'RadioGroupIndicator'

const RadioIndicatorFrame = styled(
  ThemeableStack,
  {
    variants: {
      unstyled: {
        false: {
          width: '33%',
          height: '33%',
          borderRadius: 1000,
          backgroundColor: '$color',
          pressTheme: true,
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    name: RADIO_GROUP_INDICATOR_NAME,
  }
)

type RadioIndicatorProps = GetProps<typeof RadioIndicatorFrame> & {
  forceMount?: boolean
  unstyled?: boolean
}

type RadioIndicatorElement = TamaguiElement

const RadioIndicator = RadioIndicatorFrame.extractable(
  React.forwardRef<RadioIndicatorElement, RadioIndicatorProps>(
    (props: ScopedRadioGroupItemProps<RadioIndicatorProps>, forwardedRef) => {
      const { __scopeRadioGroupItem, forceMount, disabled, ...indicatorProps } = props
      const { checked } = useRadioGroupItemContext(
        RADIO_GROUP_INDICATOR_NAME,
        __scopeRadioGroupItem
      )

      if (forceMount || checked) {
        return (
          <RadioIndicatorFrame
            data-state={getState(checked)}
            data-disabled={disabled ? '' : undefined}
            {...indicatorProps}
            ref={forwardedRef}
          />
        )
      }

      return null
    }
  )
)

RadioIndicator.displayName = RADIO_GROUP_INDICATOR_NAME

/* -------------------------------------------------------------------------
 * RadioGroupItem
 * ------------------------------------------------------------------------ */

const RADIO_GROUP_ITEM_NAME = 'RadioGroupItem'

type RadioGroupItemContextValue = {
  checked: boolean
  disabled?: boolean
}

const [RadioGroupItemProvider, useRadioGroupItemContext] =
  createRadioGroupContext<RadioGroupItemContextValue>(RADIO_GROUP_NAME)

const RadioGroupItemFrame = styled(
  ThemeableStack,
  {
    tag: 'button',

    variants: {
      unstyled: {
        false: {
          size: '$true',
          borderRadius: 1000,
          backgroundColor: '$background',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '$borderColor',
          padding: 0,

          hoverStyle: {
            borderColor: '$borderColorHover',
            backgroundColor: '$backgroundHover',
          },

          focusStyle: {
            borderColor: '$borderColorHover',
            backgroundColor: '$backgroundHover',
          },

          focusVisibleStyle: {
            outlineStyle: 'solid',
            outlineWidth: 2,
            outlineColor: '$outlineColor',
          },

          pressStyle: {
            borderColor: '$borderColorFocus',
            backgroundColor: '$backgroundFocus',
          },
        },
      },

      disabled: {
        true: {
          pointerEvents: 'none',
          userSelect: 'none',
          cursor: 'not-allowed',

          hoverStyle: {
            borderColor: '$borderColor',
            backgroundColor: '$background',
          },

          pressStyle: {
            borderColor: '$borderColor',
            backgroundColor: '$backgroundColor',
          },

          focusVisibleStyle: {
            outlineWidth: 0,
          },
        },
      },

      size: {
        '...size': (value, { props }) => {
          const size = Math.floor(
            getVariableValue(getSize(value)) * (props['scaleSize'] ?? 0.5)
          )
          return {
            width: size,
            height: size,
          }
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    name: RADIO_GROUP_ITEM_NAME,
  }
)

type RadioGroupItemProps = GetProps<typeof RadioGroupItemFrame> & {
  value: string
  id?: string
  labelledBy?: string
  disabled?: boolean
}

type RadioGroupItemElement = HTMLButtonElement

type ScopedRadioGroupItemProps<P> = P & {
  __scopeRadioGroupItem?: Scope
}

const RadioGroupItem = RadioGroupItemFrame.extractable(
  React.forwardRef<RadioGroupItemElement, RadioGroupItemProps>(
    (props: ScopedProps<RadioGroupItemProps>, forwardedRef) => {
      const {
        __scopeRadioGroup,
        value,
        labelledBy: ariaLabelledby,
        disabled: itemDisabled,
        ...itemProps
      } = props
      const {
        value: groupValue,
        disabled,
        required,
        onChange,
        name,
        native,
        accentColor,
      } = useRadioGroupContext(RADIO_GROUP_ITEM_NAME, __scopeRadioGroup)
      const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
      const hasConsumerStoppedPropagationRef = React.useRef(false)
      const ref = React.useRef<HTMLButtonElement>(null)
      const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node), ref)
      const isArrowKeyPressedRef = React.useRef(false)

      const isFormControl = isWeb
        ? button
          ? Boolean(button.closest('form'))
          : true
        : false

      const checked = groupValue === value

      const labelId = useLabelContext(button)
      const labelledBy = ariaLabelledby || labelId

      React.useEffect(() => {
        if (isWeb) {
          const handleKeyDown = (event: KeyboardEvent) => {
            if (ARROW_KEYS.includes(event.key)) {
              isArrowKeyPressedRef.current = true
            }
          }
          const handleKeyUp = () => {
            isArrowKeyPressedRef.current = false
          }
          document.addEventListener('keydown', handleKeyDown)
          document.addEventListener('keyup', handleKeyUp)
          return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
          }
        }
      }, [])

      if (process.env.TAMAGUI_TARGET === 'native') {
        React.useEffect(() => {
          if (!props.id) return
          if (disabled) return

          return registerFocusable(props.id, {
            focusAndSelect: () => {
              onChange?.(value)
            },
            focus: () => {},
          })
        }, [props.id, value, disabled])
      }

      const isDisabled = disabled || itemDisabled

      return (
        <RadioGroupItemProvider checked={checked} scope={__scopeRadioGroup}>
          {isWeb && native ? (
            <BubbleInput
              control={button}
              bubbles={!hasConsumerStoppedPropagationRef.current}
              name={name}
              value={value}
              checked={checked}
              required={required}
              disabled={isDisabled}
              id={props.id}
              accentColor={accentColor}
            />
          ) : (
            <>
              <RovingFocusGroup.Item
                __scopeRovingFocusGroup={RADIO_GROUP_NAME}
                asChild="except-style"
                focusable={!isDisabled}
                active={checked}
              >
                <RadioGroupItemFrame
                  // theme={checked ? 'active' : undefined}
                  data-state={getState(checked)}
                  data-disabled={isDisabled ? '' : undefined}
                  role="radio"
                  aria-labelledby={labelledBy}
                  aria-checked={checked}
                  aria-required={required}
                  disabled={isDisabled}
                  ref={composedRefs}
                  {...(isWeb && {
                    type: 'button',
                    value: value,
                  })}
                  // allow them to override all but the handlers that already compose:
                  {...itemProps}
                  onPress={composeEventHandlers(props.onPress as any, (event) => {
                    if (!checked) {
                      onChange?.(value)
                    }

                    if (isFormControl) {
                      hasConsumerStoppedPropagationRef.current =
                        event.isPropagationStopped()
                      // if radio is in a form, stop propagation from the button so that we only propagate
                      // one click event (from the input). We propagate changes from an input so that native
                      // form validation works and form events reflect radio updates.
                      if (!hasConsumerStoppedPropagationRef.current)
                        event.stopPropagation()
                    }
                  })}
                  {...(isWeb && {
                    onKeyDown: composeEventHandlers(
                      (props as React.HTMLProps<HTMLButtonElement>).onKeyDown,
                      (event) => {
                        // According to WAI ARIA, Checkboxes don't activate on enter keypress
                        if (event.key === 'Enter') event.preventDefault()
                      }
                    ),
                    onFocus: composeEventHandlers(itemProps.onFocus, () => {
                      /**
                       * Our `RovingFocusGroup` will focus the radio when navigating with arrow keys
                       * and we need to "check" it in that case. We click it to "check" it (instead
                       * of updating `context.value`) so that the radio change event fires.
                       */
                      if (isArrowKeyPressedRef.current) {
                        ;(ref.current as HTMLButtonElement)?.click()
                      }
                    }),
                  })}
                />
              </RovingFocusGroup.Item>
              {isFormControl && (
                <BubbleInput
                  isHidden
                  control={button}
                  bubbles={!hasConsumerStoppedPropagationRef.current}
                  name={name}
                  value={value}
                  checked={checked}
                  required={required}
                  disabled={isDisabled}
                />
              )}
            </>
          )}
        </RadioGroupItemProvider>
      )
    }
  )
)

/* -------------------------------------------------------------------------
 * BubbleInput
 * ------------------------------------------------------------------------ */

interface BubbleInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'checked'> {
  checked: boolean
  control: HTMLElement | null
  bubbles: boolean
  isHidden?: boolean
  accentColor?: string
}

const BubbleInput = (props: BubbleInputProps) => {
  const { checked, bubbles = true, control, isHidden, accentColor, ...inputProps } = props
  const ref = React.useRef<HTMLInputElement>(null)
  const prevChecked = usePrevious(checked)

  // Bubble checked change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!
    const inputProto = window.HTMLInputElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(
      inputProto,
      'checked'
    ) as PropertyDescriptor
    const setChecked = descriptor.set
    if (prevChecked !== checked && setChecked) {
      const event = new Event('click', { bubbles })
      setChecked.call(input, checked)
      input.dispatchEvent(event)
    }
  }, [prevChecked, checked, bubbles])

  return (
    <input
      type="radio"
      defaultChecked={checked}
      {...inputProps}
      tabIndex={-1}
      ref={ref}
      aria-hidden={isHidden}
      style={{
        ...(isHidden
          ? {
              // ...controlSize,
              position: 'absolute',
              pointerEvents: 'none',
              opacity: 0,
              margin: 0,
            }
          : {
              appearance: 'auto',
              accentColor,
            }),

        ...props.style,
      }}
    />
  )
}

/* -------------------------------------------------------------------------
 * RadioGroup
 * ----------------------------------------------------------------------- */

type ScopedProps<P> = P & { __scopeRadioGroup?: Scope }

type TamaguiElement = HTMLElement | View

type RadioGroupElement = TamaguiElement

const RadioGroupFrame = styled(
  ThemeableStack,
  {
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
  },
  {
    name: RADIO_GROUP_NAME,
  }
)

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

const RadioGroup = withStaticProperties(
  RadioGroupFrame.extractable(
    React.forwardRef<RadioGroupElement, RadioGroupProps>(
      (props: ScopedProps<RadioGroupProps>, forwardedRef) => {
        const {
          __scopeRadioGroup,
          value: valueProp,
          defaultValue,
          onValueChange,
          disabled = false,
          required = false,
          name,
          orientation,
          native,
          accentColor,
          ...radioGroupProps
        } = props
        const [value, setValue] = useControllableState({
          prop: valueProp,
          defaultProp: defaultValue!,
          onChange: onValueChange,
        })

        return (
          <RadioGroupProvider
            scope={__scopeRadioGroup}
            value={value}
            required={required}
            onChange={setValue}
            disabled={disabled}
            name={name}
            native={native}
            accentColor={accentColor}
          >
            <RovingFocusGroup
              __scopeRovingFocusGroup={RADIO_GROUP_NAME}
              orientation={orientation as any}
              loop={true}
            >
              <RadioGroupFrame
                role="radiogroup"
                aria-orientation={orientation}
                ref={forwardedRef}
                orientation={orientation}
                data-disabled={disabled ? '' : undefined}
                {...radioGroupProps}
              />
            </RovingFocusGroup>
          </RadioGroupProvider>
        )
      }
    )
  ),
  {
    Indicator: RadioIndicator,
    Item: RadioGroupItem,
  }
)

RadioGroup.displayName = RADIO_GROUP_NAME

export { createRadioGroupScope, RadioGroup }
export type { RadioGroupProps, RadioGroupItemProps }
