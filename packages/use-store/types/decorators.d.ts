export type ComparisonFn = (a: any, b: any) => boolean;
export declare function compare(comparator: ComparisonFn): (target: any, propertyKey: string) => any;
export declare const compareStrict: (target: any, propertyKey: string) => any;
export declare const compareShallow: (target: any, propertyKey: string) => any;
export declare const compareDeep: (target: any, propertyKey: string) => any;
//# sourceMappingURL=decorators.d.ts.map