import type { UniversalAnimatedNumber, UseAnimatedNumberReaction, UseAnimatedNumberStyle, UseAnimatedNumbersStyle } from "@tamagui/web";
type CSSAnimatedNumberInstance = {
	current: number;
	target: number;
	listeners: Set<(value: number) => void>;
	styleHost: object | null;
	raf: number | null;
	finish: (() => void) | null;
	renderTarget: () => void;
	cancel: () => void;
};
type CSSAnimatedNumber = UniversalAnimatedNumber<CSSAnimatedNumberInstance>;
export declare function useAnimatedNumber(initial: number): CSSAnimatedNumber;
export declare const useAnimatedNumberReaction: UseAnimatedNumberReaction;
export declare const useAnimatedNumberStyle: UseAnimatedNumberStyle;
export declare const useAnimatedNumbersStyle: UseAnimatedNumbersStyle;
export type { CSSAnimatedNumber, CSSAnimatedNumberInstance };

//# sourceMappingURL=animated-number.d.ts.map