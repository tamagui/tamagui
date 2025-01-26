import type { AnimationDriver, UniversalAnimatedNumber, UseAnimatedNumberReaction, UseAnimatedNumberStyle } from "@tamagui/web";
import { Animated, type Text, type View } from "react-native";
type AnimationsConfig<A extends Object = any> = { [Key in keyof A] : AnimationConfig };
type SpringConfig = { type?: "spring" } & Partial<Pick<Animated.SpringAnimationConfig, "delay" | "bounciness" | "damping" | "friction" | "mass" | "overshootClamping" | "speed" | "stiffness" | "tension" | "velocity">>;
type TimingConfig = { type: "timing" } & Partial<Animated.TimingAnimationConfig>;
type AnimationConfig = SpringConfig | TimingConfig;
export declare const AnimatedView: Animated.AnimatedComponent<typeof View>;
export declare const AnimatedText: Animated.AnimatedComponent<typeof Text>;
export declare function useAnimatedNumber(initial: number): UniversalAnimatedNumber<Animated.Value>;
type RNAnimatedNum = UniversalAnimatedNumber<Animated.Value>;
export declare const useAnimatedNumberReaction: UseAnimatedNumberReaction<RNAnimatedNum>;
export declare const useAnimatedNumberStyle: UseAnimatedNumberStyle<RNAnimatedNum>;
export declare function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A>;
export {};

//# sourceMappingURL=createAnimations.d.ts.map