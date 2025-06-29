import { type SizeTokens } from '@tamagui/core';
import type { Direction, SliderContextValue } from './types';
export declare const SLIDER_NAME = "Slider";
export declare const SliderContext: import("@tamagui/core").StyledContext<SliderContextValue>;
export declare const SliderProvider: import("react").Provider<SliderContextValue> & import("react").ProviderExoticComponent<Partial<SliderContextValue> & {
    children?: import("react").ReactNode;
    scope?: string;
}>, useSliderContext: (scope?: string) => SliderContextValue;
export declare const SliderOrientationProvider: import("react").Provider<{
    startEdge: "bottom" | "left" | "right";
    endEdge: "top" | "right" | "left";
    sizeProp: "width" | "height";
    size: number | SizeTokens;
    direction: number;
}> & import("react").ProviderExoticComponent<Partial<{
    startEdge: "bottom" | "left" | "right";
    endEdge: "top" | "right" | "left";
    sizeProp: "width" | "height";
    size: number | SizeTokens;
    direction: number;
}> & {
    children?: import("react").ReactNode;
    scope?: string;
}>, useSliderOrientationContext: (scope?: string) => {
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