import { AnimationDriver } from '@tamagui/core';
declare type AnimationsConfig<A extends Object = any> = {
    [Key in keyof A]: AnimationConfig;
};
declare type AnimationConfig = {};
export declare function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A>;
export {};
//# sourceMappingURL=createAnimations.d.ts.map