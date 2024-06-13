import type { ConfigAPI, NodePath } from '@babel/core';
import type { ImportSpecifier, ImportDeclaration, ExportAllDeclaration, StringLiteral, ExportSpecifier, ExportDeclaration, ExportNamedDeclaration } from '@babel/types';
type ImportDeclarationFunc = (specifiers: Array<ImportSpecifier>, source: StringLiteral) => ImportDeclaration;
type ExportNamedDeclarationFunc = (declaration?: ExportDeclaration, specifiers?: Array<ExportSpecifier>, source?: StringLiteral) => ExportNamedDeclaration;
type ExportAllDeclarationFunc = (source: StringLiteral) => ExportAllDeclaration;
type PathDeclaration = NodePath & {
    node: ImportDeclaration & ExportNamedDeclaration & ExportAllDeclaration;
};
interface FullySpecifiedOptions {
    declaration: ImportDeclarationFunc | ExportNamedDeclarationFunc | ExportAllDeclarationFunc;
    makeNodes: (path: PathDeclaration) => Array<PathDeclaration>;
    ensureFileExists: boolean;
    esExtensionDefault: string;
    tryExtensions: Array<string>;
    esExtensions: Array<string>;
    includePackages: Array<string>;
}
export default function FullySpecified(api: ConfigAPI, options: FullySpecifiedOptions): {
    name: string;
    visitor: {
        ImportDeclaration: (path: any, { file: { opts: { filename }, }, }: PluginPass) => void;
        ExportNamedDeclaration: (path: any, { file: { opts: { filename }, }, }: PluginPass) => void;
        ExportAllDeclaration: (path: any, { file: { opts: { filename }, }, }: PluginPass) => void;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map