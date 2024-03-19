export type StyleObject = {
    property: string;
    pseudo?: 'hover' | 'focus' | 'focus-visible' | 'active';
    identifier: string;
    rules: string[];
    value?: any;
};
export type MediaStyleObject = Omit<StyleObject, 'value'>;
//# sourceMappingURL=types.d.ts.map