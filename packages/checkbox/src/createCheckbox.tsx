import {
  SizeTokens,
  StackProps,
  TamaguiComponentExpectingVariants,
  TamaguiElement,
  composeEventHandlers,
  getVariableValue,
  isWeb,
  useComposedRefs,
  useProps,
  useTheme,
  withStaticProperties,
} from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import { registerFocusable } from '@tamagui/focusable'
import { getFontSize } from '@tamagui/font-size'
import { getSize } from '@tamagui/get-token'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { useLabelContext } from '@tamagui/label'
import { useControllableState } from '@tamagui/use-controllable-state'
import React from 'react'

import { BubbleInput } from './BubbleInput'
import { CheckboxIndicatorProps } from './Checkbox'
import { CheckboxStyledContext } from './CheckboxStyledContext'
import { getState, isIndeterminate } from './utils'

type ScopedProps<P> = P & { __scopeCheckbox?: Scope }
// TODO: add nested button provider
// TODO: remove all ts-ignore's
export const CHECKBOX_NAME = 'Checkbox'
export const INDICATOR_NAME = 'CheckboxIndicator'

const [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME)

export type CheckedState = boolean | 'indeterminate'

type CheckboxContextValue = {
  state: CheckedState
  disabled?: boolean
}

export type CheckboxBaseProps = {
  children?: React.ReactNode
  id?: string
  disabled?: boolean
  checked?: CheckedState
  defaultChecked?: CheckedState
  required?: boolean
  /**
   *
   * @param checked Either boolean or "indeterminate" which is meant to allow for a third state that means "neither", usually indicated by a minus sign.
   */
  onCheckedChange?(checked: CheckedState): void
  labelledBy?: string
  name?: string
  value?: string
  native?: boolean
  scaleIcon?: number
  scaleSize?: number
  sizeAdjust?: number
}

export const [CheckboxProvider, useCheckboxContext] =
  createCheckboxContext<CheckboxContextValue>(CHECKBOX_NAME)

export { createCheckboxScope }
type ExpectingVariantProps = {
  size?: SizeTokens | number
  unstyled?: boolean
}
type BaseProps = StackProps &
  Omit<CheckboxBaseProps, 'children'> & {
    children?: React.ReactNode | ((checked: boolean) => React.ReactNode)
  } & ExpectingVariantProps

type CheckboxComponent = TamaguiComponentExpectingVariants<
  BaseProps,
  ExpectingVariantProps
>

type CheckboxIndicatorComponent = TamaguiComponentExpectingVariants<StackProps, {}>

export function createCheckbox<
  F extends CheckboxComponent,
  T extends CheckboxIndicatorComponent
>({
  disableActiveTheme,
  Frame,
  Indicator,
}: {
  disableActiveTheme?: boolean
  Frame?: F
  Indicator?: T
}) {
  const CheckboxComponent = React.forwardRef<TamaguiElement, CheckboxIndicatorProps>(
    function Checkbox(
      props: ScopedProps<CheckboxBaseProps & ExpectingVariantProps>,
      forwardedRef
    ) {
      const {
        __scopeCheckbox,
        labelledBy: ariaLabelledby,
        name,
        checked: checkedProp,
        defaultChecked,
        required,
        scaleSize = 0.45,
        sizeAdjust = 0,
        disabled,
        value = 'on',
        onCheckedChange,
        native,
        scaleIcon,
        ...checkboxProps
      } = props
      const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
      const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node as any))
      const hasConsumerStoppedPropagationRef = React.useRef(false)
      const propsActive = useProps(props)
      // We set this to true by default so that events bubble to forms without JS (SSR)
      const isFormControl = isWeb
        ? button
          ? Boolean(button.closest('form'))
          : true
        : false
      const [checked = false, setChecked] = useControllableState({
        prop: checkedProp,
        defaultProp: defaultChecked!,
        onChange: onCheckedChange,
      })

      // TODO: this could be null - fix the type
      const styledContext = React.useContext(CheckboxStyledContext)
      const adjustedSize = getVariableValue(
        // @ts-ignore
        getSize(propsActive.size ?? styledContext?.size ?? '$true', {
          shift: sizeAdjust,
        })
      ) as number
      const size = scaleSize ? Math.round(adjustedSize * scaleSize) : adjustedSize

      const labelId = useLabelContext(button)
      const labelledBy = ariaLabelledby || labelId

      if (process.env.TAMAGUI_TARGET === 'native') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
          if (!props.id) return
          if (disabled) return

          return registerFocusable(props.id, {
            focusAndSelect: () => {
              setChecked((x) => !x)
            },
            focus: () => {},
          })
        }, [props.id, setChecked, disabled])
      }

      return (
        <CheckboxProvider scope={__scopeCheckbox} state={checked} disabled={disabled}>
          {isWeb && native ? (
            <BubbleInput
              control={button}
              bubbles={!hasConsumerStoppedPropagationRef.current}
              name={name}
              value={value}
              checked={checked}
              required={required}
              disabled={disabled}
              id={props.id}
            />
          ) : (
            <>
              {/* @ts-ignore */}
              <Frame
                width={size}
                height={size}
                tag="button"
                role="checkbox"
                aria-labelledby={labelledBy}
                aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
                aria-required={required}
                data-state={getState(checked)}
                data-disabled={disabled ? '' : undefined}
                disabled={disabled}
                {...checkboxProps}
                ref={composedRefs}
                {...(isWeb && {
                  type: 'button',
                  value,
                  onKeyDown: composeEventHandlers(
                    (props as React.HTMLProps<HTMLButtonElement>).onKeyDown,
                    (event) => {
                      // According to WAI ARIA, Checkboxes don't activate on enter keypress
                      if (event.key === 'Enter') event.preventDefault()
                    }
                  ),
                })}
                // @ts-ignore
                onPress={composeEventHandlers(props.onPress as any, (event) => {
                  setChecked((prevChecked) =>
                    isIndeterminate(prevChecked) ? true : !prevChecked
                  )
                  if (isFormControl) {
                    // @ts-ignore
                    hasConsumerStoppedPropagationRef.current =
                      event.isPropagationStopped()
                    // if checkbox is in a form, stop propagation from the button so that we only propagate
                    // one click event (from the input). We propagate changes from an input so that native
                    // form validation works and form events reflect checkbox updates.
                    // @ts-ignore
                    if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation()
                  }
                })}
              >
                <CheckboxStyledContext.Provider
                  size={propsActive.size ?? styledContext?.size ?? '$true'}
                  scaleIcon={scaleIcon ?? styledContext?.scaleIcon ?? 1}
                >
                  {propsActive.children}
                </CheckboxStyledContext.Provider>
              </Frame>
              {isWeb && isFormControl ? (
                <BubbleInput
                  isHidden
                  control={button}
                  bubbles={!hasConsumerStoppedPropagationRef.current}
                  name={name}
                  value={value}
                  checked={checked}
                  required={required}
                  disabled={disabled}
                />
              ) : null}
            </>
          )}
        </CheckboxProvider>
      )
    }
  )

  const CheckboxIndicator = React.forwardRef<TamaguiElement, CheckboxIndicatorProps>(
    (props: ScopedProps<CheckboxIndicatorProps>, forwardedRef) => {
      const {
        __scopeCheckbox,
        children: childrenProp,
        forceMount,
        disablePassStyles,
        ...indicatorProps
      } = props
      if (process.env.NODE_ENV === 'development' && !childrenProp) {
        console.warn(
          `Warning: You created a Checkbox.Indicator without passing an child prop for it to use as an icon.`
        )
      }
      const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox)
      const styledContext = React.useContext(CheckboxStyledContext)
      const iconSize =
        (typeof styledContext.size === 'number'
          ? styledContext.size * 0.65
          : getFontSize(styledContext.size as any)) * styledContext.scaleIcon
      const theme = useTheme()
      const getThemedIcon = useGetThemedIcon({ size: iconSize, color: theme.color })

      const childrens = React.Children.toArray(childrenProp)
      const children = childrens.map((child) => {
        if (disablePassStyles || !React.isValidElement(child)) {
          return child
        }
        return getThemedIcon(child)
      })

      if (forceMount || isIndeterminate(context.state) || context.state === true)
        return (
          // @ts-ignore
          <Indicator
            data-state={getState(context.state)}
            data-disabled={context.disabled ? '' : undefined}
            // @ts-ignore
            pointerEvents="none"
            {...indicatorProps}
            ref={forwardedRef}
          >
            {children}
          </Indicator>
        )

      return null
    }
  )

  return withStaticProperties(CheckboxComponent, {
    Indicator: CheckboxIndicator,
    Props: CheckboxStyledContext.Provider,
  })
}
