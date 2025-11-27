export interface FingerprintOptions {
    platform: 'ios' | 'android';
    projectRoot?: string;
    debug?: boolean;
}
export interface FingerprintResult {
    hash: string;
    sources: string[];
}
/**
 * Generate a fingerprint for the native build using @expo/fingerprint.
 * The fingerprint changes when native dependencies change, indicating a rebuild is needed.
 */
export declare function generateFingerprint(options: FingerprintOptions): Promise<FingerprintResult>;
/**
 * Generate a quick pre-fingerprint hash based on common files that affect native builds.
 * This is faster than a full fingerprint and can be used for initial cache lookups.
 */
export declare function generatePreFingerprintHash(files: string[], projectRoot?: string): string;
//# sourceMappingURL=fingerprint.d.ts.map