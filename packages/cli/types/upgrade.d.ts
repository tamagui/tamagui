import { Package } from '@manypkg/get-packages';
export declare const DEPENDENCY_TYPES: readonly ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
export declare const upgrade: ({ version, tag, }: {
    version?: string | undefined;
    tag?: string | undefined;
}) => Promise<void>;
export declare function writePackage(pkg: Package): Promise<void>;
export declare function install(toolType: string, cwd: string): Promise<void>;
//# sourceMappingURL=upgrade.d.ts.map