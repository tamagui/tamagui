import type { SizeTokens, TamaguiElement, ViewProps } from '@tamagui/style';
import type { PopupTriggerMap } from '@tamagui/floating';
import type { Coords, OffsetOptions, Placement, SizeOptions, Strategy, UseFloatingReturn } from '@tamagui/floating';
import { flip, shift } from '@tamagui/floating';
import * as React from 'react';
type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never;
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never;
export type PopperContextShared = {
    open: boolean;
    size?: SizeTokens;
    hasFloating: boolean;
    arrowStyle?: Partial<Coords> & {
        centerOffset: number;
    };
    placement?: Placement;
    arrowRef: any;
    onArrowSize?: (val: number) => void;
    transformOrigin?: {
        x: string;
        y: string;
    };
};
export type PopperContextValue = UseFloatingReturn & PopperContextShared;
export declare const PopperContextFast: import("@tamagui/style").StyledContext<PopperContextValue, never>;
export declare const PopperPositionContext: {
    <VariantProps extends Record<string, any>, ConsumedKeys extends Extract<keyof VariantProps, string>>(defaultValues: VariantProps, namespaceOrOptions: import("@tamagui/style").StyledContextOptions<VariantProps, ConsumedKeys> & {
        keys: readonly ConsumedKeys[];
    }): import("@tamagui/style").StyledContext<VariantProps, ConsumedKeys>;
    <VariantProps extends Record<string, any>>(defaultValues: {
        [x: string]: never;
        [x: number]: never;
        [x: symbol]: never;
    }, namespaceOrOptions?: string | {
        namespace?: string;
        keys?: never;
    }): import("@tamagui/style").StyledContext<VariantProps, never>;
    <VariantProps extends Record<string, any>>(defaultValues: VariantProps & ({ [Key in Exclude<keyof VariantProps, { [Key in keyof VariantProps]-?: {} extends Pick<VariantProps, Key> ? Key : never; }[keyof VariantProps]>]: VariantProps[Key]; } & { [Key in { [Key in keyof VariantProps]-?: {} extends Pick<VariantProps, Key> ? Key : never; }[keyof VariantProps]]: VariantProps[Key] | undefined; }), namespaceOrOptions?: string | {
        namespace?: string;
        keys?: never;
    }): import("@tamagui/style").StyledContext<VariantProps, Extract<keyof VariantProps, string>>;
    <VariantProps extends Record<string, any>, ConsumedKeys extends Extract<keyof VariantProps, string>>(defaultValues: undefined, namespaceOrOptions: import("@tamagui/style").StyledContextOptions<VariantProps, ConsumedKeys> & {
        keys: readonly ConsumedKeys[];
    }): import("@tamagui/style").StyledContext<VariantProps, ConsumedKeys>;
    <VariantProps extends Record<string, any> = Record<string, any>>(defaultValues?: undefined, namespaceOrOptions?: string): import("@tamagui/style").StyledContext<VariantProps, never>;
};
export declare const usePopperContext: (scope?: string) => PopperContextValue, PopperProviderFast: React.Provider<PopperContextValue> & React.ProviderExoticComponent<Partial<PopperContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
export type PopperContextSlowValue = Pick<UseFloatingReturn, 'getReferenceProps' | 'update' | 'refs'> & {
    onHoverReference?: (event: any) => void;
    onLeaveReference?: () => void;
    triggerElements?: PopupTriggerMap;
};
export declare const PopperContextSlow: import("@tamagui/style").StyledContext<PopperContextSlowValue, never>;
export declare const usePopperContextSlow: (scope?: string) => PopperContextSlowValue, PopperProviderSlow: React.Provider<PopperContextSlowValue> & React.ProviderExoticComponent<Partial<PopperContextSlowValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
export declare const PopperProvider: ({ scope, children, ...context }: PopperContextValue & {
    scope?: string;
    children?: React.ReactNode;
}) => React.JSX.Element;
export type PopperProps = {
    /**
     * Popper is a component used by other components to create interfaces, so scope is required
     * For example Popover uses it internally and sets a default "POPOVER_SCOPE".
     */
    scope?: string;
    /**
     * Optional, will disable measuring updates when open is false for better performance
     * */
    open?: boolean;
    size?: SizeTokens;
    children?: React.ReactNode;
    /**
     * Determine the preferred placement of the content in relation to the trigger
     */
    placement?: Placement;
    /**
     * Shifts content horizontally to stay within viewport.
     * Pass an object to override shift options (mainAxis, crossAxis, padding, etc).
     * Defaults: { mainAxis: true, crossAxis: false, padding: 10 }
     * @see https://floating-ui.com/docs/shift
     */
    stayInFrame?: ShiftProps | boolean;
    /**
     * Allows content to switch sides when space is limited.
     * @see https://floating-ui.com/docs/flip
     */
    allowFlip?: FlipProps | boolean;
    /**
     * Resizes the content to fix inside the screen when space is limited
     * @see https://floating-ui.com/docs/size
     */
    resize?: boolean | Omit<SizeOptions, 'apply'>;
    /**
     * Choose between absolute or fixed positioning
     */
    strategy?: Strategy;
    /**
     * Move the content away from the trigger
     * @see https://floating-ui.com/docs/offset
     */
    offset?: OffsetOptions;
    disableRTL?: boolean;
    passThrough?: boolean;
};
export type PopperSetupOptions = {
    disableRTL?: boolean;
};
export declare function setupPopper(options?: PopperSetupOptions): void;
export declare function Popper(props: PopperProps): React.JSX.Element;
export type PopperAnchorExtraProps = {
    virtualRef?: React.RefObject<any>;
    scope?: string;
};
export type PopperAnchorProps = ViewProps;
export declare const PopperAnchor: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, keyof PopperAnchorExtraProps> & PopperAnchorExtraProps, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & PopperAnchorExtraProps, import("@tamagui/style").StackStyleBase, {}, {}>;
export type PopperContentProps = ViewProps & {
    scope?: string;
    /**
     * Enable smooth animation when the content position changes (e.g., when flipping sides)
     */
    animatePosition?: boolean | 'even-when-repositioning';
    passThrough?: boolean;
};
export declare const PopperContentFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
export declare const PopperContent: import("@tamagui/compose-refs").RefComponent<TamaguiElement, PopperContentProps>;
export type PopperArrowExtraProps = {
    offset?: number;
    size?: SizeTokens;
    scope?: string;
    /**
     * Enable smooth animation when the arrow position changes
     */
    animatePosition?: boolean;
};
export type PopperArrowProps = ViewProps & PopperArrowExtraProps;
export declare const PopperArrowFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
export declare const PopperArrow: import("@tamagui/compose-refs").RefComponent<TamaguiElement, PopperArrowProps>;
export {};
//# sourceMappingURL=Popper.d.ts.map