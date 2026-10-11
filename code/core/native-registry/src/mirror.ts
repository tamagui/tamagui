/**
 * JS mirror of the engine's scope state.
 *
 * React re-renders of a linked component must never revert a native commit,
 * so components read their current state name from this mirror at render
 * time (without subscribing) and always paint styles that match what the
 * engine last committed. The mirror is updated synchronously before the
 * native call in setStateName, so render and engine can never disagree.
 */
const scopeStates = new Map<string, string>()

export const ROOT_SCOPE = ''

export function getMirroredStateName(scopeId: string = ROOT_SCOPE): string | undefined {
  return (
    scopeStates.get(scopeId) ??
    (scopeId === ROOT_SCOPE ? undefined : scopeStates.get(ROOT_SCOPE))
  )
}

export function setMirroredStateName(scopeId: string, stateName: string): void {
  scopeStates.set(scopeId, stateName)
}

export function removeMirroredScope(scopeId: string): void {
  scopeStates.delete(scopeId)
}

export function resetMirror(): void {
  scopeStates.clear()
}
