import type { ThemeName } from "@tamagui/ui";
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
// disabling - server time diff from client :/
// const seasonalTheme = (() => {
//   const month = new Date().getMonth()
//   const day = new Date().getDate()
//   if (month === 11 && day >= 14) {
//     return 'xmas'
//   }
//   if (month === 9 && day >= 20) {
//     return 'halloween'
//   }
//   if (month === 2 && day >= 30) {
//     return 'easter'
//   }
// })()
// setTintFamily('valentine')
// if (seasonalTheme) {
//   setTintFamily(seasonalTheme)
// }
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