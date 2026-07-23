import type { TamaguiOptions } from "@tamagui/static";
import { MetroCompilerFrontend } from "./frontend";
export type MetroTamaguiOptions = TamaguiOptions & {
	/**
	* @deprecated CSS interop is no longer supported. Use `tamagui generate` instead.
	*/
	cssInterop?: boolean;
	/** Override the ignored on-disk handoff used by Metro transform workers. */
	compilerCacheRoot?: string;
};
type MetroConfigInput = {
	projectRoot?: string;
	resolver?: any;
	transformer?: any;
	transformerPath?: string;
	[key: string]: any;
};
export declare function getMetroCompilerFrontend(metroConfig: MetroConfigInput): MetroCompilerFrontend | null;
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
export { METRO_COMPILER_CACHE_VERSION, MetroCompilerCache, MetroCompilerCacheError, defaultMetroCompilerCacheRoot } from "./compilerCache";
export type { MetroCompilerDiagnostic } from "./diagnostics";
export type { MetroCompilerGeneration, MetroCompilerScanOptions, MetroCompilerUpdate } from "./frontend";

//# sourceMappingURL=index.d.ts.map