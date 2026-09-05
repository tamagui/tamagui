import { createRefComponent, type RefComponent } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import React from 'react'
import { getConfig } from '../config'
import {
  insertStyleRules,
  shouldInsertStyleRules,
  updateRules,
} from '../helpers/insertStyleRule'
import type { ThemeUpdateState } from '../helpers/themeUpdateState'
import {
  getInlineValuesFromProps,
  getInlineValuesKey,
  getMergedInlineTheme,
  getVariablesCSSRules,
  type InlineValues,
} from '../helpers/variables'
import type {
  ReservedThemePropName,
  RulesToInsert,
  ThemeKeys,
  VariableValIn,
} from '../types'
import { Theme } from './Theme'

type ThemeUpdateValues = string extends ThemeKeys
  ? {}
  : {
      [Key in Exclude<ThemeKeys, ReservedThemePropName>]?: VariableValIn
    }

export type ThemeUpdateProps = ThemeUpdateValues & { children?: React.ReactNode }

const useInsertEffectCompat = isWeb
  ? React.useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

const updateStates = new WeakMap<InlineValues, ThemeUpdateState>()

export function createThemeUpdateState(
  values: InlineValues,
  className?: string
): ThemeUpdateState {
  const cached = updateStates.get(values)
  if (cached) return cached
  const state: ThemeUpdateState = {
    key: getInlineValuesKey(values),
    className,
    values,
    getTheme(parentTheme, themeName, config) {
      return getMergedInlineTheme(parentTheme, values, themeName, config) as any
    },
  }
  updateStates.set(values, state)
  return state
}

export const ThemeUpdate: RefComponent<unknown, ThemeUpdateProps> = createRefComponent(
  function ThemeUpdate(props: ThemeUpdateProps, ref) {
    'use no memo'

    const config = getConfig()
    const values = getInlineValuesFromProps(props, config)
    const css =
      process.env.TAMAGUI_DID_OUTPUT_CSS ||
      process.env.TAMAGUI_TARGET === 'native' ||
      !values
        ? null
        : getVariablesCSSRules(values, config)
    let rulesToInsert: RulesToInsert | null = null
    if (css && shouldInsertStyleRules(css.identifier)) {
      updateRules(css.identifier, css.rules)
      rulesToInsert = {
        [css.identifier]: ['variables', '', css.identifier, undefined, css.rules],
      }
    }

    useInsertEffectCompat(() => {
      if (rulesToInsert) insertStyleRules(rulesToInsert)
    }, [css?.identifier])

    if (!values) return props.children

    return (
      <Theme ref={ref} _themeUpdate={createThemeUpdateState(values, css?.identifier)}>
        {props.children}
      </Theme>
    )
  }
)
