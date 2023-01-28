import esbuild from 'esbuild';
/**
 * For internal loading of new files
 */
type Props = Omit<Partial<esbuild.BuildOptions>, 'entryPoints'> & {
    outfile: string;
    entryPoints: string[];
    resolvePlatformSpecificEntries?: boolean;
};
export declare function bundle(props: Props, aliases?: Record<string, string>): Promise<esbuild.BuildResult<esbuild.BuildOptions>>;
export declare function bundleSync(props: Props, aliases?: Record<string, string>): esbuild.BuildResult<esbuild.BuildOptions>;
export {};
//# sourceMappingURL=bundle.d.ts.map