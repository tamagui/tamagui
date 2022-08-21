import { AnimationConfigType, AnimationDriver, UniversalAnimatedNumber } from '@tamagui/core';
import { AnimationControls } from 'motion';
import { Text, View } from 'react-native';
export declare const AnimatedView: typeof View;
export declare const AnimatedText: typeof Text;
export declare function useAnimatedNumber(initial: number): UniversalAnimatedNumber<AnimationControls | null>;
export declare function useAnimatedNumberReaction(value: UniversalAnimatedNumber<any>, cb: (current: number) => void): void;
export declare function useAnimatedNumberStyle<V extends UniversalAnimatedNumber<any>>(value: V, getStyle: (value: any) => any): any;
export declare function createAnimations<A extends AnimationConfigType>(animations: A): AnimationDriver<A>;
//# sourceMappingURL=createAnimations.d.ts.map