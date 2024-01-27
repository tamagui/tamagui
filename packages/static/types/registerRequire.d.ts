import type { TamaguiPlatform } from './types';
export declare const getNameToPaths: () => {};
export declare function setRequireResult(name: string, result: any): void;
export declare function registerRequire(platform: TamaguiPlatform, { proxyWormImports }?: {
    proxyWormImports: boolean;
}): {
    tamaguiRequire: (this: any, path: string) => any;
    unregister: () => void;
};
//# sourceMappingURL=registerRequire.d.ts.map