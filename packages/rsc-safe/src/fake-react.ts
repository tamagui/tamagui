import { createContext as _createContext } from './createContext'

export const useRef = <T>(value: T) => {
  return { current: value }
}

export const useState = <T>(value: T): [T, (value: T) => void] => {
  return [
    value,
    (state: T | ((prev: T) => any)) => {
      if (typeof state === 'function') {
        value = (state as Function)(value)
      } else {
        value = state
      }
    },
  ]
}

export const useEffect = (callback: () => void, deps?: any[]): any => {
  return
}

export const useMemo = <T, D>(callback: () => T, deps: React.DependencyList): T => {
  return callback()
}

// for useContext try to read default value from context when on server
export const useContext = <T>(context: React.Context<T>): T => {
  return (context as any)._value.value as T
}

export const createContext = _createContext

export const useSyncExternalStore = (a: any, b: any, c: any) => {
  return {}
}
