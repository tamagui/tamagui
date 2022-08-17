import { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/core';
import { SharedValue, WithDecayConfig, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';
declare type AnimationsConfig<A extends Object = any> = {
    [Key in keyof A]: AnimationConfig;
};
declare type AnimationConfig = ({
    type: 'timing';
    loop?: number;
    repeat?: number;
    repeatReverse?: boolean;
} & WithTimingConfig) | ({
    type: 'spring';
    loop?: number;
    repeat?: number;
    repeatReverse?: boolean;
} & WithSpringConfig) | ({
    type: 'decay';
    loop?: number;
    repeat?: number;
    repeatReverse?: boolean;
} & WithDecayConfig);
declare type ReanimatedAnimatedNumber = SharedValue<number>;
export declare function useAnimatedNumber(initial: number): UniversalAnimatedNumber<ReanimatedAnimatedNumber>;
export declare function useAnimatedNumberReaction(value: UniversalAnimatedNumber<ReanimatedAnimatedNumber>, cb: (current: number) => void): void;
export declare function useAnimatedNumberStyle<V extends UniversalAnimatedNumber<ReanimatedAnimatedNumber>>(value: V, getStyle: (value: number) => any): any;
export declare function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A>;
export {};
//# sourceMappingURL=createAnimations.d.ts.map