export let isTinted = true

export const setTinted = (next: boolean) => {
  isTinted = next
  listeners.forEach((cb) => cb(next))
}

export const toggleTinted = () => {
  setTinted(!isTinted)
}

export const listeners = new Set<Function>()
