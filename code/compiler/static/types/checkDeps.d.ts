export declare enum DEPENDENCY_TYPE {
    dependencies = "dependencies",
    devDependencies = "devDependencies",
    optionalDependencies = "optionalDependencies",
    peerDependencies = "peerDependencies",
    resolutions = "resolutions"
}
export type Options = {
    depType?: readonly `${DEPENDENCY_TYPE}`[];
    fix?: boolean;
    ignoreDep?: readonly string[];
    ignoreDepPattern?: readonly string[];
    ignorePackage?: readonly string[];
    ignorePackagePattern?: readonly string[];
    ignorePath?: readonly string[];
    ignorePathPattern?: readonly string[];
};
export declare function checkDeps(root: string): Promise<void>;
//# sourceMappingURL=checkDeps.d.ts.map