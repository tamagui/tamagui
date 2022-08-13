export declare type PackagerAsset = {
    __packager_asset: boolean;
    fileSystemLocation: string;
    httpServerLocation: string;
    width: number | null;
    height: number | null;
    scales: Array<number>;
    hash: string;
    name: string;
    type: string;
};
export declare function registerAsset(asset: PackagerAsset): number;
export declare function getAssetByID(assetId: number): PackagerAsset;
//# sourceMappingURL=index.d.ts.map