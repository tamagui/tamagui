import type { ComponentContextI, StaticConfig, TamaguiComponentState, TamaguiComponentStateRef, TamaguiInternalConfig, TextProps } from '../types';
import type { ViewProps } from '../views/View';
export declare const useComponentState: (props: ViewProps | TextProps | Record<string, any>, animationDriver: ComponentContextI["animationDriver"], staticConfig: StaticConfig, config: TamaguiInternalConfig) => {
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
    inputStyle: "css" | "value";
    outputStyle: "css" | "inline";
    willBeAnimated: boolean;
    willBeAnimatedClient: boolean;
};
//# sourceMappingURL=useComponentState.d.ts.map