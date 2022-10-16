type Value = Object | Array<any> | string | number

export type Style = { [key: string]: Value }

class Cache {
  v: Record<string, any> = {}

  get(key: string, valStr: string) {
    return this.v[key]?.[valStr]
  }

  set(key: string, valStr: string, object: any) {
    this.v[key] ??= {}
    this.v[key][valStr] = object
  }
}

export const cache = new Cache()
