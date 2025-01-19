/**
 * "license": "MIT",
  "author": "Bryan Mishkin",
 */
/** Relevant public data about a dependency. */
type Dependency = {
    name: string;
    isMismatching: boolean;
    versions: readonly {
        version: string;
        packages: readonly {
            pathRelative: string;
        }[];
    }[];
};
export declare class CDVC {
    /** An object mapping each dependency in the workspace to information including the versions found of it. */
    private readonly dependencies;
    /**
     * @param path - path to the workspace root
     * @param options
     * @param options.fix - Whether to autofix inconsistencies (using latest version present)
     * @param options.ignoreDep - Dependency(s) to ignore mismatches for
     * @param options.includeDepPattern - RegExp(s) of dependency names to ignore mismatches for
     * @param options.ignorePackage - Workspace package(s) to ignore mismatches for
     * @param options.ignorePackagePattern - RegExp(s) of package names to ignore mismatches for
     * @param options.ignorePath - Workspace-relative path(s) of packages to ignore mismatches for
     * @param options.ignorePathPattern - RegExp(s) of workspace-relative path of packages to ignore mismatches for
     */
    constructor(path: string);
    toMismatchSummary(): string;
    getDependencies(): readonly Dependency[];
    getDependency(name: string): Dependency;
    get hasMismatchingDependencies(): boolean;
}
export {};
//# sourceMappingURL=check-dep-versions.d.ts.map