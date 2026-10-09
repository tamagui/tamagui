import {
  toast,
  useToastItem,
  useToasts,
  type ExternalToast,
  type ToastListProps,
  type ToastPosition,
  type ToastRootProps,
  type ToastT,
} from '@tamagui/toast'
import { type TamaguiElement } from '@tamagui/core'
export declare const ToastItem: import('react').FunctionComponent<
  Omit<
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
      Omit<
        import('@tamagui/core').WithThemeValues<
          Omit<import('@tamagui/core').StackStyleBase, never>
        > &
          import('@tamagui/core').WithFlatVariantValues<{}> &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStyleBase
            >
          >,
        keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
      > & {
        toast: ToastT
        index: number
        children: React.ReactNode
      },
    never
  > &
    Omit<
      import('@tamagui/core').WithThemeValues<
        Omit<import('@tamagui/core').StackStyleBase, never>
      > &
        import('@tamagui/core').WithFlatVariantValues<{}> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        >,
      | 'index'
      | 'toast'
      | keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
      | keyof import('@tamagui/core').StackStyleBase
    > & {
      ref?:
        | import('react').Ref<
            | import('@tamagui/react-native-types/src').ReactNativeElement
            | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
          >
        | undefined
    }
> &
  import('@tamagui/core').StaticComponentObject<
    import('@tamagui/core').TamaDefer,
    | import('@tamagui/react-native-types/src').ReactNativeElement
    | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
      Omit<
        import('@tamagui/core').WithThemeValues<
          Omit<import('@tamagui/core').StackStyleBase, never>
        > &
          import('@tamagui/core').WithFlatVariantValues<{}> &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStyleBase
            >
          >,
        keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
      > & {
        toast: ToastT
        index: number
        children: React.ReactNode
      },
    import('@tamagui/core').StackStyleBase,
    {},
    import('@tamagui/core').StaticConfigPublic
  > &
  Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/core').TamaDefer,
      (
        | import('@tamagui/react-native-types/src').ReactNativeElement
        | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
      ),
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
        Omit<
          import('@tamagui/core').WithThemeValues<
            Omit<import('@tamagui/core').StackStyleBase, never>
          > &
            import('@tamagui/core').WithFlatVariantValues<{}> &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStyleBase
              >
            >,
          keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
        > & {
          toast: ToastT
          index: number
          children: React.ReactNode
        },
      import('@tamagui/core').StackStyleBase,
      {},
      import('@tamagui/core').StaticConfigPublic,
    ]
  }
export declare const ToastTitle: import('react').FunctionComponent<
  Omit<import('@tamagui/core').TextNonStyleProps, 'size'> &
    Omit<
      import('@tamagui/core').WithThemeValues<
        Omit<import('@tamagui/core').TextStylePropsBase, 'size'>
      > &
        import('@tamagui/core').WithFlatVariantValues<{
          size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
        }> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<
            import('@tamagui/core').TextStylePropsBase
          >
        >,
      keyof import('@tamagui/core').TextNonStyleProps
    > & {
      ref?: import('react').Ref<import('@tamagui/core').TamaguiTextElement> | undefined
    }
> &
  import('@tamagui/core').StaticComponentObject<
    import('@tamagui/core').TamaDefer,
    import('@tamagui/core').TamaguiTextElement,
    import('@tamagui/core').TextNonStyleProps,
    import('@tamagui/core').TextStylePropsBase,
    {
      size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
    },
    import('@tamagui/core').StaticConfigPublic
  > &
  Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/core').TamaDefer,
      import('@tamagui/core').TamaguiTextElement,
      import('@tamagui/core').TextNonStyleProps,
      import('@tamagui/core').TextStylePropsBase,
      {
        size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
      },
      import('@tamagui/core').StaticConfigPublic,
    ]
  }
export declare const ToastDescription: import('react').FunctionComponent<
  Omit<import('@tamagui/core').TextNonStyleProps, 'size'> &
    Omit<
      import('@tamagui/core').WithThemeValues<
        Omit<import('@tamagui/core').TextStylePropsBase, 'size'>
      > &
        import('@tamagui/core').WithFlatVariantValues<{
          size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
        }> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<
            import('@tamagui/core').TextStylePropsBase
          >
        >,
      keyof import('@tamagui/core').TextNonStyleProps
    > & {
      ref?: import('react').Ref<import('@tamagui/core').TamaguiTextElement> | undefined
    }
> &
  import('@tamagui/core').StaticComponentObject<
    import('@tamagui/core').TamaDefer,
    import('@tamagui/core').TamaguiTextElement,
    import('@tamagui/core').TextNonStyleProps,
    import('@tamagui/core').TextStylePropsBase,
    {
      size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
    },
    import('@tamagui/core').StaticConfigPublic
  > &
  Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/core').TamaDefer,
      import('@tamagui/core').TamaguiTextElement,
      import('@tamagui/core').TextNonStyleProps,
      import('@tamagui/core').TextStylePropsBase,
      {
        size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
      },
      import('@tamagui/core').StaticConfigPublic,
    ]
  }
export declare const ToastClose: import('react').FunctionComponent<
  Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
    Omit<
      import('@tamagui/core').WithThemeValues<
        Omit<import('@tamagui/core').StackStyleBase, never>
      > &
        import('@tamagui/core').WithFlatVariantValues<{}> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        >,
      keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
    > & {
      ref?:
        | import('react').Ref<
            | import('@tamagui/react-native-types/src').ReactNativeElement
            | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
          >
        | undefined
    }
> &
  import('@tamagui/core').StaticComponentObject<
    import('@tamagui/core').TamaDefer,
    | import('@tamagui/react-native-types/src').ReactNativeElement
    | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps,
    import('@tamagui/core').StackStyleBase,
    {},
    import('@tamagui/core').StaticConfigPublic
  > &
  Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/core').TamaDefer,
      (
        | import('@tamagui/react-native-types/src').ReactNativeElement
        | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
      ),
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {},
      import('@tamagui/core').StaticConfigPublic,
    ]
  }
export declare const ToastAction: import('react').FunctionComponent<
  Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
    Omit<
      import('@tamagui/core').WithThemeValues<
        Omit<import('@tamagui/core').StackStyleBase, never>
      > &
        import('@tamagui/core').WithFlatVariantValues<{}> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        >,
      keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
    > & {
      ref?:
        | import('react').Ref<
            | import('@tamagui/react-native-types/src').ReactNativeElement
            | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
          >
        | undefined
    }
> &
  import('@tamagui/core').StaticComponentObject<
    import('@tamagui/core').TamaDefer,
    | import('@tamagui/react-native-types/src').ReactNativeElement
    | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps,
    import('@tamagui/core').StackStyleBase,
    {},
    import('@tamagui/core').StaticConfigPublic
  > &
  Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/core').TamaDefer,
      (
        | import('@tamagui/react-native-types/src').ReactNativeElement
        | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
      ),
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {},
      import('@tamagui/core').StaticConfigPublic,
    ]
  }
declare function ToastList(props: ToastListProps): import('react').JSX.Element
export declare const Toast: ((
  props: ToastRootProps & import('@tamagui/core').RefProp<TamaguiElement>
) => import('react').ReactNode) & {
  displayName?: string
  propTypes?: any
} & {
  Viewport: import('@tamagui/core').TamaguiComponent<
    Omit<
      import('@tamagui/core').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/core').StackStyleBase,
        {}
      >,
      | 'KhtmlBoxAlign'
      | 'KhtmlBoxDirection'
      | 'KhtmlBoxFlex'
      | 'KhtmlBoxFlexGroup'
      | 'KhtmlBoxLines'
      | 'KhtmlBoxOrdinalGroup'
      | 'KhtmlBoxOrient'
      | 'KhtmlBoxPack'
      | 'KhtmlLineBreak'
      | 'KhtmlOpacity'
      | 'KhtmlUserSelect'
      | 'MozAnimation'
      | 'MozAnimationDelay'
      | 'MozAnimationDirection'
      | 'MozAnimationDuration'
      | 'MozAnimationFillMode'
      | 'MozAnimationIterationCount'
      | 'MozAnimationName'
      | 'MozAnimationPlayState'
      | 'MozAnimationTimingFunction'
      | 'MozAppearance'
      | 'MozBackfaceVisibility'
      | 'MozBackgroundClip'
      | 'MozBackgroundOrigin'
      | 'MozBackgroundSize'
      | 'MozBinding'
      | 'MozBorderBottomColors'
      | 'MozBorderEndColor'
      | 'MozBorderEndStyle'
      | 'MozBorderEndWidth'
      | 'MozBorderImage'
      | 'MozBorderLeftColors'
      | 'MozBorderRadius'
      | 'MozBorderRadiusBottomleft'
      | 'MozBorderRadiusBottomright'
      | 'MozBorderRadiusTopleft'
      | 'MozBorderRadiusTopright'
      | 'MozBorderRightColors'
      | 'MozBorderStartColor'
      | 'MozBorderStartStyle'
      | 'MozBorderTopColors'
      | 'MozBoxAlign'
      | 'MozBoxDirection'
      | 'MozBoxFlex'
      | 'MozBoxOrdinalGroup'
      | 'MozBoxOrient'
      | 'MozBoxPack'
      | 'MozBoxShadow'
      | 'MozBoxSizing'
      | 'MozColumnCount'
      | 'MozColumnFill'
      | 'MozColumnRule'
      | 'MozColumnRuleColor'
      | 'MozColumnRuleStyle'
      | 'MozColumnRuleWidth'
      | 'MozColumnWidth'
      | 'MozColumns'
      | 'MozContextProperties'
      | 'MozFloatEdge'
      | 'MozFontFeatureSettings'
      | 'MozFontLanguageOverride'
      | 'MozForceBrokenImageIcon'
      | 'MozHyphens'
      | 'MozMarginEnd'
      | 'MozMarginStart'
      | 'MozOpacity'
      | 'MozOrient'
      | 'MozOsxFontSmoothing'
      | 'MozOutline'
      | 'MozOutlineColor'
      | 'MozOutlineRadius'
      | 'MozOutlineRadiusBottomleft'
      | 'MozOutlineRadiusBottomright'
      | 'MozOutlineRadiusTopleft'
      | 'MozOutlineRadiusTopright'
      | 'MozOutlineStyle'
      | 'MozOutlineWidth'
      | 'MozPaddingEnd'
      | 'MozPaddingStart'
      | 'MozPerspective'
      | 'MozPerspectiveOrigin'
      | 'MozStackSizing'
      | 'MozTabSize'
      | 'MozTextAlignLast'
      | 'MozTextBlink'
      | 'MozTextDecorationColor'
      | 'MozTextDecorationLine'
      | 'MozTextDecorationStyle'
      | 'MozTextSizeAdjust'
      | 'MozTransform'
      | 'MozTransformOrigin'
      | 'MozTransformStyle'
      | 'MozTransition'
      | 'MozTransitionDelay'
      | 'MozTransitionDuration'
      | 'MozTransitionProperty'
      | 'MozTransitionTimingFunction'
      | 'MozUserFocus'
      | 'MozUserInput'
      | 'MozUserModify'
      | 'MozUserSelect'
      | 'MozWindowDragging'
      | 'MozWindowShadow'
      | 'OAnimation'
      | 'OAnimationDelay'
      | 'OAnimationDirection'
      | 'OAnimationDuration'
      | 'OAnimationFillMode'
      | 'OAnimationIterationCount'
      | 'OAnimationName'
      | 'OAnimationPlayState'
      | 'OAnimationTimingFunction'
      | 'OBackgroundSize'
      | 'OBorderImage'
      | 'OObjectFit'
      | 'OObjectPosition'
      | 'OTabSize'
      | 'OTextOverflow'
      | 'OTransform'
      | 'OTransformOrigin'
      | 'OTransition'
      | 'OTransitionDelay'
      | 'OTransitionDuration'
      | 'OTransitionProperty'
      | 'OTransitionTimingFunction'
      | 'WebkitAlignContent'
      | 'WebkitAlignItems'
      | 'WebkitAlignSelf'
      | 'WebkitAnimation'
      | 'WebkitAnimationDelay'
      | 'WebkitAnimationDirection'
      | 'WebkitAnimationDuration'
      | 'WebkitAnimationFillMode'
      | 'WebkitAnimationIterationCount'
      | 'WebkitAnimationName'
      | 'WebkitAnimationPlayState'
      | 'WebkitAnimationTimingFunction'
      | 'WebkitAppearance'
      | 'WebkitBackdropFilter'
      | 'WebkitBackfaceVisibility'
      | 'WebkitBackgroundClip'
      | 'WebkitBackgroundOrigin'
      | 'WebkitBackgroundSize'
      | 'WebkitBorderBefore'
      | 'WebkitBorderBeforeColor'
      | 'WebkitBorderBeforeStyle'
      | 'WebkitBorderBeforeWidth'
      | 'WebkitBorderBottomLeftRadius'
      | 'WebkitBorderBottomRightRadius'
      | 'WebkitBorderImage'
      | 'WebkitBorderImageSlice'
      | 'WebkitBorderRadius'
      | 'WebkitBorderTopLeftRadius'
      | 'WebkitBorderTopRightRadius'
      | 'WebkitBoxAlign'
      | 'WebkitBoxDecorationBreak'
      | 'WebkitBoxDirection'
      | 'WebkitBoxFlex'
      | 'WebkitBoxFlexGroup'
      | 'WebkitBoxLines'
      | 'WebkitBoxOrdinalGroup'
      | 'WebkitBoxOrient'
      | 'WebkitBoxPack'
      | 'WebkitBoxReflect'
      | 'WebkitBoxShadow'
      | 'WebkitBoxSizing'
      | 'WebkitClipPath'
      | 'WebkitColumnCount'
      | 'WebkitColumnFill'
      | 'WebkitColumnRule'
      | 'WebkitColumnRuleColor'
      | 'WebkitColumnRuleStyle'
      | 'WebkitColumnRuleWidth'
      | 'WebkitColumnSpan'
      | 'WebkitColumnWidth'
      | 'WebkitColumns'
      | 'WebkitFilter'
      | 'WebkitFlex'
      | 'WebkitFlexBasis'
      | 'WebkitFlexDirection'
      | 'WebkitFlexFlow'
      | 'WebkitFlexGrow'
      | 'WebkitFlexShrink'
      | 'WebkitFlexWrap'
      | 'WebkitFontFeatureSettings'
      | 'WebkitFontKerning'
      | 'WebkitFontSmoothing'
      | 'WebkitFontVariantLigatures'
      | 'WebkitHyphenateCharacter'
      | 'WebkitHyphens'
      | 'WebkitInitialLetter'
      | 'WebkitJustifyContent'
      | 'WebkitLineBreak'
      | 'WebkitLineClamp'
      | 'WebkitLogicalHeight'
      | 'WebkitLogicalWidth'
      | 'WebkitMarginEnd'
      | 'WebkitMarginStart'
      | 'WebkitMask'
      | 'WebkitMaskAttachment'
      | 'WebkitMaskBoxImage'
      | 'WebkitMaskBoxImageOutset'
      | 'WebkitMaskBoxImageRepeat'
      | 'WebkitMaskBoxImageSlice'
      | 'WebkitMaskBoxImageSource'
      | 'WebkitMaskBoxImageWidth'
      | 'WebkitMaskClip'
      | 'WebkitMaskComposite'
      | 'WebkitMaskImage'
      | 'WebkitMaskOrigin'
      | 'WebkitMaskPosition'
      | 'WebkitMaskPositionX'
      | 'WebkitMaskPositionY'
      | 'WebkitMaskRepeat'
      | 'WebkitMaskRepeatX'
      | 'WebkitMaskRepeatY'
      | 'WebkitMaskSize'
      | 'WebkitMaxInlineSize'
      | 'WebkitOrder'
      | 'WebkitOverflowScrolling'
      | 'WebkitPaddingEnd'
      | 'WebkitPaddingStart'
      | 'WebkitPerspective'
      | 'WebkitPerspectiveOrigin'
      | 'WebkitPrintColorAdjust'
      | 'WebkitRubyPosition'
      | 'WebkitScrollSnapType'
      | 'WebkitShapeMargin'
      | 'WebkitTapHighlightColor'
      | 'WebkitTextCombine'
      | 'WebkitTextDecorationColor'
      | 'WebkitTextDecorationLine'
      | 'WebkitTextDecorationSkip'
      | 'WebkitTextDecorationStyle'
      | 'WebkitTextEmphasis'
      | 'WebkitTextEmphasisColor'
      | 'WebkitTextEmphasisPosition'
      | 'WebkitTextEmphasisStyle'
      | 'WebkitTextFillColor'
      | 'WebkitTextOrientation'
      | 'WebkitTextSizeAdjust'
      | 'WebkitTextStroke'
      | 'WebkitTextStrokeColor'
      | 'WebkitTextStrokeWidth'
      | 'WebkitTextUnderlinePosition'
      | 'WebkitTouchCallout'
      | 'WebkitTransform'
      | 'WebkitTransformOrigin'
      | 'WebkitTransformStyle'
      | 'WebkitTransition'
      | 'WebkitTransitionDelay'
      | 'WebkitTransitionDuration'
      | 'WebkitTransitionProperty'
      | 'WebkitTransitionTimingFunction'
      | 'WebkitUserModify'
      | 'WebkitUserSelect'
      | 'WebkitWritingMode'
      | 'accentColor'
      | 'alignContent'
      | 'alignItems'
      | 'alignSelf'
      | 'alignTracks'
      | 'alignmentBaseline'
      | 'all'
      | 'anchorName'
      | 'anchorScope'
      | 'animatePresence'
      | 'animation'
      | 'animationComposition'
      | 'animationDelay'
      | 'animationDirection'
      | 'animationDuration'
      | 'animationFillMode'
      | 'animationIterationCount'
      | 'animationName'
      | 'animationPlayState'
      | 'animationRange'
      | 'animationRangeEnd'
      | 'animationRangeStart'
      | 'animationTimeline'
      | 'animationTimingFunction'
      | 'appearance'
      | 'aspectRatio'
      | 'backdropFilter'
      | 'backfaceVisibility'
      | 'background'
      | 'backgroundAttachment'
      | 'backgroundBlendMode'
      | 'backgroundClip'
      | 'backgroundColor'
      | 'backgroundImage'
      | 'backgroundOrigin'
      | 'backgroundPosition'
      | 'backgroundPositionX'
      | 'backgroundPositionY'
      | 'backgroundRepeat'
      | 'backgroundSize'
      | 'baselineShift'
      | 'blockSize'
      | 'border'
      | 'borderBlock'
      | 'borderBlockColor'
      | 'borderBlockEnd'
      | 'borderBlockEndColor'
      | 'borderBlockEndStyle'
      | 'borderBlockEndWidth'
      | 'borderBlockStart'
      | 'borderBlockStartColor'
      | 'borderBlockStartStyle'
      | 'borderBlockStartWidth'
      | 'borderBlockStyle'
      | 'borderBlockWidth'
      | 'borderBottom'
      | 'borderBottomColor'
      | 'borderBottomEndRadius'
      | 'borderBottomLeftRadius'
      | 'borderBottomRightRadius'
      | 'borderBottomStartRadius'
      | 'borderBottomStyle'
      | 'borderBottomWidth'
      | 'borderCollapse'
      | 'borderColor'
      | 'borderCurve'
      | 'borderEndColor'
      | 'borderEndEndRadius'
      | 'borderEndStartRadius'
      | 'borderEndWidth'
      | 'borderImage'
      | 'borderImageOutset'
      | 'borderImageRepeat'
      | 'borderImageSlice'
      | 'borderImageSource'
      | 'borderImageWidth'
      | 'borderInline'
      | 'borderInlineColor'
      | 'borderInlineEnd'
      | 'borderInlineEndColor'
      | 'borderInlineEndStyle'
      | 'borderInlineEndWidth'
      | 'borderInlineStart'
      | 'borderInlineStartColor'
      | 'borderInlineStartStyle'
      | 'borderInlineStartWidth'
      | 'borderInlineStyle'
      | 'borderInlineWidth'
      | 'borderLeft'
      | 'borderLeftColor'
      | 'borderLeftStyle'
      | 'borderLeftWidth'
      | 'borderRadius'
      | 'borderRight'
      | 'borderRightColor'
      | 'borderRightStyle'
      | 'borderRightWidth'
      | 'borderSpacing'
      | 'borderStartColor'
      | 'borderStartEndRadius'
      | 'borderStartStartRadius'
      | 'borderStartWidth'
      | 'borderStyle'
      | 'borderTop'
      | 'borderTopColor'
      | 'borderTopEndRadius'
      | 'borderTopLeftRadius'
      | 'borderTopRightRadius'
      | 'borderTopStartRadius'
      | 'borderTopStyle'
      | 'borderTopWidth'
      | 'borderWidth'
      | 'bottom'
      | 'boxAlign'
      | 'boxDecorationBreak'
      | 'boxDirection'
      | 'boxFlex'
      | 'boxFlexGroup'
      | 'boxLines'
      | 'boxOrdinalGroup'
      | 'boxOrient'
      | 'boxPack'
      | 'boxShadow'
      | 'boxSizing'
      | 'breakAfter'
      | 'breakBefore'
      | 'breakInside'
      | 'captionSide'
      | 'caret'
      | 'caretColor'
      | 'caretShape'
      | 'clear'
      | 'clip'
      | 'clipPath'
      | 'clipRule'
      | 'color'
      | 'colorAdjust'
      | 'colorInterpolation'
      | 'colorInterpolationFilters'
      | 'colorRendering'
      | 'colorScheme'
      | 'columnCount'
      | 'columnFill'
      | 'columnGap'
      | 'columnRule'
      | 'columnRuleColor'
      | 'columnRuleStyle'
      | 'columnRuleWidth'
      | 'columnSpan'
      | 'columnWidth'
      | 'columns'
      | 'contain'
      | 'containIntrinsicBlockSize'
      | 'containIntrinsicHeight'
      | 'containIntrinsicInlineSize'
      | 'containIntrinsicSize'
      | 'containIntrinsicWidth'
      | 'containerName'
      | 'containerType'
      | 'content'
      | 'contentVisibility'
      | 'counterIncrement'
      | 'counterReset'
      | 'counterSet'
      | 'cursor'
      | 'cx'
      | 'cy'
      | 'd'
      | 'direction'
      | 'display'
      | 'dominantBaseline'
      | 'emptyCells'
      | 'end'
      | 'experimental_backgroundImage'
      | 'experimental_backgroundPosition'
      | 'experimental_backgroundRepeat'
      | 'experimental_backgroundSize'
      | 'fieldSizing'
      | 'fill'
      | 'fillOpacity'
      | 'fillRule'
      | 'filter'
      | 'flex'
      | 'flexBasis'
      | 'flexDirection'
      | 'flexFlow'
      | 'flexGrow'
      | 'flexShrink'
      | 'flexWrap'
      | 'float'
      | 'floodColor'
      | 'floodOpacity'
      | 'font'
      | 'fontFamily'
      | 'fontFeatureSettings'
      | 'fontKerning'
      | 'fontLanguageOverride'
      | 'fontOpticalSizing'
      | 'fontPalette'
      | 'fontSize'
      | 'fontSizeAdjust'
      | 'fontSmooth'
      | 'fontStretch'
      | 'fontStyle'
      | 'fontSynthesis'
      | 'fontSynthesisPosition'
      | 'fontSynthesisSmallCaps'
      | 'fontSynthesisStyle'
      | 'fontSynthesisWeight'
      | 'fontVariant'
      | 'fontVariantAlternates'
      | 'fontVariantCaps'
      | 'fontVariantEastAsian'
      | 'fontVariantEmoji'
      | 'fontVariantLigatures'
      | 'fontVariantNumeric'
      | 'fontVariantPosition'
      | 'fontVariationSettings'
      | 'fontWeight'
      | 'fontWidth'
      | 'forcedColorAdjust'
      | 'gap'
      | 'glyphOrientationVertical'
      | 'grid'
      | 'gridArea'
      | 'gridAutoColumns'
      | 'gridAutoFlow'
      | 'gridAutoRows'
      | 'gridColumn'
      | 'gridColumnEnd'
      | 'gridColumnGap'
      | 'gridColumnStart'
      | 'gridGap'
      | 'gridRow'
      | 'gridRowEnd'
      | 'gridRowGap'
      | 'gridRowStart'
      | 'gridTemplate'
      | 'gridTemplateAreas'
      | 'gridTemplateColumns'
      | 'gridTemplateRows'
      | 'hangingPunctuation'
      | 'height'
      | 'hotkey'
      | 'hyphenateCharacter'
      | 'hyphenateLimitChars'
      | 'hyphens'
      | 'imageOrientation'
      | 'imageRendering'
      | 'imageResolution'
      | 'imeMode'
      | 'initialLetter'
      | 'initialLetterAlign'
      | 'inlineSize'
      | 'inset'
      | 'insetArea'
      | 'insetBlock'
      | 'insetBlockEnd'
      | 'insetBlockStart'
      | 'insetInline'
      | 'insetInlineEnd'
      | 'insetInlineStart'
      | 'interpolateSize'
      | 'isolation'
      | 'justifyContent'
      | 'justifyItems'
      | 'justifySelf'
      | 'justifyTracks'
      | 'label'
      | 'left'
      | 'letterSpacing'
      | 'lightingColor'
      | 'lineBreak'
      | 'lineClamp'
      | 'lineHeight'
      | 'lineHeightStep'
      | 'listStyle'
      | 'listStyleImage'
      | 'listStylePosition'
      | 'listStyleType'
      | 'margin'
      | 'marginBlock'
      | 'marginBlockEnd'
      | 'marginBlockStart'
      | 'marginBottom'
      | 'marginEnd'
      | 'marginHorizontal'
      | 'marginInline'
      | 'marginInlineEnd'
      | 'marginInlineStart'
      | 'marginLeft'
      | 'marginRight'
      | 'marginStart'
      | 'marginTop'
      | 'marginTrim'
      | 'marginVertical'
      | 'marker'
      | 'markerEnd'
      | 'markerMid'
      | 'markerStart'
      | 'mask'
      | 'maskBorder'
      | 'maskBorderMode'
      | 'maskBorderOutset'
      | 'maskBorderRepeat'
      | 'maskBorderSlice'
      | 'maskBorderSource'
      | 'maskBorderWidth'
      | 'maskClip'
      | 'maskComposite'
      | 'maskImage'
      | 'maskMode'
      | 'maskOrigin'
      | 'maskPosition'
      | 'maskRepeat'
      | 'maskSize'
      | 'maskType'
      | 'masonryAutoFlow'
      | 'mathDepth'
      | 'mathShift'
      | 'mathStyle'
      | 'matrix'
      | 'maxBlockSize'
      | 'maxHeight'
      | 'maxInlineSize'
      | 'maxLines'
      | 'maxWidth'
      | 'minBlockSize'
      | 'minHeight'
      | 'minInlineSize'
      | 'minWidth'
      | 'mixBlendMode'
      | 'motion'
      | 'motionDistance'
      | 'motionPath'
      | 'motionRotation'
      | 'msAccelerator'
      | 'msBlockProgression'
      | 'msContentZoomChaining'
      | 'msContentZoomLimit'
      | 'msContentZoomLimitMax'
      | 'msContentZoomLimitMin'
      | 'msContentZoomSnap'
      | 'msContentZoomSnapPoints'
      | 'msContentZoomSnapType'
      | 'msContentZooming'
      | 'msFilter'
      | 'msFlex'
      | 'msFlexDirection'
      | 'msFlexPositive'
      | 'msFlowFrom'
      | 'msFlowInto'
      | 'msGridColumns'
      | 'msGridRows'
      | 'msHighContrastAdjust'
      | 'msHyphenateLimitChars'
      | 'msHyphenateLimitLines'
      | 'msHyphenateLimitZone'
      | 'msHyphens'
      | 'msImeAlign'
      | 'msImeMode'
      | 'msLineBreak'
      | 'msOrder'
      | 'msOverflowStyle'
      | 'msOverflowX'
      | 'msOverflowY'
      | 'msScrollChaining'
      | 'msScrollLimit'
      | 'msScrollLimitXMax'
      | 'msScrollLimitXMin'
      | 'msScrollLimitYMax'
      | 'msScrollLimitYMin'
      | 'msScrollRails'
      | 'msScrollSnapPointsX'
      | 'msScrollSnapPointsY'
      | 'msScrollSnapType'
      | 'msScrollSnapX'
      | 'msScrollSnapY'
      | 'msScrollTranslation'
      | 'msScrollbar3dlightColor'
      | 'msScrollbarArrowColor'
      | 'msScrollbarBaseColor'
      | 'msScrollbarDarkshadowColor'
      | 'msScrollbarFaceColor'
      | 'msScrollbarHighlightColor'
      | 'msScrollbarShadowColor'
      | 'msScrollbarTrackColor'
      | 'msTextAutospace'
      | 'msTextCombineHorizontal'
      | 'msTextOverflow'
      | 'msTouchAction'
      | 'msTouchSelect'
      | 'msTransform'
      | 'msTransformOrigin'
      | 'msTransition'
      | 'msTransitionDelay'
      | 'msTransitionDuration'
      | 'msTransitionProperty'
      | 'msTransitionTimingFunction'
      | 'msUserSelect'
      | 'msWordBreak'
      | 'msWrapFlow'
      | 'msWrapMargin'
      | 'msWrapThrough'
      | 'msWritingMode'
      | 'objectFit'
      | 'objectPosition'
      | 'objectViewBox'
      | 'offset'
      | 'offsetAnchor'
      | 'offsetBlock'
      | 'offsetBlockEnd'
      | 'offsetBlockStart'
      | 'offsetDistance'
      | 'offsetInline'
      | 'offsetInlineEnd'
      | 'offsetInlineStart'
      | 'offsetPath'
      | 'offsetPosition'
      | 'offsetRotate'
      | 'offsetRotation'
      | 'onTransition'
      | 'opacity'
      | 'order'
      | 'orphans'
      | 'outline'
      | 'outlineColor'
      | 'outlineOffset'
      | 'outlineStyle'
      | 'outlineWidth'
      | 'overflow'
      | 'overflowAnchor'
      | 'overflowBlock'
      | 'overflowClipBox'
      | 'overflowClipMargin'
      | 'overflowInline'
      | 'overflowWrap'
      | 'overflowX'
      | 'overflowY'
      | 'overlay'
      | 'overscrollBehavior'
      | 'overscrollBehaviorBlock'
      | 'overscrollBehaviorInline'
      | 'overscrollBehaviorX'
      | 'overscrollBehaviorY'
      | 'padding'
      | 'paddingBlock'
      | 'paddingBlockEnd'
      | 'paddingBlockStart'
      | 'paddingBottom'
      | 'paddingEnd'
      | 'paddingHorizontal'
      | 'paddingInline'
      | 'paddingInlineEnd'
      | 'paddingInlineStart'
      | 'paddingLeft'
      | 'paddingRight'
      | 'paddingStart'
      | 'paddingTop'
      | 'paddingVertical'
      | 'page'
      | 'pageBreakAfter'
      | 'pageBreakBefore'
      | 'pageBreakInside'
      | 'paintOrder'
      | 'passThrough'
      | 'perspective'
      | 'perspectiveOrigin'
      | 'placeContent'
      | 'placeItems'
      | 'placeSelf'
      | 'pointerEvents'
      | 'portalToRoot'
      | 'portalZIndex'
      | 'position'
      | 'positionAnchor'
      | 'positionArea'
      | 'positionTry'
      | 'positionTryFallbacks'
      | 'positionTryOptions'
      | 'positionTryOrder'
      | 'positionVisibility'
      | 'printColorAdjust'
      | 'quotes'
      | 'r'
      | 'resize'
      | 'right'
      | 'rotate'
      | 'rotateX'
      | 'rotateY'
      | 'rotateZ'
      | 'rowGap'
      | 'rubyAlign'
      | 'rubyMerge'
      | 'rubyOverhang'
      | 'rubyPosition'
      | 'rx'
      | 'ry'
      | 'scale'
      | 'scaleX'
      | 'scaleY'
      | 'scrollBehavior'
      | 'scrollInitialTarget'
      | 'scrollMargin'
      | 'scrollMarginBlock'
      | 'scrollMarginBlockEnd'
      | 'scrollMarginBlockStart'
      | 'scrollMarginBottom'
      | 'scrollMarginInline'
      | 'scrollMarginInlineEnd'
      | 'scrollMarginInlineStart'
      | 'scrollMarginLeft'
      | 'scrollMarginRight'
      | 'scrollMarginTop'
      | 'scrollPadding'
      | 'scrollPaddingBlock'
      | 'scrollPaddingBlockEnd'
      | 'scrollPaddingBlockStart'
      | 'scrollPaddingBottom'
      | 'scrollPaddingInline'
      | 'scrollPaddingInlineEnd'
      | 'scrollPaddingInlineStart'
      | 'scrollPaddingLeft'
      | 'scrollPaddingRight'
      | 'scrollPaddingTop'
      | 'scrollSnapAlign'
      | 'scrollSnapCoordinate'
      | 'scrollSnapDestination'
      | 'scrollSnapMargin'
      | 'scrollSnapMarginBottom'
      | 'scrollSnapMarginLeft'
      | 'scrollSnapMarginRight'
      | 'scrollSnapMarginTop'
      | 'scrollSnapPointsX'
      | 'scrollSnapPointsY'
      | 'scrollSnapStop'
      | 'scrollSnapType'
      | 'scrollSnapTypeX'
      | 'scrollSnapTypeY'
      | 'scrollTimeline'
      | 'scrollTimelineAxis'
      | 'scrollTimelineName'
      | 'scrollbarColor'
      | 'scrollbarGutter'
      | 'scrollbarWidth'
      | 'shadowColor'
      | 'shadowOffset'
      | 'shadowOpacity'
      | 'shadowRadius'
      | 'shapeImageThreshold'
      | 'shapeMargin'
      | 'shapeOutside'
      | 'shapeRendering'
      | 'skewX'
      | 'skewY'
      | 'speakAs'
      | 'start'
      | 'stopColor'
      | 'stopOpacity'
      | 'stroke'
      | 'strokeColor'
      | 'strokeDasharray'
      | 'strokeDashoffset'
      | 'strokeLinecap'
      | 'strokeLinejoin'
      | 'strokeMiterlimit'
      | 'strokeOpacity'
      | 'strokeWidth'
      | 'tabSize'
      | 'tableLayout'
      | 'textAlign'
      | 'textAlignLast'
      | 'textAnchor'
      | 'textAutospace'
      | 'textBox'
      | 'textBoxEdge'
      | 'textBoxTrim'
      | 'textCombineUpright'
      | 'textDecoration'
      | 'textDecorationColor'
      | 'textDecorationLine'
      | 'textDecorationSkip'
      | 'textDecorationSkipInk'
      | 'textDecorationStyle'
      | 'textDecorationThickness'
      | 'textEmphasis'
      | 'textEmphasisColor'
      | 'textEmphasisPosition'
      | 'textEmphasisStyle'
      | 'textIndent'
      | 'textJustify'
      | 'textOrientation'
      | 'textOverflow'
      | 'textRendering'
      | 'textShadow'
      | 'textSizeAdjust'
      | 'textSpacingTrim'
      | 'textTransform'
      | 'textUnderlineOffset'
      | 'textUnderlinePosition'
      | 'textWrap'
      | 'textWrapMode'
      | 'textWrapStyle'
      | 'timelineScope'
      | 'top'
      | 'touchAction'
      | 'transform'
      | 'transformBox'
      | 'transformOrigin'
      | 'transformStyle'
      | 'transition'
      | 'transitionBehavior'
      | 'transitionDelay'
      | 'transitionDuration'
      | 'transitionProperty'
      | 'transitionTimingFunction'
      | 'translate'
      | 'unicodeBidi'
      | 'userSelect'
      | 'vectorEffect'
      | 'verticalAlign'
      | 'viewTimeline'
      | 'viewTimelineAxis'
      | 'viewTimelineInset'
      | 'viewTimelineName'
      | 'viewTransitionClass'
      | 'viewTransitionName'
      | 'visibility'
      | 'whiteSpace'
      | 'whiteSpaceCollapse'
      | 'widows'
      | 'width'
      | 'willChange'
      | 'wordBreak'
      | 'wordSpacing'
      | 'wordWrap'
      | 'writingMode'
      | 'x'
      | 'y'
      | 'zIndex'
      | 'zoom'
      | keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
    > &
      Omit<
        import('@tamagui/core').GetFinalProps<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/core').StackStyleBase,
          {}
        >,
        'offset'
      > & {
        offset?:
          | number
          | {
              top?: number
              right?: number
              bottom?: number
              left?: number
            }
        hotkey?: string[]
        label?: string
        portalToRoot?: boolean
        portalZIndex?: number
      },
    | import('@tamagui/react-native-types/src').ReactNativeElement
    | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/core').GetFinalProps<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/core').StackStyleBase,
          {}
        >,
        'offset'
      > & {
        offset?:
          | number
          | {
              top?: number
              right?: number
              bottom?: number
              left?: number
            }
        hotkey?: string[]
        label?: string
        portalToRoot?: boolean
        portalZIndex?: number
      },
    import('@tamagui/core').StackStyleBase,
    {},
    import('@tamagui/core').StaticConfigPublic
  >
  List: typeof ToastList
  Item: import('react').FunctionComponent<
    Omit<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
        Omit<
          import('@tamagui/core').WithThemeValues<
            Omit<import('@tamagui/core').StackStyleBase, never>
          > &
            import('@tamagui/core').WithFlatVariantValues<{}> &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStyleBase
              >
            >,
          keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
        > & {
          toast: ToastT
          index: number
          children: React.ReactNode
        },
      never
    > &
      Omit<
        import('@tamagui/core').WithThemeValues<
          Omit<import('@tamagui/core').StackStyleBase, never>
        > &
          import('@tamagui/core').WithFlatVariantValues<{}> &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStyleBase
            >
          >,
        | 'index'
        | 'toast'
        | keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
        | keyof import('@tamagui/core').StackStyleBase
      > & {
        ref?:
          | import('react').Ref<
              | import('@tamagui/react-native-types/src').ReactNativeElement
              | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
            >
          | undefined
      }
  > &
    import('@tamagui/core').StaticComponentObject<
      import('@tamagui/core').TamaDefer,
      | import('@tamagui/react-native-types/src').ReactNativeElement
      | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
        Omit<
          import('@tamagui/core').WithThemeValues<
            Omit<import('@tamagui/core').StackStyleBase, never>
          > &
            import('@tamagui/core').WithFlatVariantValues<{}> &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStyleBase
              >
            >,
          keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
        > & {
          toast: ToastT
          index: number
          children: React.ReactNode
        },
      import('@tamagui/core').StackStyleBase,
      {},
      import('@tamagui/core').StaticConfigPublic
    > &
    Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
      __tama: [
        import('@tamagui/core').TamaDefer,
        (
          | import('@tamagui/react-native-types/src').ReactNativeElement
          | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
        ),
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
          Omit<
            import('@tamagui/core').WithThemeValues<
              Omit<import('@tamagui/core').StackStyleBase, never>
            > &
              import('@tamagui/core').WithFlatVariantValues<{}> &
              import('@tamagui/core').WithShorthands<
                import('@tamagui/core').WithThemeValues<
                  import('@tamagui/core').StackStyleBase
                >
              >,
            keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
          > & {
            toast: ToastT
            index: number
            children: React.ReactNode
          },
        import('@tamagui/core').StackStyleBase,
        {},
        import('@tamagui/core').StaticConfigPublic,
      ]
    }
  Title: import('react').FunctionComponent<
    Omit<import('@tamagui/core').TextNonStyleProps, 'size'> &
      Omit<
        import('@tamagui/core').WithThemeValues<
          Omit<import('@tamagui/core').TextStylePropsBase, 'size'>
        > &
          import('@tamagui/core').WithFlatVariantValues<{
            size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
          }> &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').TextStylePropsBase
            >
          >,
        keyof import('@tamagui/core').TextNonStyleProps
      > & {
        ref?: import('react').Ref<import('@tamagui/core').TamaguiTextElement> | undefined
      }
  > &
    import('@tamagui/core').StaticComponentObject<
      import('@tamagui/core').TamaDefer,
      import('@tamagui/core').TamaguiTextElement,
      import('@tamagui/core').TextNonStyleProps,
      import('@tamagui/core').TextStylePropsBase,
      {
        size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
      },
      import('@tamagui/core').StaticConfigPublic
    > &
    Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
      __tama: [
        import('@tamagui/core').TamaDefer,
        import('@tamagui/core').TamaguiTextElement,
        import('@tamagui/core').TextNonStyleProps,
        import('@tamagui/core').TextStylePropsBase,
        {
          size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
        },
        import('@tamagui/core').StaticConfigPublic,
      ]
    }
  Description: import('react').FunctionComponent<
    Omit<import('@tamagui/core').TextNonStyleProps, 'size'> &
      Omit<
        import('@tamagui/core').WithThemeValues<
          Omit<import('@tamagui/core').TextStylePropsBase, 'size'>
        > &
          import('@tamagui/core').WithFlatVariantValues<{
            size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
          }> &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').TextStylePropsBase
            >
          >,
        keyof import('@tamagui/core').TextNonStyleProps
      > & {
        ref?: import('react').Ref<import('@tamagui/core').TamaguiTextElement> | undefined
      }
  > &
    import('@tamagui/core').StaticComponentObject<
      import('@tamagui/core').TamaDefer,
      import('@tamagui/core').TamaguiTextElement,
      import('@tamagui/core').TextNonStyleProps,
      import('@tamagui/core').TextStylePropsBase,
      {
        size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
      },
      import('@tamagui/core').StaticConfigPublic
    > &
    Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
      __tama: [
        import('@tamagui/core').TamaDefer,
        import('@tamagui/core').TamaguiTextElement,
        import('@tamagui/core').TextNonStyleProps,
        import('@tamagui/core').TextStylePropsBase,
        {
          size?: import('@tamagui/get-font-sized').GetFontSizedInput | undefined
        },
        import('@tamagui/core').StaticConfigPublic,
      ]
    }
  Close: import('react').FunctionComponent<
    Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
      Omit<
        import('@tamagui/core').WithThemeValues<
          Omit<import('@tamagui/core').StackStyleBase, never>
        > &
          import('@tamagui/core').WithFlatVariantValues<{}> &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStyleBase
            >
          >,
        keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
      > & {
        ref?:
          | import('react').Ref<
              | import('@tamagui/react-native-types/src').ReactNativeElement
              | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
            >
          | undefined
      }
  > &
    import('@tamagui/core').StaticComponentObject<
      import('@tamagui/core').TamaDefer,
      | import('@tamagui/react-native-types/src').ReactNativeElement
      | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {},
      import('@tamagui/core').StaticConfigPublic
    > &
    Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
      __tama: [
        import('@tamagui/core').TamaDefer,
        (
          | import('@tamagui/react-native-types/src').ReactNativeElement
          | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
        ),
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/core').StackStyleBase,
        {},
        import('@tamagui/core').StaticConfigPublic,
      ]
    }
  Action: import('react').FunctionComponent<
    Omit<import('@tamagui/core').RNTamaguiViewNonStyleProps, never> &
      Omit<
        import('@tamagui/core').WithThemeValues<
          Omit<import('@tamagui/core').StackStyleBase, never>
        > &
          import('@tamagui/core').WithFlatVariantValues<{}> &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStyleBase
            >
          >,
        keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
      > & {
        ref?:
          | import('react').Ref<
              | import('@tamagui/react-native-types/src').ReactNativeElement
              | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
            >
          | undefined
      }
  > &
    import('@tamagui/core').StaticComponentObject<
      import('@tamagui/core').TamaDefer,
      | import('@tamagui/react-native-types/src').ReactNativeElement
      | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {},
      import('@tamagui/core').StaticConfigPublic
    > &
    Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
      __tama: [
        import('@tamagui/core').TamaDefer,
        (
          | import('@tamagui/react-native-types/src').ReactNativeElement
          | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
        ),
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/core').StackStyleBase,
        {},
        import('@tamagui/core').StaticConfigPublic,
      ]
    }
  Icon: (props: { children?: React.ReactNode }) => React.JSX.Element | null
}
export { toast, useToastItem, useToasts }
export type { ExternalToast, ToastPosition, ToastT }
//# sourceMappingURL=Toast.d.ts.map
