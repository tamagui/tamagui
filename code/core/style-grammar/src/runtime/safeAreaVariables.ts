export type SafeAreaEdge = 'top' | 'right' | 'bottom' | 'left'

export const safeAreaVariableNames: Readonly<Record<SafeAreaEdge, string>> = {
  top: 'safe-area-top',
  right: 'safe-area-right',
  bottom: 'safe-area-bottom',
  left: 'safe-area-left',
}

const safeAreaEdges: Readonly<Record<string, SafeAreaEdge>> = {
  [safeAreaVariableNames.top]: 'top',
  [safeAreaVariableNames.right]: 'right',
  [safeAreaVariableNames.bottom]: 'bottom',
  [safeAreaVariableNames.left]: 'left',
}

export function getSafeAreaEdge(name: string): SafeAreaEdge | undefined {
  return safeAreaEdges[name]
}
