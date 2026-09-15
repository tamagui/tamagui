export type GenericProps = Record<string, any>;
export declare const mergeProps: (defaultProps: object, props: object) => GenericProps;
export declare const mergeComponentProps: (defaultProps: object | null | undefined, contextProps: object | null | undefined, props: object) => readonly [object, null] | readonly [GenericProps, GenericProps | null];
//# sourceMappingURL=mergeProps.d.ts.map