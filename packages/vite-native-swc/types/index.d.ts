/// <reference types="node" />
import { SourceMapPayload } from 'module';
import { JscTarget, Output, ReactConfig } from '@swc/core';
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
export declare function swcTransform(_id: string, code: string, options: Options, cjs?: boolean): Promise<Output | {
    code: string;
    map: SourceMapPayload;
} | undefined>;
export declare function wrapSourceInRefreshRuntime(id: string, code: string, cjs?: boolean): string;
export declare const transformWithOptions: (id: string, code: string, target: JscTarget, options: Options, reactConfig: ReactConfig) => Promise<Output | undefined>;
export default react;
//# sourceMappingURL=index.d.ts.map