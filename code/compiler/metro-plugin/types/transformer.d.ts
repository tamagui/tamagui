import type { JsTransformerConfig, JsTransformOptions, TransformResponse } from 'metro-transform-worker';
import type { TamaguiOptions } from '@tamagui/static';
interface TamaguiJsTransformerConfig extends JsTransformerConfig {
    transformerPath?: string;
    tamagui: TamaguiOptions;
}
export declare function transform(config: TamaguiJsTransformerConfig, projectRoot: string, filename: string, data: Buffer, options: JsTransformOptions): Promise<TransformResponse>;
export {};
//# sourceMappingURL=transformer.d.ts.map