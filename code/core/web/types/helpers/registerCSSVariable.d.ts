import type { Variable, VariableVal } from '../types';
export declare const registerCSSVariable: (v: Variable | VariableVal) => void;
export declare const variableToCSS: (v: Variable, unitless?: boolean) => string;
export declare const tokensValueToVariable: Map<any, any>;
export declare const autoVariables: Variable[];
export declare const getAutoVariableCSS: () => string;
export declare const getOrCreateVariable: (val: any) => Variable;
export declare const mutatedAutoVariables: Variable[];
export declare const getMutatedAutoVariableCSS: () => string;
export declare const getOrCreateMutatedVariable: (val: any) => Variable;
/** cache-generation sizes for development diagnostics and behavior probes */
export declare const getCSSVariableCacheStats: () => {
    auto: number;
    autoDeclarations: number;
    mutated: number;
    mutatedDeclarations: number;
};
//# sourceMappingURL=registerCSSVariable.d.ts.map