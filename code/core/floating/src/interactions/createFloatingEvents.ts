// lightweight event emitter for coordinating between interaction hooks.
// when one hook changes open state (e.g. dismiss via escape), others
// need to know so they can clear their timers and prevent reopening.

export type FloatingEvents = {
  emit(event: string, data?: any): void
  on(event: string, handler: (data?: any) => void): void
  off(event: string, handler: (data?: any) => void): void
}

export function createFloatingEvents(): FloatingEvents {
  const listeners = new Map<string, Set<(data?: any) => void>>()

  return {
    emit(event, data) {
      listeners.get(event)?.forEach((fn) => fn(data))
    },
    on(event, handler) {
      let set = listeners.get(event)
      if (!set) {
        set = new Set()
        listeners.set(event, set)
      }
      set.add(handler)
    },
    off(event, handler) {
      const set = listeners.get(event)
      if (set) {
        set.delete(handler)
        if (set.size === 0) listeners.delete(event)
      }
    },
  }
}
