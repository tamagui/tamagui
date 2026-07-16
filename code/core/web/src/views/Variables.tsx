import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import React from 'react'
import { getConfig } from '../config'
import { getVariablesCSSRules } from '../helpers/variables'
import {
  insertStyleRules,
  shouldInsertStyleRules,
  updateRules,
} from '../helpers/insertStyleRule'
import type { RulesToInsert, VariablesProps } from '../types'

const useInsertEffectCompat =
  process.env.TAMAGUI_TARGET === 'native'
    ? () => {}
    : React.useInsertionEffect || useIsomorphicLayoutEffect

let didWarnNative = false

/**
 * Anonymous inline theme patch: redefines theme keys and config-declared
 * custom variables for the subtree. On web this is pure CSS custom property
 * redefinition — consumers restyle with zero re-renders. dark/light values
 * compile under scheme-scoped selectors.
 *
 * See plans/variables.md. Native support (inline theme layer) lands in the
 * follow-up packet; until then Variables is a no-op passthrough on native.
 */
export function Variables(props: VariablesProps) {
  if (process.env.TAMAGUI_TARGET === 'native') {
    if (process.env.NODE_ENV === 'development' && !didWarnNative) {
      didWarnNative = true
      console.warn(
        `[tamagui] <Variables> is not yet applied on native (web-only for now), rendering children unchanged`
      )
    }
    return props.children as any
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
      {props.children}
    </span>
  )
}

const displayContents = { display: 'contents' } as const
