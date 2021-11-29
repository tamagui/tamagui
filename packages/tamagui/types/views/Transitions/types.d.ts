import { StackProps } from '@tamagui/core';
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
export declare type IFadeProps = StackProps & {
    in?: boolean;
    entryDuration?: number;
    exitDuration?: number;
    delay?: number;
};
export declare type IScaleFadeProps = StackProps & {
    in?: boolean;
    duration?: number;
    delay?: number;
    initialScale?: number;
};
export declare type ISlideProps = StackProps & {
    in?: boolean;
    duration?: number;
    delay?: number;
    placement?: 'top' | 'bottom' | 'right' | 'left';
};
export declare type ISlideFadeProps = StackProps & {
    in?: boolean;
    delay?: number;
    duration?: number;
    offsetX?: number;
    offsetY?: number;
};
export interface ISupportedTransitions {
    opacity?: number;
    translateY?: number;
    translateX?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    rotate?: string;
}
export interface ITransitionConfig {
    type?: 'timing' | 'spring';
    easing?: (value: number) => number;
    overshootClamping?: boolean;
    restDisplacementThreshold?: number;
    restSpeedThreshold?: number;
    velocity?: number | {
        x: number;
        y: number;
    };
    bounciness?: number;
    speed?: number;
    tension?: number;
    friction?: number;
    stiffness?: number;
    mass?: number;
    damping?: number;
    delay?: number;
    duration?: number;
    useNativeDriver?: boolean;
}
export interface ITransitionStyleProps extends ISupportedTransitions {
    transition?: ITransitionConfig;
}
export interface ITransitionProps extends ViewProps {
    onTransitionComplete?: (s: 'entered' | 'exited') => any;
    initial?: ISupportedTransitions;
    animate?: ITransitionStyleProps;
    exit?: ITransitionStyleProps;
    visible?: boolean;
    children?: any;
    as?: any;
}
export interface IPresenceTransitionProps extends ViewProps {
    onTransitionComplete?: (s: 'entered' | 'exited') => any;
    initial?: ISupportedTransitions;
    animate?: ITransitionStyleProps;
    exit?: ITransitionStyleProps;
    visible?: boolean;
    children?: ReactNode;
    as?: ReactNode;
}
//# sourceMappingURL=types.d.ts.map