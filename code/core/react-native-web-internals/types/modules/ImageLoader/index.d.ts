/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
export declare class ImageUriCache {
    static _maximumEntries: number;
    static _entries: {};
    static has(uri: string): boolean;
    static add(uri: string): void;
    static remove(uri: string): void;
    static _cleanUpIfNeeded(): void;
}
declare const ImageLoader: {
    abort(requestId: number): void;
    getSize(uri: string, success: (width: number, height: number) => void, failure: () => void): void;
    has(uri: string): boolean;
    load(uri: string, onLoad: Function, onError: Function): number;
    prefetch(uri: string): Promise<void>;
    queryCache(uris: Array<string>): Promise<{
        [uri: string]: "disk/memory";
    }>;
};
export default ImageLoader;
//# sourceMappingURL=index.d.ts.map