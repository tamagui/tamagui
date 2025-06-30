/**
 * alias plugin
 * @description
 * config example:
 * ```
 * {
 *   '@lib': '/some/absolute/path'
 * }
 * ```
 * then `import { something } from '@lib/xxx'` will be transformed to
 * `import { something } from '/some/absolute/path/xxx'`
 * @param {object} config
 */
export declare const esbuildAliasPlugin: (config: any) => {
    name: string;
    setup(build: any): void;
};
//# sourceMappingURL=esbuildAliasPlugin.d.ts.map