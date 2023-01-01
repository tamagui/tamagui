type Value = Object | Array<any> | string | number

export type Style = { [key: string]: Value }

const v: Record<string, any> = {}

export const cache = {
  get: (key: string, valStr: string) => v[key]?.[valStr],
  set: (key: string, valStr: string, object: any) => {
    v[key] ??= {}
    v[key][valStr] = object
  },
}
