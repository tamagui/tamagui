import type { ComponentContextI, StaticConfig, TamaguiComponentState, TamaguiComponentStateRef, TamaguiInternalConfig, TextProps } from '../types';
import type { ViewProps } from '../views/View';
export declare const useComponentState: (props: ViewProps | TextProps | Record<string, any>, animationDriver: ComponentContextI['animationDriver'], staticConfig: StaticConfig, config: TamaguiInternalConfig) => {
    props: Record<string, any> | TextProps | ViewProps;
    startedUnhydrated: boolean;
    curStateRef: TamaguiComponentStateRef;
    disabled: any;
    groupName: string | undefined;
    hasAnimationProp: boolean;
    hasEnterStyle: boolean;
    isAnimated: boolean;
    isExiting: boolean;
    isHydrated: boolean;
    presence: import("..").UsePresenceResult | null;
    presenceState: import("..").PresenceContextProps | null | undefined;
    setState: import("react").Dispatch<import("react").SetStateAction<TamaguiComponentState>>;
    setStateShallow: import("..").ComponentSetStateShallow;
    noClass: boolean;
    state: TamaguiComponentState;
    stateRef: import("react").RefObject<TamaguiComponentStateRef>;
    inputStyle: "css" | "value";
    outputStyle: "css" | "inline";
    willBeAnimated: boolean;
    willBeAnimatedClient: boolean;
    platformPseudo: boolean;
};
//# sourceMappingURL=useComponentState.d.ts.map