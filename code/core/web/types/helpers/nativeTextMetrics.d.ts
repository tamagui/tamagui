export type NativeTextMetrics = {
    fontSize?: number;
    inheritsFontSize?: boolean;
    lineHeight?: number | `${number}px` | 'normal';
};
export type AnimatedTextChannel = {
    fontSize: unknown;
    driver: string;
};
export type NativeTextContext = {
    parentFontSize?: number;
    parentLineHeight?: NativeTextMetrics['lineHeight'];
    animatedText?: AnimatedTextChannel | null;
};
export declare function resolveTextMetrics(style: Record<string, unknown>, lineHeight: unknown, parent?: NativeTextContext, isStatic?: boolean, apply?: boolean): NativeTextMetrics;
//# sourceMappingURL=nativeTextMetrics.d.ts.map