import { BrowserHistory, Location } from 'history';
import React, { FC, ReactNode } from 'react';
declare type RouterContextValue = {
    history: BrowserHistory;
    location: Location;
};
export declare const RouterContext: React.Context<RouterContextValue | undefined>;
export declare const BrowserRouter: FC<{
    history?: BrowserHistory;
    children: ReactNode;
}>;
export declare function useRouter(): RouterContextValue;
export declare function useLocation(): Location;
export {};
//# sourceMappingURL=BrowserRouter.client.d.ts.map