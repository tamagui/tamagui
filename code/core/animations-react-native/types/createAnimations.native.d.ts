import { type AnimationsConfig } from "@tamagui/animation-helpers";
import type { AnimationDriverWithAnimatedNumbers, UniversalAnimatedNumber, UseAnimatedNumberReaction, UseAnimatedNumberStyle } from "@tamagui/web";
import { Animated } from "react-native";
import type { CreateAnimationsOptions } from "./types";
export declare const AnimatedView: typeof Animated.View;
export declare const AnimatedText: typeof Animated.Text;
export declare function useAnimatedNumber(initial: number): UniversalAnimatedNumber<Animated.Value>;
type RNAnimatedNum = UniversalAnimatedNumber<Animated.Value>;
export declare const useAnimatedNumberReaction: UseAnimatedNumberReaction<RNAnimatedNum>;
export declare const useAnimatedNumberStyle: UseAnimatedNumberStyle<RNAnimatedNum>;
export declare const useAnimatedNumbersStyle: (vals: RNAnimatedNum[], getStyle: (...currentValues: any[]) => any) => any;
export declare function createAnimations<A extends AnimationsConfig>(animations: A, options?: CreateAnimationsOptions): AnimationDriverWithAnimatedNumbers<A>;
export {};

//# sourceMappingURL=createAnimations.native.d.ts.map