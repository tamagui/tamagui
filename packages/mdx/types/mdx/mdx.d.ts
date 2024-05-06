export declare const DATA_PATH: string;
export declare const getAllFrontmatter: (fromPath: string) => Frontmatter[];
export declare const getMdxBySlug: (basePath: any, slug: any) => Promise<{
    frontmatter: Frontmatter;
    code: string;
}>;
export declare function getAllVersionsFromPath(fromPath: string): string[];
//# sourceMappingURL=mdx.d.ts.map