import type { TamaguiOptions } from '@tamagui/static';
interface TamaguiJsTransformerConfig {
    transformerPath?: string;
    tamagui: TamaguiOptions;
    tamaguiCssInterop?: boolean;
    [key: string]: any;
}
interface JsTransformOptions {
    platform?: string;
    type?: string;
    [key: string]: any;
}
export declare function transform(config: TamaguiJsTransformerConfig, projectRoot: string, filename: string, data: Buffer, options: JsTransformOptions): Promise<any>;
export {};
//# sourceMappingURL=transformer.d.ts.map