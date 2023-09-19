/// <reference types="node" />
import { SourceMapPayload } from 'module';
import { JscTarget, Output, ReactConfig } from '@swc/core';
import { PluginOption } from 'vite';
type Options = {
    mode: 'serve' | 'serve-cjs' | 'build';
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
declare const _default: (_options?: Options) => PluginOption[];
export default _default;
export declare function swcTransform(_id: string, code: string, options: Options): Promise<Output | {
    code: string;
    map: SourceMapPayload;
} | undefined>;
export declare function wrapSourceInRefreshRuntime(id: string, code: string, options: Options): string;
export declare const transformForBuild: (id: string, code: string) => Promise<Output>;
export declare const transformWithOptions: (id: string, code: string, target: JscTarget, options: Options, reactConfig: ReactConfig) => Promise<Output | undefined>;
//# sourceMappingURL=index.d.ts.map