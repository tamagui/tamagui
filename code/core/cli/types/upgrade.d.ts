interface UpgradeOptions {
    from?: string;
    to?: string;
    changelogOnly?: boolean;
    dryRun?: boolean;
    debug?: boolean;
}
/**
 * Main upgrade function
 */
export declare function upgrade(options?: UpgradeOptions): Promise<void>;
export {};
//# sourceMappingURL=upgrade.d.ts.map