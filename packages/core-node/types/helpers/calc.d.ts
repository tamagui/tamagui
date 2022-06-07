import { FontLineHeightTokens, FontSizeTokens, SizeTokens, SpaceTokens } from '../types';
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