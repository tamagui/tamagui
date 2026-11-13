export { ClientOnly, ClientOnlyContext } from "./ClientOnly.js";
export declare const useIsClientOnly: () => boolean;
export declare function useDidFinishSSR(): boolean;
type FunctionOrValue<Value> = Value extends () => infer X ? X : Value;
export declare function useClientValue<Value>(value?: Value): FunctionOrValue<Value> | undefined;

//# sourceMappingURL=index.d.ts.map