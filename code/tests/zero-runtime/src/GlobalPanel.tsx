import { View } from 'tamagui'

// deliberately a second module: its atomic rule must reach the same loaded CSS
export function GlobalPanel() {
  return <View data-testid="global-panel" width={83} height={11} />
}
