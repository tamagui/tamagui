import type { FontLineHeightTokens, FontSizeTokens, SizeTokens, SpaceTokens } from "@tamagui/core";
// unused code - not exported could be used for cross compat calc() functions
/**
* Simple calc() that handles native + web
*   on web: outputs a calc() string
*   on native: outputs a plain number
*/
export type CalcVal = string | number | SizeTokens | SpaceTokens | FontSizeTokens | FontLineHeightTokens;
declare const operators: {
	"+": (a: number, b: number) => number;
	"-": (a: number, b: number) => number;
	"/": (a: number, b: number) => number;
	"*": (a: number, b: number) => number;
};
type Operator = keyof typeof operators;
export declare const calc: (...valuesAndOperators: (CalcVal | Operator)[]) => string | number;
export {};

//# sourceMappingURL=index.d.ts.map