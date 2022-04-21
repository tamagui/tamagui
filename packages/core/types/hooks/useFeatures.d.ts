/// <reference types="react" />
import { ViewStyle } from 'react-native';
import { PseudoStyles, SplitStyleState } from '../types';
import { StaticConfigParsed, TamaguiComponentState, UseAnimationHook } from '../types';
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
};
export declare const useFeatures: (props: any, utils?: FeatureUtils | undefined) => JSX.Element[];
export {};
//# sourceMappingURL=useFeatures.d.ts.map