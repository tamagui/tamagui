export const REACT_CONSUMER_TYPE: symbol = Symbol.for('react.consumer')
const REACT_PROVIDER_TYPE: symbol = Symbol.for('react.provider') // TODO: Delete with enableRenderableContext
const REACT_CONTEXT_TYPE: symbol = Symbol.for('react.context')

const enableRenderableContext = false

export function createContext<T>(defaultValue: T): React.Context<T> {
  const context: React.Context<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: null,
    Consumer: null,
  } as any

  if (enableRenderableContext) {
    context.Provider = context
    context.Consumer = {
      $$typeof: REACT_CONSUMER_TYPE,
      _context: context,
    }
  } else {
    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context,
    }
    context.Consumer = context
  }

  return context
}
