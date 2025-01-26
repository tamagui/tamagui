import type { JSX } from "react/jsx-runtime";
import type { ThemeName, ThemeProps } from "tamagui";
export declare const initialTint = 3;
export declare const onTintChange: (listener: (cur: number) => void) => () => void;
export declare const setTintIndex: (next: number) => void;
export declare const useTint: (altOffset?: number) => {
	tints: ThemeName[];
	tintIndex: number;
	tintAltIndex: number;
	tint: ThemeName;
	tintAlt: ThemeName;
	setTintIndex: (next: number) => void;
	setNextTintFamily: () => void;
	setNextTint: () => void;
	name: string;
	families: {
		tamagui: string[];
		xmas: string[];
		easter: string[];
		halloween: string[];
		valentine: string[];
		lunar: string[];
	};
};
export declare const ThemeTint: ({ disable, children,...rest }: ThemeProps & { disable?: boolean }) => JSX.Element;
export declare const ThemeTintAlt: ({ children, disable, offset,...rest }: ThemeProps & {
	disable?: boolean;
	offset?: number;
}) => JSX.Element;

//# sourceMappingURL=useTint.d.ts.map