import type { ThemeName } from "tamagui";
type ChangeHandler = (next: TintFamily) => void;
declare const familiesValues: {
	tamagui: ThemeName[];
	xmas: ThemeName[];
	easter: ThemeName[];
	halloween: ThemeName[];
	valentine: ThemeName[];
	lunar: ThemeName[];
};
type Family = keyof typeof familiesValues;
type Families = { [key in Family] : ThemeName[] };
declare const families: Families;
type TintFamily = keyof typeof families;
export declare function getTints(): {
	name: string;
	tints: ThemeName[];
	families: Families;
};
export declare function useTints(): {
	name: string;
	tints: ThemeName[];
	families: Families;
};
export declare function setTintFamily(next: TintFamily): void;
export declare const setNextTintFamily: () => void;
export declare const onTintFamilyChange: (cb: ChangeHandler) => () => void;
export {};

//# sourceMappingURL=tints.d.ts.map