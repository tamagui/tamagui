// const REACT_PROVIDER_TYPE: symbol = Symbol.for('react.provider') // TODO: Delete with enableRenderableContext
const REACT_CONTEXT_TYPE: symbol = Symbol.for('react.context')

export function createContext<T>(defaultValue: T): React.Context<T> {
  const context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: null as any,
    Consumer: null as any,
  }

  context.Provider = ({ children, value }) => {
    context._currentValue = value
    context._currentValue2 = value
    return children
  }
  context.Consumer = context

  return context
}
