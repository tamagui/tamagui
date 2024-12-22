import { isWeb } from '@tamagui/constants'
import { simpleHash } from '@tamagui/helpers'

import { getConfig } from './config'
import type { TokenCategories } from './types'

/**
 * Should rename this to Token
 * Moving to objects for React Server Components support
 */

export interface Variable<A = any> {
  isVar: true
  variable?: string
  val: A
  name: string
  key: string
}

export type MakeVariable<A = any> = A extends string | number ? Variable<A> : A

function constructCSSVariableName(name: string) {
  return `var(--${process.env.TAMAGUI_CSS_VARIABLE_PREFIX || ''}${name})`
}

type VariableIn<A = any> = Pick<Variable<A>, 'key' | 'name' | 'val'>

export const createVariable = <A extends string | number | Variable = any>(
  props: VariableIn<A>,
  skipHash = false
): Variable<A> => {
  if (!skipHash && isVariable(props)) return props
  const { key, name, val } = props
  return {
    isVar: true,
    key,
    name: skipHash ? name : simpleHash(name, 40),
    val,
    variable: isWeb
      ? skipHash
        ? constructCSSVariableName(name)
        : createCSSVariable(name)
      : '',
  }
}

// could do weakmap cache
export function variableToString(vrble?: any, getValue = false) {
  if (isVariable(vrble)) {
    if (!getValue && isWeb && vrble.variable) {
      return vrble.variable
    }
    return `${vrble.val}`
  }
  return `${vrble || ''}`
}

export function isVariable(v: Variable | any): v is Variable {
  return v && typeof v === 'object' && 'isVar' in v
}

export function getVariable(
  nameOrVariable: Variable | string | any,
  group: TokenCategories = 'size'
) {
  // dynamic color-like
  if (nameOrVariable?.dynamic) {
    return nameOrVariable
  }
  setDidGetVariableValue(true)
  if (isVariable(nameOrVariable)) {
    return variableToString(nameOrVariable)
  }
  const tokens = getConfig().tokensParsed
  return variableToString(tokens[group]?.[nameOrVariable] ?? nameOrVariable)
}

let accessed = false
export const setDidGetVariableValue = (val: boolean) => (accessed = val)
export const didGetVariableValue = () => accessed

export function getVariableValue(v: Variable | any, group?: TokenCategories) {
  if (isVariable(v)) {
    setDidGetVariableValue(true)
    return v.val
  }
  if (group) {
    const tokens = getConfig().tokensParsed
    const token = tokens[group]?.[v]
    if (token) {
      setDidGetVariableValue(true)
      return token.val
    }
  }
  return v
}

export function getVariableName(v: Variable | any) {
  if (isVariable(v)) return v.name
  return v
}

export function getVariableVariable(v: Variable | any) {
  if (isVariable(v)) return v.variable
  return v
}

// bugfix { space: { 0.5: 10 } } was generating var(--space-0.5) (invalid CSS):
export const createCSSVariable = (nameProp: string, includeVar = true) => {
  if (process.env.NODE_ENV === 'development') {
    if (!nameProp || typeof nameProp !== 'string') {
      throw new Error(`createCSSVariable expected string, got: ${nameProp}`)
    }
  }
  const name = simpleHash(nameProp, 60)
  return includeVar ? constructCSSVariableName(name) : name
}
