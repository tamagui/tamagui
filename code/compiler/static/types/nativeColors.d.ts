type NativeColorFactories = {
    PlatformColor: (...names: string[]) => unknown;
    DynamicColorIOS: (colors: Record<string, unknown>) => unknown;
};
export declare function getNativeColorFactories(projectRoot: string, platform?: string): NativeColorFactories;
export declare const nativeColorsModulePath: string;
export {};
//# sourceMappingURL=nativeColors.d.ts.map