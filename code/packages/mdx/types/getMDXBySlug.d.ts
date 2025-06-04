import type { Frontmatter } from './types';
export declare function getMDXBySlug(basePath: string, slug: string): Promise<{
    frontmatter: Frontmatter;
    code: string;
}>;
export declare function getMDX(source: string): Promise<{
    code: string;
    frontmatter: {
        [key: string]: any;
    };
    errors: import("esbuild").Message[];
    matter: Omit<import("gray-matter").GrayMatterFile<string>, "data"> & {
        data: {
            [key: string]: any;
        };
    };
}>;
export declare function getAllVersionsFromPath(fromPath: string): string[];
//# sourceMappingURL=getMDXBySlug.d.ts.map