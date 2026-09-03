/**
* the css property name an entry is filed under, so `backgroundColor` and
* `background-color` are one key and cannot both silently apply.
*/
export declare function canonicalTransitionProperty(key: string): string;
export declare function isTransformProperty(key: string): boolean;
/**
* the style keys a css property covers, for drivers that key their per-property
* options by style key rather than css property (motion, react-native).
*/
export declare function styleKeysForProperty(property: string): readonly string[];

//# sourceMappingURL=propertyNames.d.ts.map