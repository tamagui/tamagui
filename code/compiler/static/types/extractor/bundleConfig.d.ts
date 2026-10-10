import { type StaticConfig, type TamaguiInternalConfig } from '@tamagui/web';
import esbuild from 'esbuild';
import type { TamaguiOptions } from '../types';
type NameToPaths = {
    [key: string]: Set<string>;
};
export type LoadedComponents = {
    moduleName: string;
    nameToInfo: Record<string, {
        staticConfig: StaticConfig;
        displayName?: string;
    }>;
};
export type TamaguiProjectInfo = {
    components?: LoadedComponents[];
    tamaguiConfig?: TamaguiInternalConfig | null;
    nameToPaths?: NameToPaths;
    cached?: boolean;
    dependencies?: string[];
    /**
     * The files whose bytes determine every compiler input this project produced:
     * the evaluated config and each component's static config. The compile cache
     * stamp is hashed from them, so they must be complete - a project that cannot
     * name them gets no stamp and no cache rather than a stamp that misses a
     * config change.
     */
    stampSources?: string[];
};
export declare const esbuildOptions: {
    define: {
        __DEV__: string;
    };
    target: string;
    format: "cjs";
    jsx: "automatic";
    platform: "node";
};
export declare const esbuildOptionsWithPlugins: {
    define: {
        __DEV__: string;
    };
    target: string;
    format: "cjs";
    jsx: "automatic";
    platform: "node";
    plugins: esbuild.Plugin[];
};
export type BundledConfig = Exclude<Awaited<ReturnType<typeof bundleConfig>>, undefined>;
export declare function hasBundledConfigChanged(): boolean;
export declare const getLoadedConfig: () => TamaguiInternalConfig | null;
export declare const setLoadedConfig: (config: TamaguiInternalConfig) => void;
export declare function getBundledConfig(props: TamaguiOptions, rebuild?: boolean): Promise<any>;
export declare function bundleConfig(props: TamaguiOptions, rebuild?: boolean): Promise<any>;
export declare function writeTamaguiCSS(outputCSS: string, config: TamaguiInternalConfig): Promise<void>;
export declare function loadComponents(props: TamaguiOptions, forceExports?: boolean): Promise<LoadedComponents[]>;
/**
 * Evaluate one host-resolved module under the platform's static-evaluation
 * hooks, the way configured `components` load, and return its exports. The
 * compiler frontend uses this for component discovery when no module runner is
 * available (the Vite native environment plans for Metro).
 */
export declare function evaluateComponentModule(props: TamaguiOptions, id: string): Promise<Record<string, unknown>>;
export declare function loadComponentsSync(props: TamaguiOptions, forceExports?: boolean): LoadedComponents[];
export declare function loadComponentsInner(props: TamaguiOptions, forceExports?: boolean): Promise<LoadedComponents[]>;
export declare function loadComponentsInnerSync(props: TamaguiOptions, forceExports?: boolean): LoadedComponents[];
export declare function getComponentStaticConfigByName(name: string, exported: any): Record<string, {
    staticConfig: StaticConfig;
    displayName?: string;
}>;
export {};
//# sourceMappingURL=bundleConfig.d.ts.map