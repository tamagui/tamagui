import esbuild from 'esbuild';
import type { TamaguiPlatform } from '../types';
export declare const esbuildLoaderConfig: {
    readonly '.js': 'jsx';
    readonly '.png': 'dataurl';
    readonly '.jpg': 'dataurl';
    readonly '.jpeg': 'dataurl';
    readonly '.svg': 'dataurl';
    readonly '.gif': 'dataurl';
    readonly '.webp': 'dataurl';
    readonly '.woff2': 'dataurl';
    readonly '.woff': 'dataurl';
    readonly '.eot': 'dataurl';
    readonly '.otf': 'dataurl';
    readonly '.ttf': 'dataurl';
    readonly '.mp4': 'file';
    readonly '.mpeg4': 'file';
    readonly '.mov': 'file';
    readonly '.avif': 'file';
    readonly '.wmv': 'file';
    readonly '.webm': 'file';
    readonly '.wav': 'file';
    readonly '.aac': 'file';
    readonly '.ogg': 'file';
    readonly '.flac': 'file';
    readonly '.node': 'empty';
};
export declare const esbuildIgnoreFilesRegex: RegExp;
/**
 * For internal loading of new files
 */
type Props = Omit<Partial<esbuild.BuildOptions>, 'entryPoints'> & {
    outfile: string;
    entryPoints: string[];
    resolvePlatformSpecificEntries?: boolean;
};
export declare function esbundleTamaguiConfig(props: Props, platform: TamaguiPlatform, aliases?: Record<string, string>): Promise<esbuild.BuildResult<{
    sourcemap?: boolean | 'linked' | 'inline' | 'external' | 'both';
    legalComments?: 'none' | 'inline' | 'eof' | 'linked' | 'external';
    sourceRoot?: string;
    sourcesContent?: boolean;
    format?: esbuild.Format;
    globalName?: string;
    target?: string | string[];
    supported?: Record<string, boolean>;
    platform?: esbuild.Platform;
    mangleProps?: RegExp;
    reserveProps?: RegExp;
    mangleQuoted?: boolean;
    mangleCache?: Record<string, string | false>;
    drop?: esbuild.Drop[];
    dropLabels?: string[];
    minify?: boolean;
    minifyWhitespace?: boolean;
    minifyIdentifiers?: boolean;
    minifySyntax?: boolean;
    lineLimit?: number;
    charset?: esbuild.Charset;
    treeShaking?: boolean;
    ignoreAnnotations?: boolean;
    jsx?: 'transform' | 'preserve' | 'automatic';
    jsxFactory?: string;
    jsxFragment?: string;
    jsxImportSource?: string;
    jsxDev?: boolean;
    jsxSideEffects?: boolean;
    define?: {
        [key: string]: string;
    };
    pure?: string[];
    keepNames?: boolean;
    absPaths?: esbuild.AbsPaths[];
    color?: boolean;
    logLevel?: esbuild.LogLevel;
    logLimit?: number;
    logOverride?: Record<string, esbuild.LogLevel>;
    tsconfigRaw?: string | esbuild.TsconfigRaw;
    bundle?: boolean;
    splitting?: boolean;
    preserveSymlinks?: boolean;
    metafile?: boolean;
    outdir?: string;
    outbase?: string;
    external?: string[];
    packages?: 'bundle' | 'external';
    alias?: Record<string, string>;
    loader?: {
        [ext: string]: esbuild.Loader;
    };
    resolveExtensions?: string[];
    mainFields?: string[];
    conditions?: string[];
    write?: boolean;
    allowOverwrite?: boolean;
    tsconfig?: string;
    outExtension?: {
        [ext: string]: string;
    };
    publicPath?: string;
    entryNames?: string;
    chunkNames?: string;
    assetNames?: string;
    inject?: string[];
    banner?: {
        [type: string]: string;
    };
    footer?: {
        [type: string]: string;
    };
    entryPoints?: (string | {
        in: string;
        out: string;
    })[] | Record<string, string>;
    stdin?: esbuild.StdinOptions;
    plugins?: esbuild.Plugin[];
    absWorkingDir?: string;
    nodePaths?: string[];
    outfile: string;
}>>;
export {};
//# sourceMappingURL=bundle.d.ts.map