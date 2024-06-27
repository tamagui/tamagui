import type { StoreInfo } from './interfaces';
export declare function getStoreUid(Constructor: any, props: string | Object | void): any;
export declare const UNWRAP_STORE_INFO: unique symbol;
export declare const cache: Map<string, StoreInfo>;
export declare function getStoreDescriptors(storeInstance: any): {
    [x: string]: TypedPropertyDescriptor<any> & PropertyDescriptor;
};
export declare function get<A>(_: A, b?: any): A extends new (props?: any) => infer B ? B : A;
export declare function simpleStr(arg: any): any;
export declare function getStoreDebugInfo(store: any): any;
//# sourceMappingURL=helpers.d.ts.map