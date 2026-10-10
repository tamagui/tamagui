export declare function memoize(func?: Function, resolver?: any): {
    (...args: any[]): any;
    cache: Map<any, any>;
};
export declare namespace memoize {
    export { Map as Cache };
}
//# sourceMappingURL=memoize.d.ts.map