export { ClientOnly, ClientOnlyContext } from "./ClientOnly";
export declare const useIsClientOnly: () => boolean;
export declare function useDidFinishSSR<A = boolean>(value?: A): A | false;
type FunctionOrValue<Value> = Value extends () => infer X ? X : Value;
export declare function useClientValue<Value>(value?: Value): FunctionOrValue<Value> | undefined;

//# sourceMappingURL=index.d.ts.map