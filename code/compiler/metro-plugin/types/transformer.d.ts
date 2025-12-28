/**
 * Simple passthrough transformer for Metro.
 *
 * This transformer delegates to the original Metro transformer without any
 * CSS extraction. For CSS, use `tamagui generate` to pre-generate your CSS
 * and import it directly in your app.
 *
 * @deprecated The metro-plugin CSS extraction is deprecated. Use the CLI instead:
 *   1. Add `outputCSS` to your tamagui.build.ts
 *   2. Run `tamagui generate` before your build
 *   3. Import the generated CSS file in your app
 */
interface TransformerConfig {
    transformerPath?: string;
    ogTransformPath?: string;
    [key: string]: any;
}
interface TransformOptions {
    [key: string]: any;
}
export declare function transform(config: TransformerConfig, projectRoot: string, filename: string, data: Buffer, options: TransformOptions): Promise<any>;
export {};
//# sourceMappingURL=transformer.d.ts.map