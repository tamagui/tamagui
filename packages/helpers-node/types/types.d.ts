export interface TamaguiOptions {
    components: string[];
    config?: string;
    importsWhitelist?: string[];
    disable?: boolean | string[];
    disableExtraction?: boolean | string[];
    disableFlattening?: boolean;
    disableDebugAttr?: boolean;
    disableExtractInlineMedia?: boolean;
    disableExtractVariables?: boolean | 'theme';
    excludeReactNativeWebExports?: string[];
    logTimings?: boolean;
    prefixLogs?: string;
    disableExtractFoundComponents?: boolean | string[];
    evaluateVars?: boolean;
    cssPath?: string;
    cssData?: any;
    deoptProps?: Set<string>;
    excludeProps?: Set<string>;
    inlineProps?: Set<string>;
    forceExtractStyleDefinitions?: boolean;
}
//# sourceMappingURL=types.d.ts.map