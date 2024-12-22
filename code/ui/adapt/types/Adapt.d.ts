import type { AllPlatforms, MediaQueryKey } from '@tamagui/core';
import React from 'react';
/**
 * Interfaces
 */
export type AdaptWhen = MediaQueryKeyString | boolean | null;
export type AdaptPlatform = AllPlatforms | 'touch' | null;
type AdaptParentContextI = {
    Contents: Component;
    scopeName: string;
    platform: AdaptPlatform;
    setPlatform: (when: AdaptPlatform) => any;
    when: AdaptWhen;
    setWhen: (when: AdaptWhen) => any;
    setChildren: (children: any) => any;
    portalName?: string;
};
type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never;
export type AdaptProps = {
    scope?: string;
    when?: AdaptWhen;
    platform?: AdaptPlatform;
    children: JSX.Element | ((children: React.ReactNode) => React.ReactNode);
};
type Component = (props: any) => any;
export declare const AdaptContext: import("@tamagui/core").StyledContext<AdaptParentContextI>;
export declare const ProvideAdaptContext: ({ children, ...context }: AdaptParentContextI & {
    children: any;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAdaptContext: (scope?: string) => AdaptParentContextI;
/**
 * Hooks
 */
type AdaptParentProps = {
    children?: React.ReactNode;
    scope: string;
    Contents?: AdaptParentContextI['Contents'];
    portal?: boolean | {
        forwardProps?: any;
    };
};
export declare const AdaptParent: ({ children, Contents, scope, portal }: AdaptParentProps) => import("react/jsx-runtime").JSX.Element;
/**
 * Components
 */
export declare const AdaptContents: {
    ({ scope, ...rest }: {
        scope?: string;
    }): React.FunctionComponentElement<any>;
    shouldForwardSpace: boolean;
};
export declare const Adapt: ((props: AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
    Contents: {
        ({ scope, ...rest }: {
            scope?: string;
        }): React.FunctionComponentElement<any>;
        shouldForwardSpace: boolean;
    };
};
export declare const AdaptPortalContents: (props: {
    children: React.ReactNode;
    scope?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAdaptIsActive: (scope?: string) => boolean;
export {};
//# sourceMappingURL=Adapt.d.ts.map