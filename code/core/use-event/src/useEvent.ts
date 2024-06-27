import { useGet } from './useGet'

type AnyFunction = (...args: any[]) => any

export function useEvent<T extends AnyFunction>(callback?: T): T {
  return useGet(callback, defaultValue, true) as T
}

const defaultValue = () => {
  throw new Error('Cannot call an event handler while rendering.')
}
