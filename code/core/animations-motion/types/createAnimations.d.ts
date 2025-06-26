import { type AnimationDriver } from "@tamagui/web";
type SpringConfig = {
	type: "spring";
	stiffness?: number;
	damping?: number;
	mass?: number;
	velocity?: number;
	restSpeed?: number;
	restDelta?: number;
};
type TimeConfig = {
	type: "time";
	duration?: number;
	ease?: string | number[];
};
type AnimationConfig = SpringConfig | TimeConfig;
export declare function createAnimations<A extends Record<string, AnimationConfig>>(animations: A): AnimationDriver<A>;
export {};

//# sourceMappingURL=createAnimations.d.ts.map