import * as React from 'react';
/**
 * Creates a ref for native-only code that properly types to View.
 * Returns both ref and composedRef for component usage.
 *
 * @example
 * ```tsx
 * const { ref, composedRef } = useNativeRef(forwardedRef)
 * // ref.current is typed as View
 * ```
 */
export declare function useNativeRef(forwardedRef?: React.ForwardedRef<any>): {
    ref: React.RefObject<import("@tamagui/react-native-types").ReactNativeElement | null>;
    composedRef: (node: import("@tamagui/react-native-types").ReactNativeElement | null) => void;
};
/**
 * Creates a ref for native TextInput components.
 * Returns both ref and composedRef for component usage.
 *
 * @example
 * ```tsx
 * const { ref, composedRef } = useNativeInputRef(forwardedRef)
 * // ref.current is typed as TextInput
 * ```
 */
export declare function useNativeInputRef(forwardedRef?: React.ForwardedRef<any>): {
    ref: React.RefObject<import("@tamagui/react-native-types")._TextInputInstance | null>;
    composedRef: (node: import("@tamagui/react-native-types")._TextInputInstance | null) => void;
};
//# sourceMappingURL=useNativeRef.d.ts.map