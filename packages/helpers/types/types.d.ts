export type StyleObject = {
    property: string;
    pseudo?: 'hover' | 'focus' | 'active';
    identifier: string;
    rules: string[];
};
export type MediaStyleObject = Omit<StyleObject, 'value'>;
//# sourceMappingURL=types.d.ts.map