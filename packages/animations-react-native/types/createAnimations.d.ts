import { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/core';
import { Animated } from 'react-native';
declare type AnimationsConfig<A extends Object = any> = {
    [Key in keyof A]: AnimationConfig;
};
declare type AnimationConfig = Partial<Pick<Animated.SpringAnimationConfig, 'delay' | 'bounciness' | 'damping' | 'friction' | 'mass' | 'overshootClamping' | 'speed' | 'stiffness' | 'tension' | 'velocity'>>;
export declare const AnimatedView: Animated.AnimatedComponent<typeof import("react-native").View>;
export declare const AnimatedText: Animated.AnimatedComponent<typeof import("react-native").Text>;
export declare function useAnimatedNumber(initial: number): UniversalAnimatedNumber<Animated.Value>;
export declare function useAnimatedNumberReaction(value: UniversalAnimatedNumber<Animated.Value>, cb: (current: number) => void): void;
export declare function useAnimatedNumberStyle<V extends UniversalAnimatedNumber<Animated.Value>>(value: V, getStyle: (value: any) => any): any;
export declare function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A>;
export {};
//# sourceMappingURL=createAnimations.d.ts.map