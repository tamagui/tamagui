import type { GenericVariantDefinitions, StaticConfig, StaticConfigParsed, StylableComponent } from '../types';
export declare function extendStaticConfig(config: Partial<StaticConfig>, parent?: StylableComponent): StaticConfigParsed;
export declare const mergeVariants: (parentVariants?: GenericVariantDefinitions, ourVariants?: GenericVariantDefinitions) => {
    [x: string]: {
        [key: string]: ((a: any, b: any) => any) | {
            [key: string]: any;
        };
    };
};
export declare const parseStaticConfig: (config: Partial<StaticConfig>) => StaticConfigParsed;
//# sourceMappingURL=extendStaticConfig.d.ts.map