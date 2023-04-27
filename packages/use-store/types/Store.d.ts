export declare const TRIGGER_UPDATE: unique symbol;
export declare const ADD_TRACKER: unique symbol;
export declare const TRACK: unique symbol;
export declare const SHOULD_DEBUG: unique symbol;
export type StoreTracker = {
    isTracking: boolean;
    tracked: Set<string>;
    dispose: () => void;
    component?: any;
    firstRun: boolean;
    last?: any;
    lastKeys?: any;
};
export declare const disableTracking: WeakMap<object, any>;
export declare const setDisableStoreTracking: (storeInstance: any, val: boolean) => void;
export declare class Store<Props extends Object = {}> {
    props: Props;
    private _listeners;
    private _trackers;
    _version: number;
    constructor(props: Props);
    subscribe: (onChanged: Function) => () => void;
    [TRIGGER_UPDATE](): void;
    [ADD_TRACKER](tracker: StoreTracker): () => void;
    [TRACK](key: string, debug?: boolean): void;
    [SHOULD_DEBUG](): boolean;
}
//# sourceMappingURL=Store.d.ts.map