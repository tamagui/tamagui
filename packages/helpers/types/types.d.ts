export type StyleObject = {
    property: string;
    pseudo?: 'hover' | 'focus' | 'active';
    identifier: string;
    rules: string[];
    value?: any;
};
export type MediaStyleObject = Omit<StyleObject, 'value'>;
//# sourceMappingURL=types.d.ts.map