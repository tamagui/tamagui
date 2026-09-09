/**
 * parses CSS string values into RN object format on native,
 * preserving DynamicColorIOS objects from the token map.
 *
 * supports: backgroundImage (linear-gradient), boxShadow, textShadow
 * filter has no RN object equivalent, returns undefined (falls back to string)
 *
 * only called inside process.env.TAMAGUI_TARGET === 'native' checks,
 * so this code is dead-code-eliminated on web builds.
 */
type TokenMap = Map<string, any>;
export declare function parseNativeStyle(key: string, cssString: string, tokenMap?: TokenMap): any | undefined;
export {};
//# sourceMappingURL=parseNativeStyle.d.ts.map