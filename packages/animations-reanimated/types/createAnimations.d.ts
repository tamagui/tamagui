import { AnimationDriver } from '@tamagui/core';
import { WithDecayConfig, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';
type AnimationsConfig<A extends Object = any> = {
    [Key in keyof A]: AnimationConfig;
};
type AnimationConfig = ({
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
export declare function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A>;
export {};
//# sourceMappingURL=createAnimations.d.ts.map