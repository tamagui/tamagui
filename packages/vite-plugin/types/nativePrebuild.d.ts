export declare function nativeBabelTransform(input: string): Promise<string>;
export declare function nativeBabelFlowTransform(input: string): Promise<string>;
export declare function nativeBabelRemoveJSX(input: string): Promise<string>;
export declare const prebuiltFiles: {
    react: string;
    reactJSXRuntime: string;
    reactNative: string;
};
export declare function nativePrebuild(): Promise<void>;
//# sourceMappingURL=nativePrebuild.d.ts.map