import React from 'react';
import type { TamaguiComponentState } from './interfaces/TamaguiComponentState';
import type { ComponentContextI, DebugProp, SpaceDirection, SpaceValue, SpacerProps, SpacerStyleProps, StackNonStyleProps, StackProps, StaticConfig, TamaguiComponent, TamaguiComponentStateRef, TamaguiElement, TamaguiInternalConfig, TextProps } from './types';
type ComponentSetState = React.Dispatch<React.SetStateAction<TamaguiComponentState>>;
export declare const componentSetStates: Set<ComponentSetState>;
export declare const useComponentState: (props: StackProps | TextProps | Record<string, any>, { animationDriver, groups }: ComponentContextI, staticConfig: StaticConfig, config: TamaguiInternalConfig) => {
    curStateRef: TamaguiComponentStateRef;
    disabled: any;
    groupName: string;
    hasAnimationProp: boolean;
    hasEnterStyle: boolean;
    isAnimated: boolean;
    isExiting: boolean;
    isHydrated: boolean;
    presence: import("./types").UsePresenceResult | null;
    presenceState: import("./types").PresenceContextProps | null | undefined;
    setState: React.Dispatch<React.SetStateAction<TamaguiComponentState>>;
    setStateShallow: (next?: Partial<TamaguiComponentState> | undefined) => void;
    shouldAvoidClasses: boolean;
    state: TamaguiComponentState;
    stateRef: React.MutableRefObject<TamaguiComponentStateRef>;
    supportsCSSVars: boolean | undefined;
    willBeAnimated: boolean;
    willBeAnimatedClient: boolean;
};
export declare function createComponent<ComponentPropTypes extends Record<string, any> = {}, Ref extends TamaguiElement = TamaguiElement, BaseProps = never, BaseStyles extends Object = never>(staticConfig: StaticConfig): TamaguiComponent<ComponentPropTypes, Ref, BaseProps, BaseStyles, {}>;
export declare function Unspaced(props: {
    children?: any;
}): any;
export declare namespace Unspaced {
    var isUnspaced: boolean;
}
export declare const Spacer: TamaguiComponent<SpacerProps, TamaguiElement, StackNonStyleProps, SpacerStyleProps, {}>;
export type SpacedChildrenProps = {
    isZStack?: boolean;
    children?: React.ReactNode;
    space?: SpaceValue;
    spaceFlex?: boolean | number;
    direction?: SpaceDirection | 'unset';
    separator?: React.ReactNode;
    debug?: DebugProp;
};
export declare function spacedChildren(props: SpacedChildrenProps): React.ReactNode;
export declare const isDisabled: (props: any) => any;
export declare const subscribeToContextGroup: ({ disabled, setStateShallow, pseudoGroups, mediaGroups, componentContext, state, }: {
    disabled?: boolean;
    setStateShallow: (next?: Partial<TamaguiComponentState> | undefined) => void;
    pseudoGroups?: Set<string>;
    mediaGroups?: Set<string>;
    componentContext: ComponentContextI;
    state: TamaguiComponentState;
}) => import("./types").DisposeFn | undefined;
export {};
//# sourceMappingURL=createComponent.d.ts.map