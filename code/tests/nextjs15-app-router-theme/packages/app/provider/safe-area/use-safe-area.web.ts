// I don't use the real useSafeAreaInsets() hook, since
// 1) the SafeAreaProvider forces you to render null on Web until it measures
// 2) you might not need to support it, unless you're doing landscape stuff
// 3) react-native-safe-area-context has a massive import on Web
// see: https://github.com/th3rdwave/react-native-safe-area-context/pull/189#issuecomment-815274313
// 4) most importantly, I think you can just use the env(safe-area-inset-bottom) CSS variable instead
// after all, safe area code is few-and-far-between, so if you have to write some platform-speciifc code for it,
// that is probably better than a massive bundle size for little benefit

import type { useSafeArea as nativeHook } from './use-safe-area'

const area = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,

  // you could also use CSS env variables like below:
  // but you'll have to be sure to override the types for `useSafeArea`
  // and make sure to never add numbers and strings when you consue useSafeArea
  // just keep in mind that the env() doesn't work on older browsers I think

  // top: `env(safe-area-inset-top)`,
  // right: `env(safe-area-inset-right)`,
  // bottom: `env(safe-area-inset-bottom)`,
  // left: `env(safe-area-inset-left)`,
}

export function useSafeArea(): ReturnType<typeof nativeHook> {
  return area
}
