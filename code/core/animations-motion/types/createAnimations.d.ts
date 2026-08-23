import { type AnimationDriverWithAnimatedNumbers } from "@tamagui/web";
import { type ValueTransition } from "motion/react";
type AnimationConfig = ValueTransition;
export declare function createAnimations<A extends Record<string, AnimationConfig>>(animations: A): AnimationDriverWithAnimatedNumbers<A>;
export declare const disableAnimationProps: Set<string>;
export {};

//# sourceMappingURL=createAnimations.d.ts.map