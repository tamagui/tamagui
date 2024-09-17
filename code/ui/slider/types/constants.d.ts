import type { SizeTokens } from '@tamagui/core';
import type { Direction, SliderContextValue } from './types';
export declare const SLIDER_NAME = "Slider";
export declare const createSliderContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType) => readonly [{
    (props: ContextValueType & {
        scope: import("@tamagui/create-context").Scope<ContextValueType>;
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, (consumerName: string, scope: import("@tamagui/create-context").Scope<ContextValueType | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<ContextValueType>;
}) => ContextValueType], createSliderScope: import("@tamagui/create-context").CreateScope;
export declare const SliderProvider: {
    (props: SliderContextValue & {
        scope: import("@tamagui/create-context").Scope<SliderContextValue>;
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, useSliderContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<SliderContextValue | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<SliderContextValue> | undefined;
} | undefined) => SliderContextValue;
export declare const SliderOrientationProvider: {
    (props: {
        startEdge: "bottom" | "left" | "right";
        endEdge: "top" | "right" | "left";
        sizeProp: "width" | "height";
        size: number | SizeTokens;
        direction: number;
    } & {
        scope: import("@tamagui/create-context").Scope<{
            startEdge: "bottom" | "left" | "right";
            endEdge: "top" | "right" | "left";
            sizeProp: "width" | "height";
            size: number | SizeTokens;
            direction: number;
        }>;
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, useSliderOrientationContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<{
    startEdge: "bottom" | "left" | "right";
    endEdge: "top" | "right" | "left";
    sizeProp: "width" | "height";
    size: number | SizeTokens;
    direction: number;
} | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<{
        startEdge: "bottom" | "left" | "right";
        endEdge: "top" | "right" | "left";
        sizeProp: "width" | "height";
        size: number | SizeTokens;
        direction: number;
    }> | undefined;
} | undefined) => {
    startEdge: "bottom" | "left" | "right";
    endEdge: "top" | "right" | "left";
    sizeProp: "width" | "height";
    size: number | SizeTokens;
    direction: number;
};
export declare const PAGE_KEYS: string[];
export declare const ARROW_KEYS: string[];
export declare const BACK_KEYS: Record<Direction, string[]>;
//# sourceMappingURL=constants.d.ts.map