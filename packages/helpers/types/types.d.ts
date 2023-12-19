export type StyleObject = {
    property: string;
    pseudo?: 'hover' | 'focus' | 'active';
    identifier: string;
    rules: string[];
    value?: any;
};
export type MediaStyleObject = Omit<StyleObject, 'value'>;
export type NativePlatform = 'web' | 'mobile' | 'android' | 'ios';
export type NativeValue<Platform extends NativePlatform = NativePlatform> = boolean | Platform | Platform[];
//# sourceMappingURL=types.d.ts.map