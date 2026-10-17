/**
 * Structural (unstyled) frames for toast items — the behavior-first primitives.
 * Shared across web and native — imported by ToastComposable.
 *
 * These keep ONLY the structural allowlist (layout, hit targets, positioning,
 * cursor/userSelect, native `render:'button'`). The v2-look skin (background,
 * border, radius, padding, shadow, hover/press/focus color styling, text color)
 * lives in the tamagui skin (code/ui/tamagui/src/components/Toast.tsx), which is
 * also the shadcn registry source.
 */
export declare const ToastPositionWrapper: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const ToastItemFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const ToastCloseFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const ToastActionFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const DefaultCloseIcon: () => import("react").JSX.Element;
//# sourceMappingURL=ToastItemFrame.d.ts.map