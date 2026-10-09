import type { ParsedTransition } from "./transition";
export type NativeTransitionPlatform = "android" | "ios";
export interface NativeTransitionTarget {
	platform: NativeTransitionPlatform;
	reactNativeMinor: number;
	androidApi?: number;
}
export interface NativeTransitionCapability {
	properties: readonly string[];
	minimumReactNativeMinor: number;
	platforms: readonly NativeTransitionPlatform[];
	interpolation: "continuous" | "discrete";
	note: string;
}
export interface NativeTransitionDiagnostic {
	code: "native-transition-css-global" | "native-transition-property" | "native-transition-timing" | "native-transition-delay" | "native-transition-behavior" | "native-transition-filter";
	property?: string;
	message: string;
}
export type NativeTransitionValidationResult = {
	ok: true;
} | {
	ok: false;
	diagnostics: readonly NativeTransitionDiagnostic[];
};
/**
* rn animated capability changes relevant to the v3 rn >= 0.82 target.
*
* 0.84 added broad non-layout native-driver coverage. 0.85 added layout
* properties through the shared Animated/Reanimated backend.
*/
export declare const nativeTransitionCapabilities: readonly NativeTransitionCapability[];
/**
* validates a normalized transition for a concrete native target.
*
* pass the resolved destination values when property support depends on the
* value, as with filter functions.
*/
export declare function validateNativeTransition(transition: ParsedTransition, target: NativeTransitionTarget, transitionedValues?: Readonly<Record<string, string>>): NativeTransitionValidationResult;

//# sourceMappingURL=transitionNative.d.ts.map