/// <reference types="react" />
import { PerpectiveTransform, RotateTransform, RotateXTransform, RotateYTransform, RotateZTransform, ScaleTransform, ScaleXTransform, ScaleYTransform, SkewXTransform, SkewYTransform, TranslateXTransform, TranslateYTransform } from 'react-native';
import { StackProps } from '../types';
declare type AnimatableProps = Partial<Pick<StackProps, 'backgroundColor' | 'borderColor' | 'opacity'> & PerpectiveTransform & RotateTransform & RotateXTransform & RotateYTransform & RotateZTransform & ScaleTransform & ScaleXTransform & ScaleYTransform & TranslateXTransform & TranslateYTransform & SkewXTransform & SkewYTransform>;
export declare type AnimatedStackProps = StackProps & {
    animateState?: 'in' | 'out';
    velocity?: number;
    animation?: {
        from: AnimatableProps;
        to: AnimatableProps;
    };
};
export declare const AnimatedStack: ({ animateState, animation, velocity, children, animated, ...props }: AnimatedStackProps) => JSX.Element;
export {};
//# sourceMappingURL=Animated.d.ts.map