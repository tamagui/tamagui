import { DeepVariableObject } from './createVariables';
import { GenericFont } from './types';
export declare function insertFont<A extends GenericFont>(name: string, fontIn: A): DeepVariableObject<A>;
export declare function parseFont<A extends GenericFont>(definition: A): DeepVariableObject<A>;
export declare function registerFontVariables(parsedFont: any, collect?: boolean): string;
//# sourceMappingURL=insertFont.d.ts.map