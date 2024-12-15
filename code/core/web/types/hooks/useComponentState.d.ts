import type { ComponentContextI, StackProps, StaticConfig, TamaguiComponentState, TamaguiComponentStateRef, TamaguiInternalConfig, TextProps } from '../types';
export declare const useComponentState: (props: StackProps | TextProps | Record<string, any>, { animationDriver, groups }: ComponentContextI, staticConfig: StaticConfig, config: TamaguiInternalConfig) => {
    curStateRef: TamaguiComponentStateRef;
    disabled: any;
    groupName: string;
    hasAnimationProp: boolean;
    hasEnterStyle: boolean;
    isAnimated: boolean;
    isExiting: boolean;
    isHydrated: boolean;
    presence: import("../types").UsePresenceResult | null;
    presenceState: import("../types").PresenceContextProps | null | undefined;
    setState: import("react").Dispatch<import("react").SetStateAction<TamaguiComponentState>>;
    setStateShallow: (next?: Partial<TamaguiComponentState> | undefined) => void;
    noClass: boolean;
    state: TamaguiComponentState;
    stateRef: import("react").MutableRefObject<TamaguiComponentStateRef>;
    supportsCSSVars: boolean | undefined;
    willBeAnimated: boolean;
    willBeAnimatedClient: boolean;
};
//# sourceMappingURL=useComponentState.d.ts.map