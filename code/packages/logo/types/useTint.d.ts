import type { ThemeName } from "tamagui";
export declare const onTintChange: (listener: (cur: number) => void) => () => void;
export declare const setTintIndex: (next: number) => void;
export declare function getDocsSection(pathname: string): "compiler" | "ui" | "core" | null;
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

//# sourceMappingURL=useTint.d.ts.map