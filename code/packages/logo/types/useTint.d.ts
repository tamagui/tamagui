import React from "react";
import { type ThemeName } from "tamagui";
export declare const onTintChange: (listener: (cur: number) => void) => () => void;
export declare const setTintIndex: (next: number) => void;
export declare const setDisableTintTheme: (disable: boolean) => void;
export declare const getDisableTintTheme: () => boolean;
export declare function getDocsSection(pathname: string): "compiler" | "ui" | "core" | null;
export declare const InitialPathContext: React.Context<number>;
export declare const useTint: (altOffset?: number) => {
	tints: ThemeName[];
	tintIndex: number;
	tintAltIndex: number;
	tint: ThemeName;
	tintAlt: ThemeName;
	setTintIndex: (next: number) => void;
	setNextTintFamily: () => void;
	setNextTint: () => void;
	setDisableTintTheme: (disable: boolean) => void;
	disableTintTheme: boolean;
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