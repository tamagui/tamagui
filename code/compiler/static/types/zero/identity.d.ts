import type { TamaguiRuntimeLiteral } from './options';
/**
 * Bumped whenever the zero transform's emitted output changes shape. It rides
 * the lowering plan version so a compiler change also invalidates zero caches.
 */
export declare const ZERO_COMPILER_VERSION = "zero-1/plan-1";
/**
 * Every integration records this tuple in its cache and build identity. The CSS
 * path alone is insufficient because the artifact's content can change in place.
 */
export interface ZeroArtifactIdentity {
    runtimeLiteral: TamaguiRuntimeLiteral;
    target: 'web' | 'native';
    configGeneration: string;
    cssHash: string;
    compilerVersion: string;
    islandEntries: string[];
    bridgeManifestHash: string;
    islandOutputHashes: Record<string, string>;
}
export declare function hashZeroIdentity(identity: ZeroArtifactIdentity): string;
export declare function hashBridgeManifest(manifest: unknown): string;
//# sourceMappingURL=identity.d.ts.map