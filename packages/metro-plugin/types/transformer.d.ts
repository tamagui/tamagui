/// <reference types="node" />
import { JsTransformerConfig, JsTransformOptions, TransformResponse } from 'metro-transform-worker';
import { TamaguiOptions } from '@tamagui/static';
interface NativeWindJsTransformerConfig extends JsTransformerConfig {
    transformerPath?: string;
    tamagui: TamaguiOptions;
}
export declare function transform(config: NativeWindJsTransformerConfig, projectRoot: string, filename: string, data: Buffer, options: JsTransformOptions): Promise<TransformResponse>;
export {};
//# sourceMappingURL=transformer.d.ts.map