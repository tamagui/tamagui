import { ViewStyle } from 'react-native';
import { ComponentState } from '../defaultComponentState';
import { UseAnimationHook } from '../types';
declare type FeatureUtils = {
    forceUpdate: Function;
    state: ComponentState;
    setStateShallow: (next: Partial<ComponentState>) => void;
    useAnimations?: UseAnimationHook;
    pseudos: any;
    style: ViewStyle | null | undefined;
};
export declare const useFeatures: (props: any, utils?: FeatureUtils | undefined) => JSX.Element[];
export {};
//# sourceMappingURL=useFeatures.d.ts.map