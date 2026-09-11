import type { ParsedValue } from "../ast/valueTypes";
/**
* The exact string that identifies a program. Every variable-length part is
* length-prefixed, so no payload can forge a boundary and two different
* programs cannot normalize to the same key. Also usable as the upstream
* parse/lower cache key.
*/
export declare function normalizeProgramKey(property: string, value: ParsedValue, configRevision: string): string;
/**
* Short per-property prefix for readability in devtools: the first letter of
* each camelCase word, so `backgroundColor` is `bc` and `borderTopLeftRadius`
* is `btlr`. Abbreviations may collide (`backgroundColor` and `backgroundClip`
* are both `bc`); the hash carries the property name, so the full class name
* still differs. This is a label, not identity.
*/
export declare function propertyAbbreviation(property: string): string;
/** the css-safe class name that owns this program's block, eg `_bc-1076745300` */
export declare function programClassName(property: string, value: ParsedValue, configRevision: string): string;

//# sourceMappingURL=programHash.d.ts.map