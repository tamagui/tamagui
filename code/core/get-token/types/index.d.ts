import type { Variable, VariableValGeneric } from '@tamagui/web';
type GetTokenBase = Variable | string | number | undefined | VariableValGeneric;
type GetTokenOptions = {
    shift?: number;
    bounds?: [number] | [number, number];
    excludeHalfSteps?: boolean;
};
export declare const getSize: (size: GetTokenBase, options?: GetTokenOptions) => Variable<number>;
export declare const getSpace: (space: GetTokenBase, options?: GetTokenOptions) => Variable<number>;
export declare const getRadius: (radius: GetTokenBase, options?: GetTokenOptions) => Variable<number>;
/** @deprecated use getSize, getSpace, or getTokenRelative instead */
export declare const stepTokenUpOrDown: (type: "size" | "space" | "zIndex" | "radius", current: GetTokenBase, options?: GetTokenOptions) => Variable<number>;
export declare const getTokenRelative: (type: "size" | "space" | "zIndex" | "radius", current: GetTokenBase, options?: GetTokenOptions) => Variable<number>;
export {};
//# sourceMappingURL=index.d.ts.map