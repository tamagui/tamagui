import type { Plugin } from 'vite';
export interface BabelPluginOptions {
    apply?: 'serve' | 'build';
    shouldTransform?: (code: string, id: string) => boolean;
}
export default function babelReanimatedVitePlugin({ shouldTransform, apply, }?: BabelPluginOptions): Plugin;
//# sourceMappingURL=index.d.ts.map