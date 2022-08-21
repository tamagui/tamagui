import { BrowserHistory } from 'history';
import React from 'react';
import { LocationServerProps, ServerProps } from '../../foundation/ServerPropsProvider/ServerPropsProvider.jsx';
declare type SetServerProps = React.Dispatch<React.SetStateAction<ServerProps>>;
export interface ShopifyProviderOptions {
    setServerProps?: SetServerProps;
    serverProps?: LocationServerProps;
    history?: BrowserHistory;
}
export interface ShopifyProviderContext {
    setServerProps: SetServerProps;
    serverProps: LocationServerProps;
    history?: BrowserHistory;
}
export declare const mountWithProviders: import("@shopify/react-testing").CustomMount<ShopifyProviderOptions, ShopifyProviderContext, false>;
export {};
//# sourceMappingURL=mount.d.ts.map