import { Variable, createVariable, isVariable } from './createVariable'

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

export const createVariables = <A extends DeepTokenObject>(
  tokens: A,
  parentPath = '',
  isFont = false
): DeepVariableObject<A> => {
  const res: any = {}
  for (const key in tokens) {
    const val = tokens[key]
    if (isVariable(val)) {
      res[key] = val
      continue
    }
    let name = parentPath ? `${parentPath}-${key}` : key
    if (isFont && name.includes('_')) {
      name = name.replace(/_[a-z0-9]+/i, '')
    }
    if (val && typeof val === 'object') {
      // recurse
      res[key] = createVariables(tokens[key] as any, isFont ? 'f' : name)
      continue
    }
    res[key] = isVariable(val) ? val : createVariable({ val, name, key })
  }
  return res
}
