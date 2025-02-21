import type * as t from '@babel/types';
import type { ClassNameObject } from '../types';
type Builder = (objects: ClassNameObject[], extras?: string) => t.Expression | t.StringLiteral | null;
export declare const buildClassName: Builder;
export declare const buildClassNameLogic: Builder;
//# sourceMappingURL=buildClassName.d.ts.map