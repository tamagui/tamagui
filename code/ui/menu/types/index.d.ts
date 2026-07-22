import '@tamagui/polyfill-dev';
export declare const Menu: import("react").FC<import("./createNonNativeMenu").MenuProps & {
    scope?: string;
} & Partial<Omit<import("@tamagui/create-menu").NativeMenuProps, keyof import("./createNonNativeMenu").MenuProps>>> & {
    readonly Trigger: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("./createNonNativeMenu").MenuTriggerProps> & import("./createNonNativeMenu").MenuTriggerProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").MenuTriggerProps, "ref" | "scope" | keyof import("./createNonNativeMenu").MenuTriggerProps>>>;
    readonly Portal: import("react").FC<import("@tamagui/create-menu").MenuPortalProps & {
        scope?: string;
    } & Partial<Omit<import("react").FragmentProps, "scope" | keyof import("@tamagui/create-menu").MenuPortalProps>>>;
    readonly Content: import("react").FC<import("./createNonNativeMenu").MenuContentProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuContentProps, "ref" | keyof import("./createNonNativeMenu").MenuContentProps>>>;
    readonly Group: import("react").FC<Omit<import("@tamagui/web").ViewProps, keyof import("@tamagui/create-menu").MenuGroupProps> & import("@tamagui/create-menu").MenuGroupProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuGroupProps, "ref" | keyof import("@tamagui/create-menu").MenuGroupProps>>>;
    readonly Label: import("react").FC<Omit<import("@tamagui/web").TextProps, keyof import("@tamagui/create-menu").MenuLabelProps> & import("@tamagui/create-menu").MenuLabelProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuLabelProps, "ref" | keyof import("@tamagui/create-menu").MenuLabelProps>>>;
    readonly Item: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuItemProps> & import("@tamagui/create-menu").MenuItemProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<{
        children: React.ReactNode;
        textValue?: string;
        onSelect?: (event?: Event) => void;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    }, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuItemProps>>>;
    readonly CheckboxItem: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuCheckboxItemProps> & import("@tamagui/create-menu").MenuCheckboxItemProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<Omit<import("@tamagui/create-menu").NativeMenuItemProps, "onSelect"> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
        value?: 'mixed' | 'on' | 'off' | boolean;
        onValueChange?: (state: 'mixed' | 'on' | 'off', prevState: 'mixed' | 'on' | 'off') => void;
        key: string;
    }, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuCheckboxItemProps>>>;
    readonly RadioGroup: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<{
        children: React.ReactNode;
    }, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps>>>;
    readonly RadioItem: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuRadioItemProps> & import("@tamagui/create-menu").MenuRadioItemProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<{
        children: React.ReactNode;
    }, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuRadioItemProps>>>;
    readonly ItemIndicator: import("react").FC<Omit<import("@tamagui/web").ViewProps, "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps> & import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemIndicatorProps, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuItemIndicatorProps>>>;
    readonly Separator: import("react").FC<Omit<import("@tamagui/web").ViewProps, keyof import("@tamagui/create-menu").MenuSeparatorProps> & import("@tamagui/create-menu").MenuSeparatorProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuSeparatorProps, "ref" | keyof import("@tamagui/create-menu").MenuSeparatorProps>>>;
    readonly Arrow: import("react").FC<Omit<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/popper").PopperArrowExtraProps & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement>, "ref"> & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuArrowProps, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "ref" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/popper").PopperArrowExtraProps | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>>>>;
    readonly Sub: import("react").FC<import("@tamagui/create-menu").MenuSubProps & {
        children?: React.ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?(open: boolean): void;
    } & {
        scope?: string;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuSubProps, "defaultOpen" | keyof import("@tamagui/create-menu").MenuSubProps>>>;
    readonly SubTrigger: import("react").FC<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<{
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
    }, "ref" | "scope" | keyof import("@tamagui/create-menu").MenuSubTriggerProps>>>;
    readonly SubContent: import("react").FC<import("@tamagui/create-menu").MenuSubContentProps & {
        scope?: string;
    } & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuSubContentProps, "ref" | keyof import("@tamagui/create-menu").MenuSubContentProps>>>;
    readonly ItemTitle: import("react").FC<Omit<import("@tamagui/web").TextProps, keyof import("@tamagui/create-menu").MenuItemTitleProps> & import("@tamagui/create-menu").MenuItemTitleProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemTitleProps, "ref" | keyof import("@tamagui/create-menu").MenuItemTitleProps>>>;
    readonly ItemSubtitle: import("react").FC<Omit<import("@tamagui/web").TextProps, keyof import("@tamagui/create-menu").MenuItemSubTitleProps> & import("@tamagui/create-menu").MenuItemSubTitleProps & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemSubtitleProps, "ref" | keyof import("@tamagui/create-menu").MenuItemSubTitleProps>>>;
    readonly ItemIcon: import("react").FC<Omit<import("@tamagui/web").ViewProps, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    } & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemCommonProps, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "ref" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>>>>;
    readonly ItemImage: import("react").FC<import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & Omit<import("react-native").ImageProps, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "resizeMode" | "source" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & {
        src?: string | number;
        source?: import("react-native").ImageSourcePropType;
        resizeMode?: import("react-native").ImageResizeMode;
        objectFit?: React.CSSProperties['objectFit'];
        objectPosition?: React.CSSProperties['objectPosition'];
    } & Omit<import("react").ImgHTMLAttributes<HTMLImageElement>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "src" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & Omit<import("react").ImgHTMLAttributes<HTMLImageElement>, "height" | "src" | "style" | "width"> & import("@tamagui/compose-refs").RefProp<import("@tamagui/web").TamaguiElement> & Partial<Omit<import("@tamagui/create-menu").NativeMenuItemCommonProps & {
        source: import("react-native").ImageProps['source'];
        ios?: {
            style?: {
                tint?: string;
            };
            lazy?: boolean;
        };
    }, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "about" | "accessKey" | "alt" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-braillelabel" | "aria-brailleroledescription" | "aria-colcount" | "aria-colindex" | "aria-colindextext" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-description" | "aria-details" | "aria-dropeffect" | "aria-errormessage" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-invalid" | "aria-keyshortcuts" | "aria-level" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowindextext" | "aria-rowspan" | "aria-setsize" | "aria-sort" | "autoCapitalize" | "autoCorrect" | "autoFocus" | "autoSave" | "blurRadius" | "capInsets" | "color" | "contentEditable" | "contextMenu" | "crossOrigin" | "datatype" | "decoding" | "defaultChecked" | "defaultSource" | "defaultValue" | "dir" | "draggable" | "enterKeyHint" | "exportparts" | "fadeDuration" | "fetchPriority" | "hidden" | "inert" | "inlist" | "inputMode" | "is" | "itemID" | "itemProp" | "itemRef" | "itemScope" | "itemType" | "lang" | "loading" | "loadingIndicatorSource" | "nonce" | "objectPosition" | "onAbort" | "onAbortCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAuxClick" | "onAuxClickCapture" | "onBeforeInputCapture" | "onBeforeToggle" | "onBlurCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onChangeCapture" | "onClickCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onContextMenuCapture" | "onCopyCapture" | "onCutCapture" | "onDoubleClickCapture" | "onDragCapture" | "onDragEndCapture" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeaveCapture" | "onDragOverCapture" | "onDragStartCapture" | "onDropCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onError" | "onErrorCapture" | "onFocusCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInputCapture" | "onInvalid" | "onInvalidCapture" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUpCapture" | "onLayout" | "onLoad" | "onLoadCapture" | "onLoadEnd" | "onLoadStart" | "onLoadStartCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMouseDownCapture" | "onMouseMoveCapture" | "onMouseOutCapture" | "onMouseOverCapture" | "onMouseUpCapture" | "onPartialLoad" | "onPasteCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onReset" | "onResetCapture" | "onScrollCapture" | "onScrollEnd" | "onScrollEndCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onSelect" | "onSelectCapture" | "onStalled" | "onStalledCapture" | "onSubmit" | "onSubmitCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onToggle" | "onTouchCancelCapture" | "onTouchMoveCapture" | "onTouchStartCapture" | "onTransitionCancel" | "onTransitionCancelCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "onTransitionRun" | "onTransitionRunCapture" | "onTransitionStart" | "onTransitionStartCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onWheelCapture" | "part" | "popover" | "popoverTarget" | "popoverTargetAction" | "prefix" | "progressiveRenderingEnabled" | "property" | "radioGroup" | "ref" | "referrerPolicy" | "rel" | "resizeMethod" | "resizeMode" | "resource" | "results" | "rev" | "security" | "sizes" | "slot" | "source" | "spellCheck" | "src" | "srcSet" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "tintColor" | "title" | "translate" | "typeof" | "unselectable" | "useMap" | "vocab" | import("@tamagui/web").GroupMediaKeys | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>>>>;
    readonly ScrollView: {
        ({ children }: {
            children: React.ReactNode;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } | (import("react").FunctionComponent<Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "contentContainerStyle" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }, {}>> & {
        ref?: import("react").Ref<import("@tamagui/scroll-view").ScrollViewRef> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        }>> | undefined;
    }, {}, {
        acceptsClassName: true;
        neverFlatten: true;
        accept: {
            readonly contentContainerStyle: 'style';
        };
    } & import("@tamagui/web").StaticConfigPublic> & Omit<{
        acceptsClassName: true;
        neverFlatten: true;
        accept: {
            readonly contentContainerStyle: 'style';
        };
    } & import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/web").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/web").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                neverFlatten: true;
                accept: {
                    readonly contentContainerStyle: 'style';
                };
            }>> | undefined;
        }, {}, {
            acceptsClassName: true;
            neverFlatten: true;
            accept: {
                readonly contentContainerStyle: 'style';
            };
        } & import("@tamagui/web").StaticConfigPublic];
    });
};
//# sourceMappingURL=index.d.ts.map