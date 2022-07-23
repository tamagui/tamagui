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
    let name = parentPath ? `${parentPath}-${key}` : key
    if (isFont && name.includes('_')) {
      name = name.replace(/_[a-z0-9]+/i, '')
    }
    if (isVariable(val)) {
      res[key] = val
    } else if (val && typeof val === 'object') {
      if (Array.isArray(val)) {
        res[key] = val.map((val, i) => {
          const skey = `${key}-${i}`
          const sname = parentPath ? `${name}-${skey}` : skey
          return isVariable(val)
            ? val
            : createVariable({
                val,
                key: skey,
                name: sname,
              })
        })
      } else {
        res[key] = createVariables(tokens[key] as any, name === 'color' ? '' : name)
      }
    } else {
      res[key] = isVariable(val) ? val : createVariable({ val, name, key })
    }
  }
  return res
}
