import type { AllPlatforms, MediaQueryKey } from '@tamagui/core';
import React from 'react';
type AdaptSlotStore = {
    element: React.ReactNode;
    version: number;
    publish(element: React.ReactNode): void;
    clear(): void;
    notify(): void;
    getSnapshot(): number;
    subscribe(callback: () => void): () => void;
};
/**
 * Interfaces
 */
export type AdaptWhen = MediaQueryKeyString | boolean | null;
export type AdaptPlatform = AllPlatforms | 'touch' | null;
export type AdaptCapabilitiesValue = {
    scroll?: boolean;
    overlay?: boolean;
    dismiss?: boolean;
};
export type AdaptTargetHandoff = {
    hidden: boolean;
    skipNextAnimation?: boolean;
    onAnimationComplete: (info: {
        open: boolean;
    }) => void;
};
export type AdaptTarget<State = unknown> = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    handoff: AdaptTargetHandoff;
    state: State;
};
export type AdaptParentContextI = {
    Contents: Component;
    scopeName: string;
    platform: AdaptPlatform;
    setPlatform: (when: AdaptPlatform) => any;
    when: AdaptWhen;
    setWhen: (when: AdaptWhen) => any;
    active: boolean;
    rawActive: boolean;
    setRawActive: (active: boolean) => void;
    portalName?: string;
    lastScope?: string;
    slot: AdaptSlotStore | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    state?: unknown;
    handoff: AdaptTargetHandoff;
    targetFullyHidden: boolean;
    registerTarget: () => void;
    unregisterTarget: () => void;
    registerContents: () => void;
    unregisterContents: () => void;
    registerRenderCallback: () => void;
    unregisterRenderCallback: () => void;
};
type MediaQueryKeyString = MediaQueryKey extends string ? MediaQueryKey : never;
export type AdaptRenderState<State = unknown> = {
    active: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    state: State;
    handoff: AdaptTargetHandoff;
};
export type AdaptProps = {
    scope?: string;
    when?: AdaptWhen;
    platform?: AdaptPlatform;
    children: React.JSX.Element | ((contents: React.ReactNode, adapt: AdaptRenderState) => React.ReactNode);
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
    Contents?: AdaptParentContextI['Contents'];
    scope: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    state?: unknown;
    exitLatchTimeout?: number;
    portal?: boolean | {
        forwardProps?: any;
    };
};
export declare const AdaptParent: ({ children, Contents, scope, open, onOpenChange, state, exitLatchTimeout, }: AdaptParentProps) => import("react/jsx-runtime").JSX.Element;
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
    passThrough?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAdaptIsActive: (scope?: string) => boolean;
export declare function useAdaptTarget<State = unknown>(scope?: string): AdaptTarget<State> | null;
export declare const AdaptCapabilities: ({ children, scroll, overlay, dismiss, }: AdaptCapabilitiesValue & {
    children?: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAdaptedCapabilities: () => AdaptCapabilitiesValue;
export {};
//# sourceMappingURL=Adapt.d.ts.map
