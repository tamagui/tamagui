import type { TamaguiPlatform } from './types';
export declare const getNameToPaths: () => {};
export declare function setRequireResult(name: string, result: any): void;
export declare function requireNativeEvaluationModule(modulePath: string, nativePlatform?: 'ios' | 'android' | 'macos'): any;
export declare function registerRequire(platform: TamaguiPlatform, { ignoredModules, nativePlatform, }?: {
    ignoredModules?: string[];
    nativePlatform?: 'ios' | 'android' | 'macos';
}): {
    tamaguiRequire: (this: any, path: string) => any;
    unregister: () => void;
};
//# sourceMappingURL=registerRequire.d.ts.map