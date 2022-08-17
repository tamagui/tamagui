import React, { FC, ReactNode } from 'react';
declare type RouteParamsContextValue = {
    routeParams: Record<string, string>;
    basePath: string;
};
export declare const RouteParamsContext: React.Context<RouteParamsContextValue>;
export declare const RouteParamsProvider: FC<{
    routeParams: Record<string, string>;
    basePath: string;
    children: ReactNode;
}>;
export declare function useBasePath(): string;
export {};
//# sourceMappingURL=RouteParamsProvider.client.d.ts.map