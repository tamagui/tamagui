import { createProxy } from './createProxy'

export function proxyThemeVariables<A extends Object>(obj: A): A {
  return createProxy<A>(obj || {}, {
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
