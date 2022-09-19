import { FontLineHeightTokens, FontSizeTokens, SizeTokens, SpaceTokens } from '../types';
/**
 * Simple calc() that handles native + web
 *   on web: outputs a calc() string
 *   on native: outputs a plain number
 */
export declare type CalcVal = string | number | SizeTokens | SpaceTokens | FontSizeTokens | FontLineHeightTokens;
declare const operators: {
    '+': (a: number, b: number) => number;
    '-': (a: number, b: number) => number;
    '/': (a: number, b: number) => number;
    '*': (a: number, b: number) => number;
};
declare type Operator = keyof typeof operators;
export declare const calc: (...valuesAndOperators: (CalcVal | Operator)[]) => string | number;
export {};
//# sourceMappingURL=calc.d.ts.map