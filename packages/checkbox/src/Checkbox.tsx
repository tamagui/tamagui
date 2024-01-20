// fork of radix
// https://github.com/radix-ui/primitives/tree/main/packages/react/checkbox/src/Checkbox.tsx

import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import {
  GetProps,
  SizeTokens,
  TamaguiElement,
  createStyledContext,
  getVariableValue,
  styled,
  useProps,
  useTheme,
} from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { registerFocusable } from '@tamagui/focusable'
import { getFontSize } from '@tamagui/font-size'
import { getSize } from '@tamagui/get-token'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { useLabelContext } from '@tamagui/label'
import { ButtonNestingContext, ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { usePrevious } from '@tamagui/use-previous'
import * as React from 'react'

export const CheckboxStyledContext = createStyledContext({
  size: '$true' as SizeTokens,
  scaleIcon: 1,
})

export type CheckedState = boolean | 'indeterminate'

export function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
  return checked === 'indeterminate'
}

export function getState(checked: CheckedState) {
  return isIndeterminate(checked) ? 'indeterminate' : checked ? 'checked' : 'unchecked'
}

type InputProps = any //Radix.ComponentPropsWithoutRef<'input'>
interface BubbleInputProps extends Omit<InputProps, 'checked'> {
  checked: CheckedState
  control: HTMLElement | null
  bubbles: boolean

  isHidden?: boolean
}

export const BubbleInput = (props: BubbleInputProps) => {
  const { checked, bubbles = true, control, isHidden, ...inputProps } = props
  const ref = React.useRef<HTMLInputElement>(null)
  const prevChecked = usePrevious(checked)
  //   const controlSize = useSize(control)

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
      input.indeterminate = isIndeterminate(checked)
      setChecked.call(input, isIndeterminate(checked) ? false : checked)
      input.dispatchEvent(event)
    }
  }, [prevChecked, checked, bubbles])

  return (
    <input
      type="checkbox"
      defaultChecked={isIndeterminate(checked) ? false : checked}
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
              accentColor: 'var(--color6)',
            }),

        ...props.style,
      }}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'CheckboxIndicator'

const CheckboxIndicatorFrame = styled(ThemeableStack, {
  // use Checkbox for easier themes
  name: INDICATOR_NAME,
  context: CheckboxStyledContext,
})

type CheckboxIndicatorFrameProps = GetProps<typeof CheckboxIndicatorFrame>

export type CheckboxIndicatorProps = CheckboxIndicatorFrameProps & {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
  /**
   * Used to disable passing styles down to children.
   */
  disablePassStyles?: boolean
}

const CheckboxIndicator = CheckboxIndicatorFrame.extractable(
  React.forwardRef<TamaguiElement, CheckboxIndicatorProps>(
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
          <CheckboxIndicatorFrame
            data-state={getState(context.state)}
            data-disabled={context.disabled ? '' : undefined}
            pointerEvents="none"
            {...indicatorProps}
            ref={forwardedRef}
          >
            {children}
          </CheckboxIndicatorFrame>
        )

      return null
    }
  )
)

CheckboxIndicator.displayName = INDICATOR_NAME

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_NAME = 'Checkbox'

export const CheckboxFrame = styled(ThemeableStack, {
  name: CHECKBOX_NAME,
  tag: 'button',

  context: CheckboxStyledContext,
  variants: {
    unstyled: {
      false: {
        size: '$true',
        backgroundColor: '$background',
        alignItems: 'center',
        justifyContent: 'center',
        pressTheme: true,
        focusable: true,
        borderWidth: 1,
        borderColor: '$borderColor',

        hoverStyle: {
          borderColor: '$borderColorHover',
        },

        focusStyle: {
          borderColor: '$borderColorFocus',
          outlineStyle: 'solid',
          outlineWidth: 2,
          outlineColor: '$borderColorFocus',
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

        focusStyle: {
          outlineWidth: 0,
        },
      },
    },

    size: {
      '...size': (val, { tokens }) => {
        const radiusToken = getVariableValue(getSize(val)) / 8
        return {
          borderRadius: radiusToken,
        }
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

type ScopedProps<P> = P & { __scopeCheckbox?: Scope }
const [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME)

type CheckboxContextValue = {
  state: CheckedState
  disabled?: boolean
}

const [CheckboxProvider, useCheckboxContext] =
  createCheckboxContext<CheckboxContextValue>(CHECKBOX_NAME)

type CheckboxFrameProps = GetProps<typeof CheckboxFrame>

type CheckboxExtraProps = {
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

export type CheckboxProps = Omit<CheckboxFrameProps, 'checked' | 'defaultChecked'> &
  CheckboxExtraProps

const CheckboxComponent = CheckboxFrame.styleable<CheckboxExtraProps>(function Checkbox(
  props: ScopedProps<CheckboxProps>,
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

  const isInsideButton = React.useContext(ButtonNestingContext)
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null)
  const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node as any))
  const hasConsumerStoppedPropagationRef = React.useRef(false)
  const propsActive = useProps(props)
  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = isWeb ? (button ? Boolean(button.closest('form')) : true) : false
  const [checked = false, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked!,
    onChange: onCheckedChange,
  })

  // TODO: this could be null - fix the type
  const styledContext = React.useContext(CheckboxStyledContext)
  const adjustedSize = getVariableValue(
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
    <CheckboxProvider scope={__scopeCheckbox} state={checked} disabled={!!disabled}>
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
          <CheckboxFrame
            width={size}
            height={size}
            tag={isInsideButton ? 'span' : 'button'}
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
            onPress={composeEventHandlers(props.onPress as any, (event) => {
              setChecked((prevChecked) =>
                isIndeterminate(prevChecked) ? true : !prevChecked
              )
              if (isFormControl) {
                hasConsumerStoppedPropagationRef.current = event.isPropagationStopped()
                // if checkbox is in a form, stop propagation from the button so that we only propagate
                // one click event (from the input). We propagate changes from an input so that native
                // form validation works and form events reflect checkbox updates.
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
          </CheckboxFrame>

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
})

export const Checkbox = withStaticProperties(CheckboxComponent, {
  Indicator: CheckboxIndicator,
  Props: CheckboxStyledContext.Provider,
})

export { createCheckboxScope }
