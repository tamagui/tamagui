import type { ComponentContextI, StackProps, StaticConfig, TamaguiComponentState, TamaguiComponentStateRef, TamaguiInternalConfig, TextProps } from '../types';
export declare const useComponentState: (props: StackProps | TextProps | Record<string, any>, animationDriver: ComponentContextI["animationDriver"], staticConfig: StaticConfig, config: TamaguiInternalConfig) => {
    startedUnhydrated: boolean;
    curStateRef: TamaguiComponentStateRef;
    disabled: any;
    groupName: string | undefined;
    hasAnimationProp: boolean;
    hasEnterStyle: boolean;
    isAnimated: boolean;
    isExiting: boolean;
    isHydrated: boolean;
    presence: import("../types").UsePresenceResult | null;
    presenceState: import("../types").PresenceContextProps | null | undefined;
    setState: import("react").Dispatch<import("react").SetStateAction<TamaguiComponentState>>;
    setStateShallow: import("react").Dispatch<import("react").SetStateAction<Partial<TamaguiComponentState>>>;
    noClass: boolean;
    state: TamaguiComponentState;
    stateRef: import("react").RefObject<TamaguiComponentStateRef>;
    supportsCSS: boolean | undefined;
    willBeAnimated: boolean;
    willBeAnimatedClient: boolean;
};
//# sourceMappingURL=useComponentState.d.ts.map