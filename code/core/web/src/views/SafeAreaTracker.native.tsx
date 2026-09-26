import { getSafeArea, hasSafeAreaSetup } from '@tamagui/native'

export function hasSafeAreaTracker(): boolean {
  return hasSafeAreaSetup()
}

export function SafeAreaTracker() {
  getSafeArea().state.useSafeAreaInsets!()
  return null
}
