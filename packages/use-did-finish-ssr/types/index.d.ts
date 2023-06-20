export declare function useDidFinishSSR(): boolean;
type FunctionOrValue<Value> = Value extends () => infer X ? X : Value;
export declare function useClientValue<Value extends any>(value?: Value): FunctionOrValue<Value> | undefined;
export {};
//# sourceMappingURL=index.d.ts.map