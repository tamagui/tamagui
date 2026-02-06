import type { SizeTokens, Token } from "@tamagui/core";
import type { IconSizing } from "@tamagui/core";
type UseIconSizeOpts = {
	sizeToken: SizeTokens | Token | number | undefined;
	scaleIcon?: number;
};
/**
* resolves icon size based on the iconSizing setting from Configuration context.
*
* each component passes its own default scaleIcon (e.g. 0.5 for Button, 0.65 for Checkbox).
* the user's scaleIcon prop should override the component default before passing here.
*
* returns a number (pixel size) or undefined (let icon self-size in font-* mode).
*/
export declare const useIconSize: (opts: UseIconSizeOpts) => number | undefined;
type GetIconSizeOpts = UseIconSizeOpts & {
	iconSizing: IconSizing;
};
export declare const getIconSize: (opts: GetIconSizeOpts) => number | undefined;
export {};

//# sourceMappingURL=useIconSize.d.ts.map