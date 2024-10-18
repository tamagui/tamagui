import type { MediaQueryKey, UseMediaState } from '@tamagui/core';
import React from 'react';
type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never;
export type AdaptProps = {
    when?: MediaQueryKeyString | ((state: {
        media: UseMediaState;
    }) => boolean);
    platform?: 'native' | 'web' | 'touch' | 'ios' | 'android';
    children: JSX.Element | ((state: {
        enabled: boolean;
        media: UseMediaState;
    }) => JSX.Element);
};
type When = MediaQueryKeyString | boolean | null;
type Component = (props: any) => any;
type AdaptParentContextI = {
    Contents: Component;
    setWhen: (when: When) => any;
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
};
export declare const Adapt: (({ platform, when, children }: AdaptProps) => JSX.Element | null) & {
    Contents: {
        (props: any): React.FunctionComponentElement<any>;
        shouldForwardSpace: boolean;
    };
};
export {};
//# sourceMappingURL=Adapt.d.ts.map