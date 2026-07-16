import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import React from 'react'
import { getConfig } from '../config'
import { getVariablesCSSRules } from '../helpers/variables'
import {
  insertStyleRules,
  shouldInsertStyleRules,
  updateRules,
} from '../helpers/insertStyleRule'
import { useThemeWithState } from '../hooks/useTheme'
import { ThemeStateContext } from '../hooks/useThemeState'
import type { RulesToInsert, VariablesProps } from '../types'

const useInsertEffectCompat = isWeb
  ? React.useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

/**
 * Anonymous inline theme patch: redefines theme keys and config-declared
 * custom variables for the subtree. See plans/variables.md.
 *
 * Both platforms provide an inline theme layer (a merged theme riding the
 * existing theme-state subscription) so JS theme readers (useTheme().val,
 * animation drivers) see patched values. On web, styles additionally compile
 * to CSS custom properties on this node, so styled consumers restyle with
 * zero re-renders and dark/light values apply via scheme-scoped selectors.
 */
export function Variables(props: VariablesProps) {
  const inlineValues = {
    values: props.values,
    dark: props.dark,
    light: props.light,
  }

  // forThemeView=true: descendants subscribe under this state id and get
  // scheduled when the values (folded into propsKey) change
  const [, themeState] = useThemeWithState({ inlineValues }, false, true)

  let children: React.ReactNode = (
    <ThemeStateContext.Provider value={themeState.id}>
      {props.children}
    </ThemeStateContext.Provider>
  )

  if (process.env.TAMAGUI_TARGET === 'native') {
    return children
  }

  const res = getVariablesCSSRules(props, getConfig())

  const rulesToInsert: RulesToInsert = {}
  if (res && shouldInsertStyleRules(res.identifier)) {
    updateRules(res.identifier, res.rules)
    rulesToInsert[res.identifier] = ['variables', '', res.identifier, undefined, res.rules]
  }

  useInsertEffectCompat(() => {
    insertStyleRules(rulesToInsert)
  }, [res?.identifier])

  return (
    <span
      className={`is_Variables _dsp_contents${res ? ` ${res.identifier}` : ''}`}
      style={displayContents}
    >
      {children}
    </span>
  )
}

const displayContents = { display: 'contents' } as const
