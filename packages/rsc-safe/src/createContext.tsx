export function createContext(defaultValue) {
  const _value = {
    value: defaultValue,
  }

  function Provider({ value, children }) {
    _value.value = value
    return children
  }

  return { Provider, _value }
}
