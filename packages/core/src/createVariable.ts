import { isWeb } from './constants/platform'
import { VariableColorVal } from './types'

/**
 * Should rename this to Token
 * Moving to objects for React Server Components support
 */

const IS_VAR = '__isVar__'

export type VariableValue = string | number

type VariableIn<A extends VariableValue = VariableValue> = {
  val: A
  name: string
  key: string
  isFloating?: boolean
}

export type Variable<A extends VariableValue = VariableValue> = VariableIn<A> & {
  [IS_VAR]?: true
  variable?: string
}

export const createVariable = <A extends string | number = any>(props: VariableIn<A>) => {
  if (isVariable(props)) {
    return props
  }
  return {
    [IS_VAR]: true,
    // @ts-ignore
    ...props,
    variable: isWeb ? createCSSVariable(props.name) : '',
  }
}

// on the client maybe we can change the prototype of variable object toString to keep backwards compat
export function variableToString(vrble?: Variable | VariableColorVal) {
  if (!vrble) return ''
  if (typeof vrble === 'string') return vrble
  return `${isWeb ? vrble.variable : vrble.val}`
}

export function isVariable(v: Variable | any): v is Variable {
  return !!(v && v[IS_VAR])
}

export function getVariableValue(v: Variable | any) {
  if (isVariable(v)) return v.val
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
      // eslint-disable-next-line no-console
      console.trace('createCSSVariable invalid name', nameProp)
      return ``
    }
  }
  let name = ''
  for (let i = 0; i < nameProp.length; i++) {
    const code = nameProp.charCodeAt(i)
    if (
      // A-Z
      (code >= 65 && code <= 90) ||
      // a-z
      (code >= 97 && code <= 122) ||
      // _
      code == 95 ||
      // -
      code === 45 ||
      // 0-9
      (code >= 48 && code <= 57)
    ) {
      name += nameProp[i]
    } else {
      // allow any name but turn it into a stringified num
      name += `-c${code}-`
    }
  }
  return includeVar ? `var(--${name})` : name
}
