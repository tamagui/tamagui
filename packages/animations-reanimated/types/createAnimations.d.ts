import { AnimationDriver } from '@tamagui/core';
import { WithDecayConfig, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';
declare type AnimationsConfig<A extends Object = any> = {
    [Key in keyof A]: AnimationConfig;
};
declare type AnimationConfig = ({
    type: 'timing';
    loop?: number;
} & WithTimingConfig) | ({
    type: 'spring';
    loop?: number;
} & WithSpringConfig) | ({
    type: 'decay';
    loop?: number;
} & WithDecayConfig);
export declare function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A>;
export {};
//# sourceMappingURL=createAnimations.d.ts.map