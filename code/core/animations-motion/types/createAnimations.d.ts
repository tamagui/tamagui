import type { AnimationDriver } from "@tamagui/web";
import { type ValueTransition } from "motion/react";
type AnimationConfig = ValueTransition;
export declare function createAnimations<A extends Record<string, AnimationConfig>>(animations: A): AnimationDriver<A>;
export {};

//# sourceMappingURL=createAnimations.d.ts.map