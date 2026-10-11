import { Text, View } from 'tamagui'

// Rule 2, reported by reference erasure, so this module carries nothing else.
const isWide = typeof window !== 'undefined' && window.innerWidth > 600
const Which = isWide ? View : Text

export function Delta() {
  return <Which data-testid="delta" />
}
