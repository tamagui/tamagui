// used for focusing on native

type Focusable = { focus: Function }

const InputsMap = new Map<string, Focusable>()

export const registerFocusable = (id: string, input: Focusable) => {
  if (InputsMap.has(id)) {
    console.warn(`Warning, duplicate ID for input: ${id}`)
  }
  InputsMap.set(id, input)
  return () => {
    InputsMap.delete(id)
  }
}

export const unregisterFocusable = (id: string) => {
  InputsMap.delete(id)
}

export const focusFocusable = (id: string) => {
  const input = InputsMap.get(id)
  input?.focus()
}
