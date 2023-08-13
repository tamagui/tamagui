import { PluginOption } from 'vite';
type Options = {
    /**
     * Control where the JSX factory is imported from.
     * @default "react"
     */
    jsxImportSource?: string;
    /**
     * Enable TypeScript decorators. Requires experimentalDecorators in tsconfig.
     * @default false
     */
    tsDecorators?: boolean;
    /**
     * Use SWC plugins. Enable SWC at build time.
     * @default undefined
     */
    plugins?: [string, Record<string, any>][];
};
declare const react: (_options?: Options) => PluginOption[];
export declare function wrapSourceInRefreshRuntime(id: string, code: string, cjs?: boolean): string;
export default react;
//# sourceMappingURL=index.d.ts.map