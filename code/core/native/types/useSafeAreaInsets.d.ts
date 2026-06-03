import type { SafeAreaInsets } from "./types";
/**
* Live safe-area insets read from react-native-safe-area-context.
*
* Returns zeroed insets on web (use CSS env() there) or when no
* SafeAreaProvider is mounted. Reactive — re-renders on rotation / inset change.
*
* Prefer this over getSafeArea().getInsets() inside components: getInsets()
* returns non-reactive initial metrics and silently returns 0 when the
* @tamagui/native instance is duplicated or setup-safe-area didn't run against
* the instance you read.
*/
export declare function useSafeAreaInsets(): SafeAreaInsets;

//# sourceMappingURL=useSafeAreaInsets.d.ts.map