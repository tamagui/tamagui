import type { ConfigAPI, PluginObj } from '@babel/core';
export interface FullySpecifiedOptions {
    ensureFileExists: boolean;
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