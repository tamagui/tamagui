import { CLIResolvedOptions, CLIUserOptions, TamaguiOptions } from '@tamagui/types';
import esbuild from 'esbuild';
import { TamaguiProjectInfo } from './bundleConfig';
export declare function loadTamagui(propsIn: TamaguiOptions): Promise<TamaguiProjectInfo | null>;
export declare function loadTamaguiSync(propsIn: TamaguiOptions): TamaguiProjectInfo;
export declare function getOptions({ root, tsconfigPath, tamaguiOptions, host, debug, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function resolveWebOrNativeSpecificEntry(entry: string): string;
export { TamaguiProjectInfo };
export declare function watchTamaguiConfig(tamaguiOptions: TamaguiOptions): Promise<{
    context: esbuild.BuildContext<{
        entryPoints: string[];
        sourcemap: false;
        write: false;
        plugins: {
            name: string;
            setup({ onEnd }: esbuild.PluginBuild): void;
        }[];
    }>;
    promise: Promise<void>;
}>;
//# sourceMappingURL=loadTamagui.d.ts.map