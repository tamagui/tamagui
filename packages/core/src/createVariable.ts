import { isWeb } from './constants/platform'

export const IS_VARIABLE_SYMBOL = '__isVariable__'

export class Variable {
  // because we have a separate node runtime we can't do instanceof
  // ran into issues with this and it's potentially fixable but for now
  // lets just do this
  [IS_VARIABLE_SYMBOL] = true

  name: string
  val: string | number
  variable: string | number

  constructor({ val, name }: VariableIn) {
    // converting to px breaks rn
    this.val = isVariable(val) ? val.val : val
    this.name = name
    this.variable = isWeb ? `var(--${name})` : this.val
  }

  toString() {
    return `${isWeb ? this.variable : this.val}`
  }
}

type VariableIn = { val: string | number | Variable; name: string }

export const createVariable = (props: VariableIn) => new Variable(props)

export function isVariable(v: Variable | any): v is Variable {
  return v instanceof Variable || (v && v[IS_VARIABLE_SYMBOL])
}

export function getVariableValue(v: Variable | any) {
  if (isVariable(v)) {
    return v.val
  }
  return v
}
