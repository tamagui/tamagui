export function proxyThemeVariables<A extends Object>(obj: A): A {
  if (process.env.NODE_ENV === 'development' && !obj) {
    // eslint-disable-next-line no-console
    console.trace(`empty value for proxyThemeVariables`, obj)
    return obj
  }
  return new Proxy<A>(obj || {}, {
    has(target, key) {
      return Reflect.has(target, removeStarting$(key))
    },
    get(target, key) {
      return Reflect.get(target, removeStarting$(key))
    },
  })
}

const removeStarting$ = (str: string | symbol) =>
  typeof str === 'string' && str[0] === '$' ? str.slice(1) : str
