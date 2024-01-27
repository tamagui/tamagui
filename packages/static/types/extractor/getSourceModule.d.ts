import * as t from '@babel/types';
export interface SourceModule {
    sourceModule?: string;
    imported?: string;
    local?: string;
    destructured?: boolean;
    usesImportSyntax: boolean;
}
export declare function getSourceModule(itemName: string, itemBinding: {
    constant?: boolean;
    path: {
        node: t.Node;
        parent: any;
    };
}): SourceModule | null;
//# sourceMappingURL=getSourceModule.d.ts.map