import { Text, useTheme } from 'tamagui'

// Rule 7, reported by reference erasure, so this module carries nothing else.
export function Epsilon() {
  const theme = useTheme()
  return <Text data-testid="epsilon">{theme.background?.val}</Text>
}
