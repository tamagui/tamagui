/** The one content hash every compiler cache identity is built from. */
export declare function contentHash(value: string | Uint8Array): string;
/**
 * Key-order-independent JSON. Cache identities are hashed from this, so two
 * objects that differ only in property order must serialize identically.
 */
export declare function stableStringify(value: unknown): string;
//# sourceMappingURL=hash.d.ts.map