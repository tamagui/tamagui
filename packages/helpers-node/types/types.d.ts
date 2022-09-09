export interface TamaguiOptions {
    components: string[];
    config?: string;
    evaluateVars?: boolean;
    importsWhitelist?: string[];
    disable?: boolean;
    disableExtraction?: boolean;
    disableFlattening?: boolean;
    disableDebugAttr?: boolean;
    disableExtractInlineMedia?: boolean;
    disableExtractVariables?: boolean;
    excludeReactNativeWebExports?: string[];
    exclude?: RegExp;
    logTimings?: boolean;
    prefixLogs?: string;
    cssPath?: string;
    cssData?: any;
    deoptProps?: Set<string>;
    excludeProps?: Set<string>;
    inlineProps?: Set<string>;
    forceExtractStyleDefinitions?: boolean;
}
//# sourceMappingURL=types.d.ts.map