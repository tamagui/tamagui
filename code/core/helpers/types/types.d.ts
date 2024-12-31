export type StyleObject = [
    property: string,
    value: any,
    identifier: string,
    pseudo: 'hover' | 'focus' | 'focus-visible' | 'focus-within' | 'active' | undefined,
    rules: string[]
];
export declare const StyleObjectProperty = 0;
export declare const StyleObjectValue = 1;
export declare const StyleObjectIdentifier = 2;
export declare const StyleObjectPseudo = 3;
export declare const StyleObjectRules = 4;
export type MediaStyleObject = Omit<StyleObject, 'value'>;
//# sourceMappingURL=types.d.ts.map