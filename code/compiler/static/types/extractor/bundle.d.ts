import esbuild from 'esbuild';
import type { TamaguiPlatform } from '../types';
export declare const esbuildLoaderConfig: {
    readonly '.js': "jsx";
    readonly '.png': "dataurl";
    readonly '.jpg': "dataurl";
    readonly '.jpeg': "dataurl";
    readonly '.svg': "dataurl";
    readonly '.gif': "dataurl";
    readonly '.webp': "dataurl";
    readonly '.woff2': "dataurl";
    readonly '.woff': "dataurl";
    readonly '.eot': "dataurl";
    readonly '.otf': "dataurl";
    readonly '.ttf': "dataurl";
    readonly '.mp4': "file";
    readonly '.mpeg4': "file";
    readonly '.mov': "file";
    readonly '.avif': "file";
    readonly '.wmv': "file";
    readonly '.webm': "file";
    readonly '.wav': "file";
    readonly '.aac': "file";
    readonly '.ogg': "file";
    readonly '.flac': "file";
    readonly '.node': "empty";
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
export declare function esbundleTamaguiConfig(props: Props, platform: TamaguiPlatform, aliases?: Record<string, string>): Promise<esbuild.BuildResult<esbuild.BuildOptions>>;
export {};
//# sourceMappingURL=bundle.d.ts.map