import { isWeb } from '@tamagui/constants'
import { simpleHash } from '@tamagui/helpers'

import { getConfig } from './config'
import { CSS_VARIABLE_PREFIX } from './constants/constants'

/**
 * Should rename this to Token
 * Moving to objects for React Server Components support
 */

const IS_VAR = 'isVar'

export interface Variable<A = any> {
  [IS_VAR]?: true
  variable?: string
  val: A
  name: string
  key: string
}

export type MakeVariable<A = any> = A extends string | number ? Variable<A> : A

type VariableIn<A = any> = Pick<Variable<A>, 'key' | 'name' | 'val'>
export const createVariable = <A extends string | number | Variable = any>(
  props: VariableIn<A>,
  skipHash = false
): Variable<A> => {
  if (!skipHash && isVariable(props)) return props

  const { key, name, val } = props
  const _prefix = process.env.TAMAGUI_CSS_VARIABLE_PREFIX || CSS_VARIABLE_PREFIX
  return {
    [IS_VAR]: true,
    key: key!,
    name: skipHash ? '' : simpleHash(name, 40),
    val: val as any,
    variable: isWeb
      ? skipHash
        ? `var(--${_prefix}${name})`
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
  return v && typeof v === 'object' && IS_VAR in v
}

export function getVariable(nameOrVariable: Variable | string | any) {
  setDidGetVariableValue(true)
  if (isVariable(nameOrVariable)) {
    return variableToString(nameOrVariable)
  }
  const tokens = getConfig().tokensParsed
  return variableToString(tokens[nameOrVariable] ?? nameOrVariable)
}

let accessed = false
export const setDidGetVariableValue = (val: boolean) => (accessed = val)
export const didGetVariableValue = () => accessed

export function getVariableValue(v: Variable | any) {
  if (isVariable(v)) {
    setDidGetVariableValue(true)
    return v.val
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
  const _prefix = process.env.TAMAGUI_CSS_VARIABLE_PREFIX || CSS_VARIABLE_PREFIX
  return includeVar ? `var(--${_prefix}${name})` : name
}
