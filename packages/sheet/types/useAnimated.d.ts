import { Animated, TextStyle, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
export declare function useAnimated(): {
    View: any;
    Text: any;
};
declare type UniversalAnimatedNumber<A> = {
    getInstance(): A;
    getValue(): number;
    setValue(next: number): void;
};
export declare function useAnimatedNumberReanimated(initial: number): UniversalAnimatedNumber<SharedValue<number>>;
export declare function useAnimatedNumberReactionReanimated(value: UniversalAnimatedNumber<SharedValue<number>>, cb: (current: number) => void): void;
export declare function useAnimatedNumberStyleReanimated<V extends UniversalAnimatedNumber<Animated.Value>>(value: V, getStyle: (value: V) => ViewStyle | TextStyle): ViewStyle | TextStyle;
export declare function useAnimatedNumber(initial: number): UniversalAnimatedNumber<Animated.Value>;
export declare function useAnimatedNumberReaction(value: UniversalAnimatedNumber<Animated.Value>, cb: (current: number) => void): void;
export declare function useAnimatedNumberStyle<V extends UniversalAnimatedNumber<Animated.Value>>(value: V, getStyle: (value: V) => ViewStyle | TextStyle): ViewStyle | TextStyle;
export {};
//# sourceMappingURL=useAnimated.d.ts.map