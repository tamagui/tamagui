export let isTinted = true

export const setDocsShouldTint = (next: boolean) => {
  isTinted = next
  listeners.forEach((cb) => cb(next))
}

export const toggleDocsTinted = () => {
  setDocsShouldTint(!isTinted)
}

export const listeners = new Set<Function>()
