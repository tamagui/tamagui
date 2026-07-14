import React from 'react';
export declare const TabsFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    __scopeTabs?: string;
} & {
    value?: string;
    defaultValue?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
    size?: import("tamagui").TokenSize;
    orientation?: import("@tamagui/roving-focus").RovingFocusGroupProps["orientation"];
    dir?: import("@tamagui/roving-focus").RovingFocusGroupProps["dir"];
    activationMode?: "automatic" | "manual";
}, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: import("tamagui").TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: import("tamagui").TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    size?: import("tamagui").TokenSize | undefined;
}>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    __scopeTabs?: string;
} & {
    value?: string;
    defaultValue?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
    size?: import("tamagui").TokenSize;
    orientation?: import("@tamagui/roving-focus").RovingFocusGroupProps["orientation"];
    dir?: import("@tamagui/roving-focus").RovingFocusGroupProps["dir"];
    activationMode?: "automatic" | "manual";
}, import("@tamagui/web").StackStyleBase, {
    size?: import("tamagui").TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeTabs?: string;
    } & {
        value?: string;
        defaultValue?: string | undefined;
        onValueChange?: ((value: string) => void) | undefined;
        size?: import("tamagui").TokenSize;
        orientation?: import("@tamagui/roving-focus").RovingFocusGroupProps["orientation"];
        dir?: import("@tamagui/roving-focus").RovingFocusGroupProps["dir"];
        activationMode?: "automatic" | "manual";
    }, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const TabFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    __scopeTabs?: string;
} & {
    value: string;
    onInteraction?: (type: import("tamagui").InteractionType, layout: import("tamagui").TabLayout | null) => void;
    activeStyle?: import("tamagui").GetProps<typeof import("tamagui").TabsTabFrame>;
    activeTheme?: string | null;
}, "size" | "disabled" | keyof import("@tamagui/web").StackStyleBase | "active"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
    disabled?: boolean | undefined;
    active?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
    disabled?: boolean | undefined;
    active?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
    disabled?: boolean | undefined;
    active?: boolean | undefined;
}>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    __scopeTabs?: string;
} & {
    value: string;
    onInteraction?: (type: import("tamagui").InteractionType, layout: import("tamagui").TabLayout | null) => void;
    activeStyle?: import("tamagui").GetProps<typeof import("tamagui").TabsTabFrame>;
    activeTheme?: string | null;
}, import("@tamagui/web").StackStyleBase, {
    size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
    disabled?: boolean | undefined;
    active?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeTabs?: string;
    } & {
        value: string;
        onInteraction?: (type: import("tamagui").InteractionType, layout: import("tamagui").TabLayout | null) => void;
        activeStyle?: import("tamagui").GetProps<typeof import("tamagui").TabsTabFrame>;
        activeTheme?: string | null;
    }, import("@tamagui/web").StackStyleBase, {
        size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ContentFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    __scopeTabs?: string;
} & {
    value: string;
    forceMount?: boolean;
}, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: import("tamagui").TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: import("tamagui").TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    size?: import("tamagui").TokenSize | undefined;
}>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    __scopeTabs?: string;
} & {
    value: string;
    forceMount?: boolean;
}, import("@tamagui/web").StackStyleBase, {
    size?: import("tamagui").TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeTabs?: string;
    } & {
        value: string;
        forceMount?: boolean;
    }, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const CustomTabs: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    __scopeTabs?: string;
} & {
    value?: string;
    defaultValue?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
    size?: import("tamagui").TokenSize;
    orientation?: import("@tamagui/roving-focus").RovingFocusGroupProps["orientation"];
    dir?: import("@tamagui/roving-focus").RovingFocusGroupProps["dir"];
    activationMode?: "automatic" | "manual";
}, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: import("tamagui").TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: import("tamagui").TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    size?: import("tamagui").TokenSize | undefined;
}>> & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    __scopeTabs?: string;
} & {
    value?: string;
    defaultValue?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
    size?: import("tamagui").TokenSize;
    orientation?: import("@tamagui/roving-focus").RovingFocusGroupProps["orientation"];
    dir?: import("@tamagui/roving-focus").RovingFocusGroupProps["dir"];
    activationMode?: "automatic" | "manual";
}, import("@tamagui/web").StackStyleBase, {
    size?: import("tamagui").TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeTabs?: string;
    } & {
        value?: string;
        defaultValue?: string | undefined;
        onValueChange?: ((value: string) => void) | undefined;
        size?: import("tamagui").TokenSize;
        orientation?: import("@tamagui/roving-focus").RovingFocusGroupProps["orientation"];
        dir?: import("@tamagui/roving-focus").RovingFocusGroupProps["dir"];
        activationMode?: "automatic" | "manual";
    }, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    List: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").TokenSize | undefined;
    }>, "disabled" | "__scopeTabs" | "loop"> & {
        __scopeTabs?: string;
    } & {
        loop?: boolean;
        disabled?: boolean;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeTabs?: string;
    } & {
        loop?: boolean;
        disabled?: boolean;
    }, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Tab: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeTabs?: string;
    } & {
        value: string;
        onInteraction?: (type: import("tamagui").InteractionType, layout: import("tamagui").TabLayout | null) => void;
        activeStyle?: import("tamagui").GetProps<typeof import("tamagui").TabsTabFrame>;
        activeTheme?: string | null;
    }, "size" | "disabled" | keyof import("@tamagui/web").StackStyleBase | "active"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & {
        ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeTabs?: string;
    } & {
        value: string;
        onInteraction?: (type: import("tamagui").InteractionType, layout: import("tamagui").TabLayout | null) => void;
        activeStyle?: import("tamagui").GetProps<typeof import("tamagui").TabsTabFrame>;
        activeTheme?: string | null;
    }, import("@tamagui/web").StackStyleBase, {
        size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
        disabled?: boolean | undefined;
        active?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
            __scopeTabs?: string;
        } & {
            value: string;
            onInteraction?: (type: import("tamagui").InteractionType, layout: import("tamagui").TabLayout | null) => void;
            activeStyle?: import("tamagui").GetProps<typeof import("tamagui").TabsTabFrame>;
            activeTheme?: string | null;
        }, import("@tamagui/web").StackStyleBase, {
            size?: number | true | "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "unset" | "inherit" | "auto" | (`${string}%` & {}) | `${number}rem` | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content" | undefined;
            disabled?: boolean | undefined;
            active?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Content: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeTabs?: string;
    } & {
        value: string;
        forceMount?: boolean;
    }, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: import("tamagui").TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: import("tamagui").TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").TokenSize | undefined;
    }>> & {
        ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        __scopeTabs?: string;
    } & {
        value: string;
        forceMount?: boolean;
    }, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
            __scopeTabs?: string;
        } & {
            value: string;
            forceMount?: boolean;
        }, import("@tamagui/web").StackStyleBase, {
            size?: import("tamagui").TokenSize | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
};
export declare function TabsCustomDemo(): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TabsCustomDemo.d.ts.map