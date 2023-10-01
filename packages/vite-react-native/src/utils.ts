const disposers = new Set<Function>()

export function registerDispose(cb: () => void) {
  disposers.add(cb)
}

export function disposeAll() {
  disposers.forEach((cb) => cb())
}
