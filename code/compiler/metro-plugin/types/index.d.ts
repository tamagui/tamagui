import { type TamaguiOptions } from '@tamagui/static';
export type MetroTamaguiOptions = TamaguiOptions & {
    /**
     * @deprecated CSS interop is no longer supported. Use `tamagui generate` instead.
     */
    cssInterop?: boolean;
};
type MetroConfigInput = {
    resolver?: any;
    transformer?: any;
    transformerPath?: string;
    [key: string]: any;
};
/**
 * Configure Metro for Tamagui.
 *
 * This is now a simplified wrapper that just ensures CSS is enabled and
 * loads your Tamagui config. For CSS generation, use the CLI:
 *
 * 1. Create a `tamagui.build.ts` with `outputCSS` option
 * 2. Run `tamagui generate` before your build
 * 3. Import the generated CSS in your app's layout
 *
 * @example
 * ```js
 * // metro.config.js
 * const { getDefaultConfig } = require('expo/metro-config')
 * const { withTamagui } = require('@tamagui/metro-plugin')
 *
 * const config = getDefaultConfig(__dirname, { isCSSEnabled: true })
 * module.exports = withTamagui(config, {
 *   components: ['tamagui'],
 *   config: './tamagui.config.ts',
 * })
 * ```
 */
export declare function withTamagui(metroConfig: MetroConfigInput, optionsIn?: MetroTamaguiOptions): MetroConfigInput;
export {};
//# sourceMappingURL=index.d.ts.map