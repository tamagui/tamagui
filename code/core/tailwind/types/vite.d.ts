/**
 * The Tailwind build integration for Tamagui.
 *
 * Applications that author with `@tamagui/tailwind` change only the plugin import:
 *
 * ```ts
 * import { tamaguiPlugin } from '@tamagui/tailwind/vite'
 * ```
 *
 * This wraps the base `@tamagui/vite-plugin` compiler plugins, reuses their one
 * Tamagui config loader, adds `@tamagui/tailwind` to compiler component provenance,
 * and adds the official Tailwind scanner/compiler for the candidates Tamagui's own
 * grammar does not claim. Nothing here is reachable from the `@tamagui/tailwind`
 * root: the runtime package never imports the Tailwind engine or Vite.
 */
import { type TamaguiVitePluginOptions } from '@tamagui/vite-plugin/internal';
import type { PluginOption } from 'vite';
export { TAILWIND_RESOLVED_ID, TAILWIND_VERSION, TAILWIND_VIRTUAL_ID } from './vite/state';
export declare function tamaguiPlugin(options?: TamaguiVitePluginOptions): PluginOption;
//# sourceMappingURL=vite.d.ts.map