import { getSafeArea, hasSafeAreaSetup } from '@tamagui/native'

const safeArea = getSafeArea()

export function hasSafeAreaTracker(): boolean {
  return hasSafeAreaSetup()
}

export function SafeAreaTracker() {
  safeArea.state.useSafeAreaInsets!()
  return null
}
