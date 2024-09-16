import { simpleHash } from '@tamagui/helpers'

import type { Variable } from './createVariable'
import { createVariable, isVariable } from './createVariable'

type DeepTokenObject<Val extends string | number = any> = {
  [key: string]: Val | DeepTokenObject<Val>
}

export type DeepVariableObject<A extends DeepTokenObject> = {
  [Key in keyof A]: A[Key] extends string | number
    ? Variable<A[Key]>
    : A[Key] extends DeepTokenObject
      ? DeepVariableObject<A[Key]>
      : never
}

const cache = new WeakMap()

// recursive...

export const createVariables = <A extends DeepTokenObject>(
  tokens: A,
  parentPath = '',
  isFont = false
): DeepVariableObject<A> => {
  if (cache.has(tokens)) return tokens

  const res: any = {}
  let i = 0
  for (let keyIn in tokens) {
    i++
    const val = tokens[keyIn]
    const isPrefixed = keyIn[0] === '$'
    const keyWithPrefix = isPrefixed ? keyIn : `$${keyIn}`
    const key = isPrefixed ? keyWithPrefix.slice(1) : keyIn

    if (isVariable(val)) {
      res[key] = val
      continue
    }
    const niceKey = simpleHash(key, 1000)
    const name =
      parentPath && parentPath !== 't-color' ? `${parentPath}-${niceKey}` : `c-${niceKey}`

    if (val && typeof val === 'object') {
      // recurse
      res[key] = createVariables(
        tokens[key] as any,
        name,
        false /* note: don't pass isFont down, we want to avoid it past the first level */
      )
      continue
    }
    const finalValue = isVariable(val)
      ? val
      : createVariable({ val, name, key: keyWithPrefix })
    res[key] = finalValue
  }

  cache.set(res, true)
  return res
}
