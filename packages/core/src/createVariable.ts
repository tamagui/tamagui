import { isWeb } from './constants/platform'

export class Variable {
  name: string
  val: string | number
  variable: string | number

  constructor({ val, name }: VariableIn) {
    // converting to px breaks rn
    this.val = val //typeof val === 'string' ? val : `${val}px`
    this.name = name
    this.variable = isWeb ? `var(--${name})` : this.val
  }
}

type VariableIn = { val: string | number; name: string }

export const createVariable = (props: VariableIn) => new Variable(props)

export function isVariable(v: Variable | any): v is Variable {
  return v instanceof Variable
}
