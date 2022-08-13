declare const AccessibilityUtil: {
    isDisabled: (props: Record<string, any>) => boolean;
    propsToAccessibilityComponent: (props?: Object) => string | void;
    propsToAriaRole: ({ accessibilityRole }: {
        accessibilityRole?: string | undefined;
    }) => string | void;
};
export default AccessibilityUtil;
//# sourceMappingURL=index.d.ts.map