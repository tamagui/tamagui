import type { StaticShapeStyle, StylePiece } from './types';
type StylePieceLayer = 'base' | 'style';
type StylePieceCompiler = (piece: StylePiece, layer: StylePieceLayer) => void;
export declare function setStylePieceCompiler(compiler: StylePieceCompiler): void;
export declare function isStylePiece(value: unknown): value is StylePiece;
export declare function isStylePieceCacheable(piece: StylePiece): boolean;
export declare function createStylePiece(definition: StaticShapeStyle, layer?: StylePieceLayer): StylePiece;
/**
 * Creates a statically-shaped style fragment. The fragment is accepted only by
 * Tamagui's `style` prop; array order uses the style prop's normal last-wins
 * precedence.
 */
export declare function style(definition: StaticShapeStyle): StylePiece;
export {};
//# sourceMappingURL=style.d.ts.map