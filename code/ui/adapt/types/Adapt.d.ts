import type { MediaQueryKey, UseMediaState } from '@tamagui/core';
import React from 'react';
type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never;
export type AdaptProps = {
    when?: MediaQueryKeyString | ((state: {
        media: UseMediaState;
    }) => boolean);
    platform?: 'native' | 'web' | 'touch' | 'ios' | 'android';
    children: JSX.Element | ((children: React.ReactNode) => React.ReactNode);
};
type When = MediaQueryKeyString | boolean | null;
type Component = (props: any) => any;
type AdaptParentContextI = {
    Contents: Component;
    when?: When;
    setWhen: (when: When) => any;
    setChildren: (children: any) => any;
    portalName?: string;
};
export declare const AdaptParentContext: React.Context<AdaptParentContextI | null>;
export declare const AdaptContents: {
    (props: any): React.FunctionComponentElement<any>;
    shouldForwardSpace: boolean;
};
export declare const useAdaptParent: (props: {
    Contents: AdaptParentContextI["Contents"];
} | {
    portal: string;
    forwardProps?: any;
    name?: string;
}) => {
    AdaptProvider: (props: {
        children?: any;
    }) => import("react/jsx-runtime").JSX.Element;
    when: When;
    children: null;
};
export declare const Adapt: (({ platform, when, children }: AdaptProps) => React.ReactNode) & {
    Contents: {
        (props: any): React.FunctionComponentElement<any>;
        shouldForwardSpace: boolean;
    };
};
export declare const AdaptPortalContents: (props: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAdaptWhenIsActive: (breakpoint?: MediaQueryKey | null | boolean) => boolean;
export {};
//# sourceMappingURL=Adapt.d.ts.map