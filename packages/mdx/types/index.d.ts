export * from './codeExamples';
export * from './getCompilationExamples';
export * from './types';
import type { Frontmatter } from './types';
export declare const getAllFrontmatter: (fromPath: string) => Frontmatter[];
export declare const getMdxBySlug: (basePath: any, slug: any) => Promise<{
    frontmatter: Frontmatter;
    code: string;
}>;
export declare function getAllVersionsFromPath(fromPath: string): string[];
//# sourceMappingURL=index.d.ts.map