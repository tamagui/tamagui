import type { ConfigAPI, PluginObj } from '@babel/core';
export interface FullySpecifiedOptions {
    ensureFileExists: boolean | {
        /**
         * If you're doing a non-in-place transformation (for example, outputting `.mjs` from `.js`) with `ensureFileExists` enabled, it's possible that the transform will be incorrect due to the imported file is not transformed and written into place yet (for example, we have `foo.js` and `bar.js` and we're transforming them into `foo.mjs` and `bar.mjs` respectively, in `bar.js` we have `import { ... } from './foo.js'` which we expect to be transformed into `import { ... } from './foo.mjs'`, but if `foo.mjs` is not transformed and written yet, it will be transformed into `import { ... } from './foo.js'` because `foo.mjs` can't be found at that time).
         *
         * To solve this, you can set this option to `'.mjs'` to force the extension to be transformed into that specified extension.
         */
        forceExtension?: string;
    };
    esExtensionDefault: string;
    /** List of all extensions which we try to find. */
    tryExtensions: Array<string>;
    /** List of extensions that can run in Node.js or in the Browser. */
    esExtensions: Array<string>;
    /** List of packages that also should be transformed with this plugin. */
    includePackages: Array<string>;
}
export default function FullySpecified(api: ConfigAPI, rawOptions: FullySpecifiedOptions): PluginObj;
//# sourceMappingURL=index.d.ts.map