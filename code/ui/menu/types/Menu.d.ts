import React from 'react';
export declare function createMenu(): React.FC<import("./createNonNativeMenu").MenuProps & {
    scope?: string;
} & Partial<Omit<import("@tamagui/create-menu").NativeMenuProps, keyof import("./createNonNativeMenu").MenuProps>>> & {
    readonly Trigger: React.FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("./createNonNativeMenu").MenuTriggerProps> & import("./createNonNativeMenu").MenuTriggerProps & {
        scope?: string;
    } & {
        ref?: React.Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").MenuTriggerProps, "scope" | "ref" | keyof import("./createNonNativeMenu").MenuTriggerProps>>>;
    readonly Portal: React.FC<import("@tamagui/create-menu").MenuPortalProps & {
        scope?: string;
    } & Partial<Omit<React.FragmentProps, "scope" | keyof import("@tamagui/create-menu").MenuPortalProps>>>;
    readonly Content: React.FC<import("./createNonNativeMenu").MenuContentProps & {
        scope?: string;
    } & import("@tamagui/web").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuContentProps, "ref" | keyof import("./createNonNativeMenu").MenuContentProps>>>;
    readonly Group: React.FC<Omit<import("@tamagui/web").ViewProps, keyof import("@tamagui/create-menu").MenuGroupProps> & import("@tamagui/create-menu").MenuGroupProps & {
        ref?: React.Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuGroupProps, "ref" | keyof import("@tamagui/create-menu").MenuGroupProps>>>;
    readonly Label: React.FC<Omit<import("@tamagui/web").TextProps, keyof import("@tamagui/create-menu").MenuLabelProps> & import("@tamagui/create-menu").MenuLabelProps & {
        ref?: React.Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuLabelProps, "ref" | keyof import("@tamagui/create-menu").MenuLabelProps>>>;
    readonly Item: React.FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuItemProps> & import("@tamagui/create-menu").MenuItemProps & {
        scope?: string;
    } & {
        ref?: React.Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<{
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuItemProps>>>;
    readonly CheckboxItem: React.FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuCheckboxItemProps> & import("@tamagui/create-menu").MenuCheckboxItemProps & {
        scope?: string;
    } & {
        ref?: React.Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<Omit<import("@tamagui/create-menu").NativeMenuItemProps, "onSelect"> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
        value?: "mixed" | "on" | "off" | boolean;
        onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
        key: string;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuCheckboxItemProps>>>;
    readonly RadioGroup: React.FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
        scope?: string;
    } & {
        ref?: React.Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<{
        children: React.ReactNode;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuRadioGroupProps>>>;
    readonly RadioItem: React.FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuRadioItemProps> & import("@tamagui/create-menu").MenuRadioItemProps & {
        scope?: string;
    } & {
        ref?: React.Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<{
        children: React.ReactNode;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuRadioItemProps>>>;
    readonly ItemIndicator: React.FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & {
        ref?: React.Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemIndicatorProps, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps>>>;
    readonly Separator: React.FC<Omit<import("@tamagui/web").ViewProps, keyof import("@tamagui/create-menu").MenuSeparatorProps> & import("@tamagui/create-menu").MenuSeparatorProps & {
        ref?: React.Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuSeparatorProps, "ref" | keyof import("@tamagui/create-menu").MenuSeparatorProps>>>;
    readonly Arrow: React.FC<Omit<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/popper").PopperArrowExtraProps & import("@tamagui/web").RefProp<import("@tamagui/web").TamaguiElement>, "ref"> & import("@tamagui/web").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuArrowProps, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "ref" | keyof import("@tamagui/popper").PopperArrowExtraProps>>>;
    readonly Sub: React.FC<import("@tamagui/create-menu").MenuSubProps & {
        children?: React.ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?(open: boolean): void;
    } & {
        scope?: string;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuSubProps, "defaultOpen" | keyof import("@tamagui/create-menu").MenuSubProps>>>;
    readonly SubTrigger: React.FC<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & import("@tamagui/web").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<{
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    } & {
        key: string;
    }, "scope" | "ref" | keyof import("@tamagui/create-menu").MenuSubTriggerProps>>>;
    readonly SubContent: React.FC<import("@tamagui/create-menu").MenuSubContentProps & {
        scope?: string;
    } & import("@tamagui/web").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuSubContentProps, "ref" | keyof import("@tamagui/create-menu").MenuSubContentProps>>>;
    readonly ItemTitle: React.FC<Omit<import("@tamagui/web").TextProps, keyof import("@tamagui/create-menu").MenuItemTitleProps> & import("@tamagui/create-menu").MenuItemTitleProps & {
        ref?: React.Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemTitleProps, "ref" | keyof import("@tamagui/create-menu").MenuItemTitleProps>>>;
    readonly ItemSubtitle: React.FC<Omit<import("@tamagui/web").TextProps, keyof import("@tamagui/create-menu").MenuItemSubTitleProps> & import("@tamagui/create-menu").MenuItemSubTitleProps & {
        ref?: React.Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemSubtitleProps, "ref" | keyof import("@tamagui/create-menu").MenuItemSubTitleProps>>>;
    readonly ItemIcon: React.FC<Omit<import("@tamagui/web").ViewProps, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
        ref?: React.Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemCommonProps, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "ref">>>;
    readonly ItemImage: React.FC<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & Omit<import("react-native").ImageProps, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "source" | "resizeMode"> & {
        src?: string | number;
        source?: import("react-native").ImageSourcePropType;
        resizeMode?: import("react-native").ImageResizeMode;
        objectFit?: React.CSSProperties["objectFit"];
        objectPosition?: React.CSSProperties["objectPosition"];
    } & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "src"> & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "style" | "height" | "width" | "src"> & import("@tamagui/web").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemCommonProps & {
        source: import("react-native").ImageProps["source"];
        ios?: {
            style?: {
                tint?: string;
            };
            lazy?: boolean;
        };
    }, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | "onLayout" | "rel" | "dir" | keyof import("@tamagui/web").StackStyleBase | "color" | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "ref" | "slot" | "source" | "title" | "objectPosition" | "translate" | "onSelect" | "resizeMode" | "onError" | "onLoad" | "onLoadEnd" | "onLoadStart" | "progressiveRenderingEnabled" | "src" | "srcSet" | "loadingIndicatorSource" | "defaultSource" | "alt" | "crossOrigin" | "tintColor" | "referrerPolicy" | "blurRadius" | "capInsets" | "onProgress" | "onPartialLoad" | "resizeMethod" | "fadeDuration" | "decoding" | "fetchPriority" | "loading" | "sizes" | "useMap" | "defaultChecked" | "defaultValue" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "accessKey" | "autoCapitalize" | "autoFocus" | "contentEditable" | "contextMenu" | "draggable" | "enterKeyHint" | "hidden" | "lang" | "nonce" | "spellCheck" | "radioGroup" | "about" | "datatype" | "inlist" | "prefix" | "property" | "resource" | "rev" | "typeof" | "vocab" | "autoCorrect" | "autoSave" | "itemProp" | "itemScope" | "itemType" | "itemID" | "itemRef" | "results" | "security" | "unselectable" | "popover" | "popoverTargetAction" | "popoverTarget" | "inert" | "inputMode" | "is" | "exportparts" | "part" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-dropeffect" | "aria-errormessage" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-invalid" | "aria-keyshortcuts" | "aria-level" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-setsize" | "aria-sort" | "onCopyCapture" | "onCutCapture" | "onPasteCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onFocusCapture" | "onBlurCapture" | "onChangeCapture" | "onBeforeInputCapture" | "onInputCapture" | "onReset" | "onResetCapture" | "onSubmit" | "onSubmitCapture" | "onInvalid" | "onInvalidCapture" | "onLoadCapture" | "onErrorCapture" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUpCapture" | "onAbort" | "onAbortCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLoadStartCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onStalled" | "onStalledCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onAuxClick" | "onAuxClickCapture" | "onClickCapture" | "onContextMenuCapture" | "onDoubleClickCapture" | "onDragCapture" | "onDragEndCapture" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeaveCapture" | "onDragOverCapture" | "onDragStartCapture" | "onDropCapture" | "onMouseDownCapture" | "onMouseMoveCapture" | "onMouseOutCapture" | "onMouseOverCapture" | "onMouseUpCapture" | "onSelectCapture" | "onTouchCancelCapture" | "onTouchMoveCapture" | "onTouchStartCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerOut" | "onPointerOutCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onWheelCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onToggle" | "onBeforeToggle" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture">>>;
    readonly ScrollView: (React.FunctionComponent<Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/web").StackStyleBase | "contentContainerStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}>> & {
        ref?: React.Ref<import("@tamagui/scroll-view").ScrollViewRef> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}, {
        acceptsClassName: true;
        accept: {
            readonly contentContainerStyle: "style";
        };
    } & import("@tamagui/web").StaticConfigPublic> & Omit<{
        acceptsClassName: true;
        accept: {
            readonly contentContainerStyle: "style";
        };
    } & import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & React.RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/web").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }, {}, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        } & import("@tamagui/web").StaticConfigPublic];
    }) | {
        ({ children }: {
            children: React.ReactNode;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
};
//# sourceMappingURL=Menu.d.ts.map