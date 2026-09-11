export interface MetroResolverConfig {
	projectRoot: string;
	resolver?: Record<string, any>;
}
export interface MetroResolvedDependency {
	specifier: string;
	resolvedId: string;
	external: boolean;
}
export interface MetroModuleSpecifier {
	specifier: string;
	isESMImport: boolean;
}
export declare function moduleSpecifiersFromAst(ast: unknown): MetroModuleSpecifier[];
export declare function createMetroCompilerResolver(config: MetroResolverConfig): {
	version: string;
	resolve(importer: string, dependency: MetroModuleSpecifier, platform: string | null): MetroResolvedDependency | null;
};
export declare function isCompilerSourceFile(path: string): boolean;

//# sourceMappingURL=metroResolver.d.ts.map