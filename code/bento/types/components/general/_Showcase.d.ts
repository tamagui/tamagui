import React from 'react';
import type { SizeTokens } from 'tamagui';
export declare const Showcase: React.ForwardRefExoticComponent<{
    children: React.ReactNode;
    title: string;
    fileName: string;
    short?: boolean;
    isInput?: boolean;
} & React.RefAttributes<any>>;
export declare const PhoneScaleProvider: React.ProviderExoticComponent<Partial<{
    scale: number;
    invertScale: number;
}> & {
    children?: React.ReactNode;
    scope?: string;
}>, usePhoneScale: (scope?: string) => {
    scale: number;
    invertScale: number;
};
export declare const ShowcaseChildWrapper: import("tamagui").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, import("@tamagui/web").StackStyleBase & {
    readonly contentContainerStyle?: Partial<import("@tamagui/web").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/web").StackStyleBase, {}>> | undefined;
}, {
    fullscreen?: boolean | undefined;
}>, import("react-native").ScrollView, import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps & void, import("@tamagui/web").StackStyleBase & {
    readonly contentContainerStyle?: Partial<import("@tamagui/web").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/web").StackStyleBase, {}>> | undefined;
}, {
    fullscreen?: boolean | undefined;
}, {
    accept: {
        readonly contentContainerStyle: "style";
    };
}>;
type ResizableBoxExtraProps = {
    hideDragHandle?: boolean;
};
declare const ResizableBox: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}>, "hideDragHandle"> & ResizableBoxExtraProps, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ResizableBoxExtraProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare function Hint({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export default ResizableBox;
/** ---------- SIZE CONTROLLER ----------- */
export declare const RawSizeProvider: React.ProviderExoticComponent<Partial<{
    sizes: SizeTokens[];
    setSizes: (sizes: SizeTokens[]) => void;
    size: SizeTokens;
    setSize: (size: SizeTokens) => void;
    showController: boolean;
    setShowController: (val: boolean) => void;
}> & {
    children?: React.ReactNode;
    scope?: string;
}>, useSize: (scope?: string) => {
    sizes: SizeTokens[];
    setSizes: (sizes: SizeTokens[]) => void;
    size: SizeTokens;
    setSize: (size: SizeTokens) => void;
    showController: boolean;
    setShowController: (val: boolean) => void;
};
export declare const WithSize: ({ children }: {
    children: any;
}) => React.FunctionComponentElement<{
    size: "$0" | "$0.25" | "$0.5" | "$0.75" | "$1" | "$1.5" | "$2" | "$2.5" | "$3" | "$3.5" | "$4" | "$true" | "$4.5" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "$12" | "$13" | "$14" | "$15" | "$16" | "$17" | "$18" | "$19" | "$20" | "$color.yellow1Light" | "$color.yellow2Light" | "$color.yellow3Light" | "$color.yellow4Light" | "$color.yellow5Light" | "$color.yellow6Light" | "$color.yellow7Light" | "$color.yellow8Light" | "$color.yellow9Light" | "$color.yellow10Light" | "$color.yellow11Light" | "$color.yellow12Light" | "$color.red1Light" | "$color.red2Light" | "$color.red3Light" | "$color.red4Light" | "$color.red5Light" | "$color.red6Light" | "$color.red7Light" | "$color.red8Light" | "$color.red9Light" | "$color.red10Light" | "$color.red11Light" | "$color.red12Light" | "$color.purple1Light" | "$color.purple2Light" | "$color.purple3Light" | "$color.purple4Light" | "$color.purple5Light" | "$color.purple6Light" | "$color.purple7Light" | "$color.purple8Light" | "$color.purple9Light" | "$color.purple10Light" | "$color.purple11Light" | "$color.purple12Light" | "$color.pink1Light" | "$color.pink2Light" | "$color.pink3Light" | "$color.pink4Light" | "$color.pink5Light" | "$color.pink6Light" | "$color.pink7Light" | "$color.pink8Light" | "$color.pink9Light" | "$color.pink10Light" | "$color.pink11Light" | "$color.pink12Light" | "$color.orange1Light" | "$color.orange2Light" | "$color.orange3Light" | "$color.orange4Light" | "$color.orange5Light" | "$color.orange6Light" | "$color.orange7Light" | "$color.orange8Light" | "$color.orange9Light" | "$color.orange10Light" | "$color.orange11Light" | "$color.orange12Light" | "$color.green1Light" | "$color.green2Light" | "$color.green3Light" | "$color.green4Light" | "$color.green5Light" | "$color.green6Light" | "$color.green7Light" | "$color.green8Light" | "$color.green9Light" | "$color.green10Light" | "$color.green11Light" | "$color.green12Light" | "$color.gray1Light" | "$color.gray2Light" | "$color.gray3Light" | "$color.gray4Light" | "$color.gray5Light" | "$color.gray6Light" | "$color.gray7Light" | "$color.gray8Light" | "$color.gray9Light" | "$color.gray10Light" | "$color.gray11Light" | "$color.gray12Light" | "$color.blue1Light" | "$color.blue2Light" | "$color.blue3Light" | "$color.blue4Light" | "$color.blue5Light" | "$color.blue6Light" | "$color.blue7Light" | "$color.blue8Light" | "$color.blue9Light" | "$color.blue10Light" | "$color.blue11Light" | "$color.blue12Light" | "$color.yellow1Dark" | "$color.yellow2Dark" | "$color.yellow3Dark" | "$color.yellow4Dark" | "$color.yellow5Dark" | "$color.yellow6Dark" | "$color.yellow7Dark" | "$color.yellow8Dark" | "$color.yellow9Dark" | "$color.yellow10Dark" | "$color.yellow11Dark" | "$color.yellow12Dark" | "$color.red1Dark" | "$color.red2Dark" | "$color.red3Dark" | "$color.red4Dark" | "$color.red5Dark" | "$color.red6Dark" | "$color.red7Dark" | "$color.red8Dark" | "$color.red9Dark" | "$color.red10Dark" | "$color.red11Dark" | "$color.red12Dark" | "$color.purple1Dark" | "$color.purple2Dark" | "$color.purple3Dark" | "$color.purple4Dark" | "$color.purple5Dark" | "$color.purple6Dark" | "$color.purple7Dark" | "$color.purple8Dark" | "$color.purple9Dark" | "$color.purple10Dark" | "$color.purple11Dark" | "$color.purple12Dark" | "$color.pink1Dark" | "$color.pink2Dark" | "$color.pink3Dark" | "$color.pink4Dark" | "$color.pink5Dark" | "$color.pink6Dark" | "$color.pink7Dark" | "$color.pink8Dark" | "$color.pink9Dark" | "$color.pink10Dark" | "$color.pink11Dark" | "$color.pink12Dark" | "$color.orange1Dark" | "$color.orange2Dark" | "$color.orange3Dark" | "$color.orange4Dark" | "$color.orange5Dark" | "$color.orange6Dark" | "$color.orange7Dark" | "$color.orange8Dark" | "$color.orange9Dark" | "$color.orange10Dark" | "$color.orange11Dark" | "$color.orange12Dark" | "$color.green1Dark" | "$color.green2Dark" | "$color.green3Dark" | "$color.green4Dark" | "$color.green5Dark" | "$color.green6Dark" | "$color.green7Dark" | "$color.green8Dark" | "$color.green9Dark" | "$color.green10Dark" | "$color.green11Dark" | "$color.green12Dark" | "$color.gray1Dark" | "$color.gray2Dark" | "$color.gray3Dark" | "$color.gray4Dark" | "$color.gray5Dark" | "$color.gray6Dark" | "$color.gray7Dark" | "$color.gray8Dark" | "$color.gray9Dark" | "$color.gray10Dark" | "$color.gray11Dark" | "$color.gray12Dark" | "$color.blue1Dark" | "$color.blue2Dark" | "$color.blue3Dark" | "$color.blue4Dark" | "$color.blue5Dark" | "$color.blue6Dark" | "$color.blue7Dark" | "$color.blue8Dark" | "$color.blue9Dark" | "$color.blue10Dark" | "$color.blue11Dark" | "$color.blue12Dark" | "$color.white0" | "$color.white075" | "$color.white05" | "$color.white025" | "$color.black0" | "$color.black075" | "$color.black05" | "$color.black025" | "$color.white1" | "$color.white2" | "$color.white3" | "$color.white4" | "$color.white5" | "$color.white6" | "$color.white7" | "$color.white8" | "$color.white9" | "$color.white10" | "$color.white11" | "$color.white12" | "$color.black1" | "$color.black2" | "$color.black3" | "$color.black4" | "$color.black5" | "$color.black6" | "$color.black7" | "$color.black8" | "$color.black9" | "$color.black10" | "$color.black11" | "$color.black12" | "$zIndex.0" | "$zIndex.3" | "$zIndex.2" | "$zIndex.1" | "$zIndex.5" | "$zIndex.4" | "$size.true" | "$size.0" | "$size.0.25" | "$size.0.5" | "$size.0.75" | "$size.1" | "$size.1.5" | "$size.2" | "$size.2.5" | "$size.3" | "$size.3.5" | "$size.4" | "$size.4.5" | "$size.5" | "$size.6" | "$size.7" | "$size.8" | "$size.9" | "$size.10" | "$size.11" | "$size.12" | "$size.13" | "$size.14" | "$size.15" | "$size.16" | "$size.17" | "$size.18" | "$size.19" | "$size.20" | "$space.0" | "$space.3" | "$space.2" | "$space.9" | "$space.15" | "$space.1" | "$space.10" | "$space.5" | "$space.14" | "$space.11" | "$space.12" | "$space.16" | "$space.4" | "$space.6" | "$space.7" | "$space.8" | "$space.13" | "$space.true" | "$space.0.25" | "$space.0.5" | "$space.0.75" | "$space.1.5" | "$space.2.5" | "$space.3.5" | "$space.4.5" | "$space.17" | "$space.18" | "$space.19" | "$space.20" | "$space.-0.25" | "$space.-0.5" | "$space.-0.75" | "$space.-1" | "$space.-1.5" | "$space.-2" | "$space.-2.5" | "$space.-3" | "$space.-3.5" | "$space.-4" | "$space.-true" | "$space.-4.5" | "$space.-5" | "$space.-6" | "$space.-7" | "$space.-8" | "$space.-9" | "$space.-10" | "$space.-11" | "$space.-12" | "$space.-13" | "$space.-14" | "$space.-15" | "$space.-16" | "$space.-17" | "$space.-18" | "$space.-19" | "$space.-20" | "$radius.0" | "$radius.3" | "$radius.2" | "$radius.9" | "$radius.1" | "$radius.10" | "$radius.5" | "$radius.11" | "$radius.12" | "$radius.4" | "$radius.6" | "$radius.7" | "$radius.8" | "$radius.true" | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString;
}>;
export declare const SizeController: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}>, keyof import("tamagui").GroupExtraProps | "__scopeGroup"> & import("tamagui").GroupExtraProps & {
    __scopeGroup?: import("tamagui").Scope;
}, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").GroupExtraProps & {
    __scopeGroup?: import("tamagui").Scope;
} & void, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    size?: any;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
//# sourceMappingURL=_Showcase.d.ts.map