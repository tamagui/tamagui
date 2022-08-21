import { RefObject } from 'react';
import { View, ViewStyle } from 'react-native';
import { PseudoStyles, SplitStyleState, StaticConfigParsed, TamaguiComponentState, UseAnimationHook } from '../types';
declare type FeatureUtils = {
    forceUpdate: Function;
    state: SplitStyleState;
    setStateShallow: (next: Partial<TamaguiComponentState>) => void;
    useAnimations?: UseAnimationHook;
    pseudos: PseudoStyles;
    style: ViewStyle | null | undefined;
    staticConfig: StaticConfigParsed;
    theme: any;
    onDidAnimate?: () => void;
    hostRef: RefObject<HTMLElement | View>;
};
export declare const useFeatures: (props: any, utils?: FeatureUtils) => {
    elements: JSX.Element[];
    enabled: {
        mediaQuery?: boolean | undefined;
    };
};
export {};
//# sourceMappingURL=useFeatures.d.ts.map