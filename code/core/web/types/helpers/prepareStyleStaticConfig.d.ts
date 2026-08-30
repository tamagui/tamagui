import type { StaticConfig, TamaguiInternalConfig } from '../types';
export declare function getContextPropSet(staticConfig: StaticConfig): Set<string> | null;
export type SplitStyledOptions = {
    baseStyle: Record<string, any> | undefined;
    defaultProps: Record<string, any> | undefined;
};
/**
 * styled() takes styles and props in one options object. The styles belong to the
 * base layer the style pass writes before any prop, so call-site props and
 * variants always land on top of them; everything else stays a prop.
 *
 * Split lazily rather than in styled(), because classifying a key needs
 * `conf.shorthands` and styled() runs at module scope before createTamagui.
 */
export declare function splitStyledOptions(staticConfig: StaticConfig, conf: TamaguiInternalConfig): SplitStyledOptions;
export declare function prepareStyleStaticConfig(staticConfig: StaticConfig): StaticConfig;
//# sourceMappingURL=prepareStyleStaticConfig.d.ts.map