import esbuild from 'esbuild';
import { TamaguiPlatform } from '../types';
/**
 * For internal loading of new files
 */
type Props = Omit<Partial<esbuild.BuildOptions>, 'entryPoints'> & {
    outfile: string;
    entryPoints: string[];
    resolvePlatformSpecificEntries?: boolean;
};
export declare function bundle(props: Props, platform: TamaguiPlatform, aliases?: Record<string, string>): Promise<esbuild.BuildResult<esbuild.BuildOptions>>;
export {};
//# sourceMappingURL=bundle.d.ts.map