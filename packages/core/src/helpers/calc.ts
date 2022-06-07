import { isWeb } from '../constants/platform'
import { getVariableVariable } from '../createVariable'
import { SizeTokens, SpaceTokens } from '../types'

export type CalcVal = string | number | SizeTokens | SpaceTokens

export const calc = (aProp: CalcVal, operator: '+' | '-' | '/' | '*', bProp: CalcVal) => {
  const [a, b] = [aProp, bProp].map(convertToVariableOrNumber)
  if (isWeb) {
    return `calc(${a} ${operator} ${b})`
  }
  switch (operator) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '/':
      return a / b
    case '*':
      return a * b
  }
}

const convertToVariableOrNumber = (v: any) => {
  const varOrVal = getVariableVariable(v)
  if (typeof varOrVal === 'number') {
    return isWeb ? `${varOrVal}px` : varOrVal
  }
  return +varOrVal
}
