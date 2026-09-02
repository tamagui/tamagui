import { type AnimationsConfig } from "@tamagui/animation-helpers";
import type { AnimationDriverWithAnimatedNumbers, UniversalAnimatedNumber, UseAnimatedNumberReaction, UseAnimatedNumberStyle } from "@tamagui/web";
import { Animated, type Text, type View } from "react-native";
type CreateAnimationsOptions = {
	useNativeDriver?: boolean;
};
export declare const AnimatedView: Animated.AnimatedComponent<typeof View>;
export declare const AnimatedText: Animated.AnimatedComponent<typeof Text>;
export declare function useAnimatedNumber(initial: number): UniversalAnimatedNumber<Animated.Value>;
type RNAnimatedNum = UniversalAnimatedNumber<Animated.Value>;
export declare const useAnimatedNumberReaction: UseAnimatedNumberReaction<RNAnimatedNum>;
export declare const useAnimatedNumberStyle: UseAnimatedNumberStyle<RNAnimatedNum>;
export declare const useAnimatedNumbersStyle: (vals: RNAnimatedNum[], getStyle: (...currentValues: any[]) => any) => any;
export declare function createAnimations<A extends AnimationsConfig>(animations: A, options?: CreateAnimationsOptions): AnimationDriverWithAnimatedNumbers<A>;
export {};

//# sourceMappingURL=createAnimations.d.ts.map