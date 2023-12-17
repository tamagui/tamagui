import { GetProps, getVariableValue, styled } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import { ThemeableStack } from '@tamagui/stacks'
import * as React from 'react'

import { CheckboxStyledContext } from './CheckboxStyledContext'
import { CHECKBOX_NAME, CheckedState, CreateCheckboxProps } from './createCheckbox'

type CheckboxFrameProps = GetProps<typeof CheckboxFrame>
type InputProps = any //Radix.ComponentPropsWithoutRef<'input'>

export interface BubbleInputProps extends Omit<InputProps, 'checked'> {
  checked: CheckedState
  control: HTMLElement | null
  bubbles: boolean

  isHidden?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'CheckboxIndicator'

export const CheckboxIndicatorFrame = styled(ThemeableStack, {
  // use Checkbox for easier themes
  name: INDICATOR_NAME,
  context: CheckboxStyledContext,
})

export type CheckboxIndicatorProps = {
  children?: React.ReactNode

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

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

export type CheckboxProps = Omit<CheckboxFrameProps, 'checked' | 'defaultChecked'> &
  CreateCheckboxProps

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
