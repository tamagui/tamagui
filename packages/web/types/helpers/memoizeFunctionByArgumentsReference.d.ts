/**
 * Unused for now but useful function and could replace various caches we use with some testing
 */
declare function isObject(arg: any): boolean;
declare class FunctionArgumentCache {
    map: Map<any, any>;
    weakmap: WeakMap<object, any>;
    get(args: any[]): any;
}
declare function memoizeArgumentsWeak<Fn extends Function>(fn: Fn): Fn;
//# sourceMappingURL=memoizeFunctionByArgumentsReference.d.ts.map