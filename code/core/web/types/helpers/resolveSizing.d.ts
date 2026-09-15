import type { SizeName, StyledDynamicEnv } from '../types';
/** a size name resolved against the config: rung token keys plus derived px */
export type ResolvedSizing = {
    name: string;
    fontSize: string;
    lineHeight: string;
    controlFontSize: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    radius: string;
    height: number;
    icon: number;
    square: number;
};
/** a size name to its rung resolved to pixels, against the config in `env` */
export declare const resolveSizing: (name: SizeName | boolean | undefined, env: StyledDynamicEnv) => ResolvedSizing;
/** runtime form of resolveSizing for components outside style resolution */
export declare const getSizing: (name: SizeName | boolean | undefined) => ResolvedSizing;
//# sourceMappingURL=resolveSizing.d.ts.map