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
/**
 * A key-sorted deep copy.
 *
 * The bridge manifest is compared and hashed across processes and across a
 * persisted cache, and a round trip through JSON reorders object keys. Hashing
 * insertion order makes the same manifest produce two identities depending on
 * whether the build scanned or restored, which is a cache miss that looks like
 * a real change.
 */
export declare function canonicalizeBridgeManifest<T>(manifest: T): T;
export declare function hashBridgeManifest(manifest: unknown): string;
//# sourceMappingURL=identity.d.ts.map