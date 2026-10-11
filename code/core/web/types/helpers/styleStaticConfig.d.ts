import type { StaticConfig, StylePiece, TamaguiInternalConfig } from '../types';
export type StyleStaticConfig = {
    baseStyle: Record<string, any> | undefined;
    baseVariantProps: Record<string, any> | undefined;
    baseStylePiece: StylePiece | undefined;
    baseStylePieces: Record<string, StylePiece> | undefined;
    defaultProps: Record<string, any> | undefined;
    styledContextKeys: Set<string> | null;
    variants: StaticConfig['variants'];
    variantStyleResolver: any;
    passthroughClassName: string | undefined;
};
export declare function getStyleStaticConfig(staticConfig: StaticConfig, conf: TamaguiInternalConfig): StyleStaticConfig;
//# sourceMappingURL=styleStaticConfig.d.ts.map