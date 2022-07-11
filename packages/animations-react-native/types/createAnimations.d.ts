import { AnimationDriver } from '@tamagui/core';
import { Animated } from 'react-native';
declare type AnimationsConfig<A extends Object = any> = {
    [Key in keyof A]: AnimationConfig;
};
declare type AnimationConfig = Partial<Pick<Animated.SpringAnimationConfig, 'delay' | 'bounciness' | 'damping' | 'friction' | 'mass' | 'overshootClamping' | 'speed' | 'stiffness' | 'tension' | 'velocity'>>;
export declare function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A>;
export {};
//# sourceMappingURL=createAnimations.d.ts.map