import type { StoreInfo } from './interfaces';
export declare const useCurrentComponent: () => {};
export declare function useDebugStoreComponent(StoreCons: any): void;
export declare const shouldDebug: (component: any, info: Pick<StoreInfo, "storeInstance">) => boolean | undefined;
export declare const DebugComponents: Map<any, Set<any>>;
export declare const DebugStores: Set<any>;
//# sourceMappingURL=useStoreDebug.d.ts.map