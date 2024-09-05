import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export declare function hoistClassNames(path: NodePath<t.JSXElement>, existing: {
    [key: string]: t.Identifier;
}, expr: t.Expression): any;
//# sourceMappingURL=hoistClassNames.d.ts.map