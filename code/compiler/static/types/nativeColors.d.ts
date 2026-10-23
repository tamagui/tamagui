export declare function getNativeColorFactories(_projectRoot: string, platform?: string): {
    PlatformColor(...args: Array<string | {
        fallback: string;
    }>): unknown;
    DynamicColorIOS(colors: Record<string, unknown>): unknown;
};
export declare const nativeColorsModulePath: string;
//# sourceMappingURL=nativeColors.d.ts.map