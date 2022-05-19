/// <reference types="react" />
import { SliderContextValue } from './types';
export declare const SLIDER_NAME = "Slider";
export declare const createSliderContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType | undefined) => readonly [{
    (props: ContextValueType & {
        scope: import("@tamagui/create-context").Scope<ContextValueType>;
        children: import("react").ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string, scope: import("@tamagui/create-context").Scope<ContextValueType | undefined>) => ContextValueType], createSliderScope: import("@tamagui/create-context").CreateScope;
export declare const SliderProvider: {
    (props: SliderContextValue & {
        scope: import("@tamagui/create-context").Scope<SliderContextValue>;
        children: import("react").ReactNode;
    }): JSX.Element;
    displayName: string;
}, useSliderContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<SliderContextValue | undefined>) => SliderContextValue;
export declare const SliderOrientationProvider: {
    (props: {
        startEdge: 'bottom' | 'left' | 'right';
        endEdge: 'top' | 'right' | 'left';
        sizeProp: 'width' | 'height';
        size: number;
        direction: number;
    } & {
        scope: import("@tamagui/create-context").Scope<{
            startEdge: 'bottom' | 'left' | 'right';
            endEdge: 'top' | 'right' | 'left';
            sizeProp: 'width' | 'height';
            size: number;
            direction: number;
        }>;
        children: import("react").ReactNode;
    }): JSX.Element;
    displayName: string;
}, useSliderOrientationContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<{
    startEdge: 'bottom' | 'left' | 'right';
    endEdge: 'top' | 'right' | 'left';
    sizeProp: 'width' | 'height';
    size: number;
    direction: number;
} | undefined>) => {
    startEdge: 'bottom' | 'left' | 'right';
    endEdge: 'top' | 'right' | 'left';
    sizeProp: 'width' | 'height';
    size: number;
    direction: number;
};
//# sourceMappingURL=context.d.ts.map