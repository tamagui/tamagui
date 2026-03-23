import { type useEffect } from "react";
export declare const isWeb: boolean;
export declare const isBrowser: boolean;
export declare const isServer: boolean;
export declare const isClient: boolean;
/** @deprecated use isBrowser instead */
export declare const isWindowDefined: boolean;
export declare const useIsomorphicLayoutEffect: typeof useEffect;
export declare const isChrome: boolean;
export declare const isWebTouchable: boolean;
export declare const isTouchable: boolean;
export declare const isAndroid: boolean;
export declare const isIos: boolean;
export declare const isTV: boolean;
/**
* Reflects Platform.OS. TV platforms are intentionally NOT separate values:
* - Android TV has Platform.OS === 'android' (react-native-tvos behavior)
* - tvOS has Platform.OS === 'ios' (react-native-tvos behavior)
* Use `isTV` combined with `isAndroid`/`isIos` to detect specific TV platforms.
*/
export declare const currentPlatform: "web" | "ios" | "native" | "android";

//# sourceMappingURL=constants.native.d.ts.map