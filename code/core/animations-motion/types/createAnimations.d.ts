import { type AnimationDriver } from "@tamagui/core";
import { type ValueTransition } from "motion/react";
type AnimationConfig = ValueTransition;
export declare function createAnimations<A extends Record<string, AnimationConfig>>(animationsProp: A): AnimationDriver<A>;
export {};

//# sourceMappingURL=createAnimations.d.ts.map