import { Selector, UseStoreOptions } from './interfaces';
import { Store } from './Store';
export declare function useStore<A extends Store<B>, B extends Object>(StoreKlass: (new (props: B) => A) | (new () => A), props?: B, options?: UseStoreOptions<A, any>): A;
export declare function useStoreDebug<A extends Store<B>, B extends Object>(StoreKlass: (new (props: B) => A) | (new () => A), props?: B): A;
export declare function createStore<A extends Store<B>, B extends Object>(StoreKlass: new (props: B) => A | (new () => A), props?: B, options?: UseStoreOptions<A, any>): A;
export declare function useGlobalStore<A extends Store<B>, B extends Object>(instance: A, debug?: boolean): A;
export declare function useGlobalStoreSelector<A extends Store<B>, B extends Object, Selector extends (store: A) => any>(instance: A, selector: Selector, debug?: boolean): Selector extends (a: A) => infer C ? C : unknown;
export declare function createUseStore<Props, Store>(StoreKlass: (new (props: Props) => Store) | (new () => Store)): <Res, C extends Selector<Store, Res>, Props_1 extends Object>(props?: Props_1 | undefined, options?: UseStoreOptions) => C extends Selector<any, infer B> ? B extends Object ? B : Store : Store;
export declare function createUseStoreSelector<A extends Store<Props>, Props extends Object, Selected>(StoreKlass: (new (props: Props) => A) | (new () => A), selector: Selector<A, Selected>): (props?: Props) => Selected;
export declare function useStoreSelector<A extends Store<B>, B extends Object, S extends Selector<any, Selected>, Selected>(StoreKlass: (new (props: B) => A) | (new () => A), selector: S, props?: B): Selected;
type StoreAccessTracker = (store: any) => void;
export declare function trackStoresAccess(cb: StoreAccessTracker): () => void;
export declare function getStore<A extends Store<B>, B extends Object>(StoreKlass: (new (props: B) => A) | (new () => A), props?: B): A;
export declare const allStores: {};
export declare const setIsInReaction: (val: boolean) => void;
export {};
//# sourceMappingURL=useStore.d.ts.map