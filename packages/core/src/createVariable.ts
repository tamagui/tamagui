import { isWeb } from './constants/platform'

const IS_VARIABLE_SYMBOL = '__isVariable__'

type VariableIn<A extends string | number = any> = {
  val: A
  name: string
  key: string
  isFloating?: boolean
}

export class Variable<A extends string | number = any> {
  // because we have a separate node runtime we can't do instanceof
  // ran into issues with this and it's potentially fixable but for now
  // lets just do this
  [IS_VARIABLE_SYMBOL] = true

  // original key => in themes maps to the base variable key
  key: string

  // CSS name => in themes generic
  name: string

  // value
  val: A

  // full CSS variable using name
  variable: string

  isFloating = false

  constructor(props: VariableIn) {
    const { val, name, key, isFloating } = props
    // converting to px breaks rn
    this.val = isVariable(val) ? val.val : val
    this.name = name
    this.key = key
    this.variable = isWeb ? createCSSVariable(name) : ''
    if (isFloating) {
      this.isFloating = true
    }
  }

  toString() {
    return `${isWeb ? this.variable : this.val}`
  }
}

export const createVariable = <A extends string | number = any>(props: VariableIn<A>) => {
  if (isVariable(props)) {
    return props
  }
  return new Variable<A>(props)
}

export function isVariable(v: Variable | any): v is Variable {
  return !!(v instanceof Variable || (v && v[IS_VARIABLE_SYMBOL]))
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
