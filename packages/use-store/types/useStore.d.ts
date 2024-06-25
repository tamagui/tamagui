import type { Selector, Store, StoreInfo, UseStoreOptions } from './interfaces';
export declare function useStore<A, B extends Object>(StoreKlass: (new (props: B) => A) | (new () => A) | null | undefined, props?: B | null, options?: UseStoreOptions<A, any>): A;
export declare function useStoreDebug<A, B extends Object>(StoreKlass: (new (props: B) => A) | (new () => A), props?: B): A;
export declare function createStore<A, B extends Object>(StoreKlass: new (props: B) => A | (new () => A) | null | undefined, props?: B, options?: UseStoreOptions<A, any>): A;
export declare function useGlobalStore<A, B extends Object>(instance: A, debug?: boolean): A;
export declare function useGlobalStoreSelector<A, Selector extends (store: A) => any>(instance: A, selector: Selector, debug?: boolean): Selector extends (a: A) => infer C ? C : unknown;
export declare function createUseStore<Props, Store>(StoreKlass: (new (props: Props) => Store) | (new () => Store)): <Res, C extends Selector<Store, Res>, Props_1 extends Object>(props?: Props_1, options?: UseStoreOptions) => C extends Selector<any, infer B> ? (B extends Object ? B : Store) : Store;
export declare function createUseStoreSelector<A extends Store<Props>, Props extends Object, Selected>(StoreKlass: (new (props: Props) => A) | (new () => A), selector: Selector<A, Selected>): (props?: Props) => Selected;
export declare function useStoreSelector<A, B extends Object, S extends Selector<A, any>>(StoreKlass: (new (props: B) => A) | (new () => A), selector: S, props?: B): S extends Selector<any, infer R> ? R : unknown;
type StoreAccessTracker = (store: StoreInfo) => void;
export declare function trackStoresAccess(cb: StoreAccessTracker): () => void;
export declare function getStore<A, B extends Object>(StoreKlass: (new (props: B) => A) | (new () => A) | null | undefined, props?: B): A;
export declare function getOrCreateStore<A, B extends Object>(StoreKlass: (new (props: B) => A) | (new () => A) | null | undefined, props?: B): A;
export declare function getStoreInfo(StoreKlass: any, props: any): StoreInfo | null;
export type CreateStoreListener = (storeInfo: StoreInfo) => void;
export declare function onCreateStore(cb: CreateStoreListener): () => void;
export declare const allStores: {};
export declare const setIsInReaction: (val: boolean) => void;
export type StoreTracker = {
    tracked: Set<string>;
    component?: any;
    last?: any;
    lastKeys?: any;
};
export {};
//# sourceMappingURL=useStore.d.ts.map