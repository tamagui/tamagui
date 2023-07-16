/// <reference types="node" />
import type { SendProgress } from '../../types';
/**
 * Delegate with implementation for compiler-specific functions.
 */
export interface CompilerDelegate {
    /**
     * Get compiled asset content.
     *
     * If the compilation is in progress, it should wait until compilation finishes and then return the asset.
     *
     * @param filename Filename of the asset to get.
     * @param platform Platform of the asset to get.
     * @param sendProgress Function to notify the client who requested the asset about compilation progress.
     */
    getAsset: (filename: string, platform: string, sendProgress?: SendProgress) => Promise<string | Buffer>;
    /**
     * Detect MIME type of the asset from `filename`, `platform` or `data` (or from combination of either).
     *
     * @param filename Filename of the asset.
     * @param platform Platform of the asset.
     * @param data Asset's content.
     */
    getMimeType: (filename: string, platform: string, data: string | Buffer) => string;
    /**
     * Detect the platform from the URI - either from filename, query params or both.
     *
     * @param uri URI string.
     */
    inferPlatform?: (uri: string) => string | undefined;
}
//# sourceMappingURL=types.d.ts.map