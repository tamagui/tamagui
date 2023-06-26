import { StoreInfo } from './interfaces';
export declare function getStoreUid(Constructor: any, props: string | Object | void): string;
export declare const UNWRAP_STORE_INFO: unique symbol;
export declare const cache: Map<string, StoreInfo>;
export declare function getStoreDescriptors(storeInstance: any): {
    [x: string]: TypedPropertyDescriptor<any> & PropertyDescriptor;
};
export declare function get<A>(_: A, b?: any): A extends new (props?: any) => infer B ? B : A;
export declare function getKey(props: Object): string;
export default function useConstant<T>(fn: () => T): T;
export declare function simpleStr(arg: any): any;
export declare function getStoreDebugInfo(store: any): any;
//# sourceMappingURL=helpers.d.ts.map