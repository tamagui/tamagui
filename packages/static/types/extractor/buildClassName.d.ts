import * as t from '@babel/types';
import type { ClassNameObject } from '../types.js';
declare type Builder = (objects: ClassNameObject[], extras?: string) => t.Expression | t.StringLiteral | null;
export declare const buildClassName: Builder;
export declare const buildClassNameLogic: Builder;
export {};
//# sourceMappingURL=buildClassName.d.ts.map