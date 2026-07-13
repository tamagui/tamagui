import type { GetProps, SizeTokens, TamaguiElement } from '@tamagui/core';
import type { SizableStackProps } from '@tamagui/stacks';
import * as React from 'react';
import type { View } from 'react-native';
import type { SliderProps, SliderTrackProps } from './types';
export declare const SliderTrackFrame: React.FunctionComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}) | ((import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
})) & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
    orientation?: "horizontal" | "vertical" | undefined;
}> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}) | ((import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
})) & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }) | ((import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    })) & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
        orientation?: "horizontal" | "vertical" | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
declare const SliderTrack: import("@tamagui/compose-refs").RefComponent<TamaguiElement, import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>>;
export declare const SliderActiveFrame: React.FunctionComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}) | ((import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
})) & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
    orientation?: "horizontal" | "vertical" | undefined;
}> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}) | ((import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
})) & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }) | ((import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    })) & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
        orientation?: "horizontal" | "vertical" | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
type SliderActiveProps = GetProps<typeof SliderActiveFrame>;
declare const SliderActive: import("@tamagui/compose-refs").RefComponent<View, import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}) | ((import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
})) & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
    orientation?: "horizontal" | "vertical" | undefined;
}>>;
export declare const SliderThumbFrame: React.FunctionComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: number | import("@tamagui/core").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: number | import("@tamagui/core").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: number | import("@tamagui/core").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export interface SliderThumbExtraProps {
    index?: number;
}
export interface SliderThumbProps extends SizableStackProps, SliderThumbExtraProps {
}
declare const SliderThumb: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: number | import("@tamagui/core").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "index"> & SliderThumbExtraProps, View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & SliderThumbExtraProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: number | import("@tamagui/core").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const Slider: ((props: SliderProps & {
    __scopeSlider?: string;
} & import("@tamagui/compose-refs").RefProp<unknown>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Track: import("@tamagui/compose-refs").RefComponent<TamaguiElement, import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>>;
    TrackActive: import("@tamagui/compose-refs").RefComponent<View, import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }) | ((import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    })) & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: any;
        orientation?: "horizontal" | "vertical" | undefined;
    }>>;
    Thumb: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: number | import("@tamagui/core").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "index"> & SliderThumbExtraProps, View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & SliderThumbExtraProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
        size?: number | import("@tamagui/core").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
};
declare const Track: import("@tamagui/compose-refs").RefComponent<TamaguiElement, import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>>;
declare const Range: import("@tamagui/compose-refs").RefComponent<View, import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}) | ((import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
})) & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: any;
    orientation?: "horizontal" | "vertical" | undefined;
}>>;
declare const Thumb: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: number | import("@tamagui/core").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "index"> & SliderThumbExtraProps, View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & SliderThumbExtraProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
    size?: number | import("@tamagui/core").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export { Range, Slider, SliderThumb, SliderTrack, SliderActive, Thumb, Track, };
export type { SliderProps, SliderActiveProps, SliderTrackProps };
//# sourceMappingURL=Slider.d.ts.map