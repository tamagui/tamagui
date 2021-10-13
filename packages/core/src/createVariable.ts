export class Variable {
  val: string
  name: string
  variable: string
  constructor({ val, name }: VariableIn) {
    this.val = typeof val === 'string' ? val : `${val}px`
    this.name = name
    this.variable = `var(--${name})`
  }
}

type VariableIn = { val: string | number; name: string }

export const createVariable = (props: VariableIn) => new Variable(props)

export function isVariable(v: Variable | any): v is Variable {
  return v instanceof Variable
}
