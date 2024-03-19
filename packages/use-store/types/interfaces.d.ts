import type { StoreTracker } from './useStore';
export type Selector<A = unknown, B = unknown> = (x: A) => B;
export type UseStoreSelector<Store, Res> = (store: Store) => Res;
export type UseStoreOptions<Store = any, SelectorRes = any> = {
    debug?: boolean;
    selector?: UseStoreSelector<Store, SelectorRes>;
    once?: boolean;
};
export interface Store<Props = Record<string, any> | null | undefined> {
    new (...args: any[]): any;
    props: Props;
}
export type StoreInfo<A = Store> = {
    uid: string;
    keyComparators?: {
        [key: string]: (a: any, b: any) => boolean;
    };
    store: A;
    props: Record<string, any> | null;
    storeInstance: any;
    getters: {
        [key: string]: any;
    };
    actions: any;
    stateKeys: Set<string>;
    debug?: boolean;
    gettersState: {
        getCache: Map<string, any>;
        depsToGetter: Map<string, Set<string>>;
        curGetKeys: Set<string>;
        isGetting: boolean;
    };
    listeners: Set<Function>;
    trackers: Set<StoreTracker>;
    version: number;
    subscribe: (onChanged: () => void) => () => void;
    triggerUpdate: Function;
    disableTracking: boolean;
};
export type UseStoreConfig = {
    logLevel?: 'debug' | 'info' | 'error';
};
//# sourceMappingURL=interfaces.d.ts.map