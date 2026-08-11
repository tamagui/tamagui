import { type ThemeProps } from '@tamagui/core'
import * as React from 'react'
import type {
  SwitchComponent as SwitchFrameComponent,
  SwitchThumbComponent as SwitchThumbFrameComponent,
} from './types'
export declare const SwitchThumbFrame: React.FunctionComponent<
  Omit<
    import('@tamagui/core').RNTamaguiViewNonStyleProps,
    'active' | 'frameWidth' | 'size' | keyof import('@tamagui/core').StackStyleBase
  > &
    import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> & {
      active?: boolean | undefined
      frameWidth?: number | undefined
      size?: number | import('@tamagui/core').Size | undefined
    } & import('@tamagui/core').WithShorthands<
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
    > & {
      ref?: React.Ref<import('@tamagui/core').TamaguiElement> | undefined
    }
> &
  import('@tamagui/core').StaticComponentObject<
    import('@tamagui/core').TamaDefer,
    import('@tamagui/core').TamaguiElement,
    import('@tamagui/core').RNTamaguiViewNonStyleProps,
    import('@tamagui/core').StackStyleBase,
    {
      active?: boolean | undefined
      frameWidth?: number | undefined
      size?: number | import('@tamagui/core').Size | undefined
    },
    import('@tamagui/core').StaticConfigPublic
  > &
  Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/core').TamaDefer,
      import('@tamagui/core').TamaguiElement,
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        active?: boolean | undefined
        frameWidth?: number | undefined
        size?: number | import('@tamagui/core').Size | undefined
      },
      import('@tamagui/core').StaticConfigPublic,
    ]
  }
export declare const SwitchFrame: React.FunctionComponent<
  Omit<
    import('@tamagui/core').RNTamaguiViewNonStyleProps,
    'active' | 'frameWidth' | 'size' | keyof import('@tamagui/core').StackStyleBase
  > &
    import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> & {
      active?: boolean | undefined
      frameWidth?: number | undefined
      size?: number | import('@tamagui/core').Size | undefined
    } & import('@tamagui/core').WithShorthands<
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
    > & {
      ref?: React.Ref<import('@tamagui/core').TamaguiElement> | undefined
    }
> &
  import('@tamagui/core').StaticComponentObject<
    import('@tamagui/core').TamaDefer,
    import('@tamagui/core').TamaguiElement,
    import('@tamagui/core').RNTamaguiViewNonStyleProps,
    import('@tamagui/core').StackStyleBase,
    {
      active?: boolean | undefined
      frameWidth?: number | undefined
      size?: number | import('@tamagui/core').Size | undefined
    },
    import('@tamagui/core').StaticConfigPublic
  > &
  Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/core').TamaDefer,
      import('@tamagui/core').TamaguiElement,
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        active?: boolean | undefined
        frameWidth?: number | undefined
        size?: number | import('@tamagui/core').Size | undefined
      },
      import('@tamagui/core').StaticConfigPublic,
    ]
  }
export declare function createSwitch(createProps: {
  Frame?: SwitchFrameComponent
  Thumb?: SwitchThumbFrameComponent
  componentThemes?: {
    frame?: ThemeProps['name']
    thumb?: ThemeProps['name']
  }
}): React.FunctionComponent<
  Omit<
    import('@tamagui/core').GetFinalProps<
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        active?: boolean | undefined
        frameWidth?: number | undefined
        size?: number | import('@tamagui/core').Size | undefined
      }
    >,
    | 'accessibilityActions'
    | 'accessibilityElementsHidden'
    | 'accessibilityHint'
    | 'accessibilityIgnoresInvertColors'
    | 'accessibilityLabel'
    | 'accessibilityLabelledBy'
    | 'accessibilityLanguage'
    | 'accessibilityLargeContentTitle'
    | 'accessibilityLiveRegion'
    | 'accessibilityRespondsToUserInteraction'
    | 'accessibilityRole'
    | 'accessibilityShowsLargeContentViewer'
    | 'accessibilityState'
    | 'accessibilityValue'
    | 'accessibilityViewIsModal'
    | 'accessible'
    | 'activeStyle'
    | 'activeTheme'
    | 'alignContent'
    | 'alignItems'
    | 'alignSelf'
    | 'animateOnly'
    | 'animatePresence'
    | 'animatedBy'
    | 'aria-busy'
    | 'aria-checked'
    | 'aria-disabled'
    | 'aria-expanded'
    | 'aria-hidden'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-live'
    | 'aria-modal'
    | 'aria-selected'
    | 'aria-valuemax'
    | 'aria-valuemin'
    | 'aria-valuenow'
    | 'aria-valuetext'
    | 'asChild'
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
    | 'backgroundRepeat'
    | 'backgroundSize'
    | 'blockSize'
    | 'border'
    | 'borderBlock'
    | 'borderBlockColor'
    | 'borderBlockEndColor'
    | 'borderBlockEndStyle'
    | 'borderBlockEndWidth'
    | 'borderBlockStartColor'
    | 'borderBlockStartStyle'
    | 'borderBlockStartWidth'
    | 'borderBlockStyle'
    | 'borderBlockWidth'
    | 'borderBottomColor'
    | 'borderBottomEndRadius'
    | 'borderBottomLeftRadius'
    | 'borderBottomRightRadius'
    | 'borderBottomStartRadius'
    | 'borderBottomWidth'
    | 'borderColor'
    | 'borderCurve'
    | 'borderEndColor'
    | 'borderEndEndRadius'
    | 'borderEndStartRadius'
    | 'borderEndWidth'
    | 'borderImage'
    | 'borderInline'
    | 'borderInlineColor'
    | 'borderInlineEndColor'
    | 'borderInlineEndStyle'
    | 'borderInlineEndWidth'
    | 'borderInlineStartColor'
    | 'borderInlineStartStyle'
    | 'borderInlineStartWidth'
    | 'borderInlineStyle'
    | 'borderInlineWidth'
    | 'borderLeftColor'
    | 'borderLeftWidth'
    | 'borderRadius'
    | 'borderRightColor'
    | 'borderRightWidth'
    | 'borderStartColor'
    | 'borderStartEndRadius'
    | 'borderStartStartRadius'
    | 'borderStartWidth'
    | 'borderStyle'
    | 'borderTopColor'
    | 'borderTopEndRadius'
    | 'borderTopLeftRadius'
    | 'borderTopRightRadius'
    | 'borderTopStartRadius'
    | 'borderTopWidth'
    | 'borderWidth'
    | 'bottom'
    | 'boxShadow'
    | 'boxSizing'
    | 'caretColor'
    | 'checked'
    | 'children'
    | 'className'
    | 'clipPath'
    | 'collapsable'
    | 'collapsableChildren'
    | 'color'
    | 'columnGap'
    | 'componentName'
    | 'contain'
    | 'container'
    | 'containerName'
    | 'containerType'
    | 'cursor'
    | 'dangerouslySetInnerHTML'
    | 'debug'
    | 'defaultChecked'
    | 'direction'
    | 'disableClassName'
    | 'disableNativeStyle'
    | 'disableOptimization'
    | 'disabled'
    | 'display'
    | 'end'
    | 'experimental_backgroundImage'
    | 'filter'
    | 'flex'
    | 'flexBasis'
    | 'flexDirection'
    | 'flexGrow'
    | 'flexShrink'
    | 'flexWrap'
    | 'float'
    | 'forceStyle'
    | 'gap'
    | 'gridColumn'
    | 'gridColumnEnd'
    | 'gridColumnGap'
    | 'gridColumnStart'
    | 'gridRow'
    | 'gridRowEnd'
    | 'gridRowGap'
    | 'gridRowStart'
    | 'gridTemplateAreas'
    | 'gridTemplateColumns'
    | 'group'
    | 'hasTVPreferredFocus'
    | 'height'
    | 'hitSlop'
    | 'htmlFor'
    | 'id'
    | 'importantForAccessibility'
    | 'inlineSize'
    | 'inset'
    | 'insetBlock'
    | 'insetBlockEnd'
    | 'insetBlockStart'
    | 'insetInline'
    | 'insetInlineEnd'
    | 'insetInlineStart'
    | 'isTVSelectable'
    | 'isolation'
    | 'justifyContent'
    | 'labeledBy'
    | 'left'
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
    | 'marginVertical'
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
    | 'matrix'
    | 'maxBlockSize'
    | 'maxHeight'
    | 'maxInlineSize'
    | 'maxWidth'
    | 'minBlockSize'
    | 'minHeight'
    | 'minInlineSize'
    | 'minWidth'
    | 'mixBlendMode'
    | 'name'
    | 'native'
    | 'nativeID'
    | 'nativeProps'
    | 'needsOffscreenAlphaCompositing'
    | 'objectFit'
    | 'onAccessibilityAction'
    | 'onAccessibilityEscape'
    | 'onAccessibilityTap'
    | 'onBeforeInput'
    | 'onBlur'
    | 'onChange'
    | 'onCheckedChange'
    | 'onClick'
    | 'onContextMenu'
    | 'onCopy'
    | 'onCut'
    | 'onDoubleClick'
    | 'onDrag'
    | 'onDragEnd'
    | 'onDragEnter'
    | 'onDragLeave'
    | 'onDragOver'
    | 'onDragStart'
    | 'onDrop'
    | 'onFocus'
    | 'onInput'
    | 'onKeyDown'
    | 'onKeyUp'
    | 'onLongPress'
    | 'onMagicTap'
    | 'onMouseDown'
    | 'onMouseEnter'
    | 'onMouseLeave'
    | 'onMouseMove'
    | 'onMouseOut'
    | 'onMouseOver'
    | 'onMouseUp'
    | 'onPaste'
    | 'onPointerCancel'
    | 'onPointerCancelCapture'
    | 'onPointerDown'
    | 'onPointerDownCapture'
    | 'onPointerEnter'
    | 'onPointerEnterCapture'
    | 'onPointerLeave'
    | 'onPointerLeaveCapture'
    | 'onPointerMove'
    | 'onPointerMoveCapture'
    | 'onPointerUp'
    | 'onPointerUpCapture'
    | 'onPress'
    | 'onPressIn'
    | 'onPressOut'
    | 'onScroll'
    | 'onTouchCancel'
    | 'onTouchEnd'
    | 'onTouchEndCapture'
    | 'onTouchMove'
    | 'onTouchStart'
    | 'onTransition'
    | 'onWheel'
    | 'opacity'
    | 'outline'
    | 'outlineColor'
    | 'outlineOffset'
    | 'outlineStyle'
    | 'outlineWidth'
    | 'overflow'
    | 'overflowBlock'
    | 'overflowInline'
    | 'overflowWrap'
    | 'overflowX'
    | 'overflowY'
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
    | 'passThrough'
    | 'perspective'
    | 'pointerEvents'
    | 'position'
    | 'removeClippedSubviews'
    | 'render'
    | 'renderToHardwareTextureAndroid'
    | 'required'
    | 'resize'
    | 'right'
    | 'role'
    | 'rotate'
    | 'rotateX'
    | 'rotateY'
    | 'rotateZ'
    | 'rotation'
    | 'rowGap'
    | 'scale'
    | 'scaleX'
    | 'scaleY'
    | 'screenReaderFocusable'
    | 'shadowColor'
    | 'shadowOffset'
    | 'shadowOpacity'
    | 'shadowRadius'
    | 'shouldRasterizeIOS'
    | 'size'
    | 'skewX'
    | 'skewY'
    | 'start'
    | 'style'
    | 'tabIndex'
    | 'target'
    | 'testID'
    | 'textEmphasis'
    | 'textWrap'
    | 'theme'
    | 'themeShallow'
    | 'top'
    | 'transform'
    | 'transformMatrix'
    | 'transformOrigin'
    | 'transformStyle'
    | 'transition'
    | 'translateX'
    | 'translateY'
    | 'tvParallaxMagnification'
    | 'tvParallaxShiftDistanceX'
    | 'tvParallaxShiftDistanceY'
    | 'tvParallaxTiltAngle'
    | 'untilMeasured'
    | 'userSelect'
    | 'value'
    | 'verticalAlign'
    | 'visibility'
    | 'width'
    | 'wordWrap'
    | 'x'
    | 'y'
    | 'zIndex'
  > &
    import('@tamagui/core').StackNonStyleProps &
    import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
    import('@tamagui/core').WithShorthands<
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
    > &
    import('./types').SwitchSharedProps &
    import('@tamagui/switch-headless').SwitchExtraProps & {
      native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
      nativeProps?: import('react-native').SwitchProps
    } & import('./types').SwitchFrameActiveStyleProps & {
      ref?:
        | React.Ref<
            | import('react-native').View
            | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
          >
        | undefined
    }
> &
  import('@tamagui/core').StaticComponentObject<
    Omit<
      import('@tamagui/core').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/core').StackStyleBase,
        {
          active?: boolean | undefined
          frameWidth?: number | undefined
          size?: number | import('@tamagui/core').Size | undefined
        }
      >,
      | 'accessibilityActions'
      | 'accessibilityElementsHidden'
      | 'accessibilityHint'
      | 'accessibilityIgnoresInvertColors'
      | 'accessibilityLabel'
      | 'accessibilityLabelledBy'
      | 'accessibilityLanguage'
      | 'accessibilityLargeContentTitle'
      | 'accessibilityLiveRegion'
      | 'accessibilityRespondsToUserInteraction'
      | 'accessibilityRole'
      | 'accessibilityShowsLargeContentViewer'
      | 'accessibilityState'
      | 'accessibilityValue'
      | 'accessibilityViewIsModal'
      | 'accessible'
      | 'activeStyle'
      | 'activeTheme'
      | 'alignContent'
      | 'alignItems'
      | 'alignSelf'
      | 'animateOnly'
      | 'animatePresence'
      | 'animatedBy'
      | 'aria-busy'
      | 'aria-checked'
      | 'aria-disabled'
      | 'aria-expanded'
      | 'aria-hidden'
      | 'aria-label'
      | 'aria-labelledby'
      | 'aria-live'
      | 'aria-modal'
      | 'aria-selected'
      | 'aria-valuemax'
      | 'aria-valuemin'
      | 'aria-valuenow'
      | 'aria-valuetext'
      | 'asChild'
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
      | 'backgroundRepeat'
      | 'backgroundSize'
      | 'blockSize'
      | 'border'
      | 'borderBlock'
      | 'borderBlockColor'
      | 'borderBlockEndColor'
      | 'borderBlockEndStyle'
      | 'borderBlockEndWidth'
      | 'borderBlockStartColor'
      | 'borderBlockStartStyle'
      | 'borderBlockStartWidth'
      | 'borderBlockStyle'
      | 'borderBlockWidth'
      | 'borderBottomColor'
      | 'borderBottomEndRadius'
      | 'borderBottomLeftRadius'
      | 'borderBottomRightRadius'
      | 'borderBottomStartRadius'
      | 'borderBottomWidth'
      | 'borderColor'
      | 'borderCurve'
      | 'borderEndColor'
      | 'borderEndEndRadius'
      | 'borderEndStartRadius'
      | 'borderEndWidth'
      | 'borderImage'
      | 'borderInline'
      | 'borderInlineColor'
      | 'borderInlineEndColor'
      | 'borderInlineEndStyle'
      | 'borderInlineEndWidth'
      | 'borderInlineStartColor'
      | 'borderInlineStartStyle'
      | 'borderInlineStartWidth'
      | 'borderInlineStyle'
      | 'borderInlineWidth'
      | 'borderLeftColor'
      | 'borderLeftWidth'
      | 'borderRadius'
      | 'borderRightColor'
      | 'borderRightWidth'
      | 'borderStartColor'
      | 'borderStartEndRadius'
      | 'borderStartStartRadius'
      | 'borderStartWidth'
      | 'borderStyle'
      | 'borderTopColor'
      | 'borderTopEndRadius'
      | 'borderTopLeftRadius'
      | 'borderTopRightRadius'
      | 'borderTopStartRadius'
      | 'borderTopWidth'
      | 'borderWidth'
      | 'bottom'
      | 'boxShadow'
      | 'boxSizing'
      | 'caretColor'
      | 'checked'
      | 'children'
      | 'className'
      | 'clipPath'
      | 'collapsable'
      | 'collapsableChildren'
      | 'color'
      | 'columnGap'
      | 'componentName'
      | 'contain'
      | 'container'
      | 'containerName'
      | 'containerType'
      | 'cursor'
      | 'dangerouslySetInnerHTML'
      | 'debug'
      | 'defaultChecked'
      | 'direction'
      | 'disableClassName'
      | 'disableNativeStyle'
      | 'disableOptimization'
      | 'disabled'
      | 'display'
      | 'end'
      | 'experimental_backgroundImage'
      | 'filter'
      | 'flex'
      | 'flexBasis'
      | 'flexDirection'
      | 'flexGrow'
      | 'flexShrink'
      | 'flexWrap'
      | 'float'
      | 'forceStyle'
      | 'gap'
      | 'gridColumn'
      | 'gridColumnEnd'
      | 'gridColumnGap'
      | 'gridColumnStart'
      | 'gridRow'
      | 'gridRowEnd'
      | 'gridRowGap'
      | 'gridRowStart'
      | 'gridTemplateAreas'
      | 'gridTemplateColumns'
      | 'group'
      | 'hasTVPreferredFocus'
      | 'height'
      | 'hitSlop'
      | 'htmlFor'
      | 'id'
      | 'importantForAccessibility'
      | 'inlineSize'
      | 'inset'
      | 'insetBlock'
      | 'insetBlockEnd'
      | 'insetBlockStart'
      | 'insetInline'
      | 'insetInlineEnd'
      | 'insetInlineStart'
      | 'isTVSelectable'
      | 'isolation'
      | 'justifyContent'
      | 'labeledBy'
      | 'left'
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
      | 'marginVertical'
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
      | 'matrix'
      | 'maxBlockSize'
      | 'maxHeight'
      | 'maxInlineSize'
      | 'maxWidth'
      | 'minBlockSize'
      | 'minHeight'
      | 'minInlineSize'
      | 'minWidth'
      | 'mixBlendMode'
      | 'name'
      | 'native'
      | 'nativeID'
      | 'nativeProps'
      | 'needsOffscreenAlphaCompositing'
      | 'objectFit'
      | 'onAccessibilityAction'
      | 'onAccessibilityEscape'
      | 'onAccessibilityTap'
      | 'onBeforeInput'
      | 'onBlur'
      | 'onChange'
      | 'onCheckedChange'
      | 'onClick'
      | 'onContextMenu'
      | 'onCopy'
      | 'onCut'
      | 'onDoubleClick'
      | 'onDrag'
      | 'onDragEnd'
      | 'onDragEnter'
      | 'onDragLeave'
      | 'onDragOver'
      | 'onDragStart'
      | 'onDrop'
      | 'onFocus'
      | 'onInput'
      | 'onKeyDown'
      | 'onKeyUp'
      | 'onLongPress'
      | 'onMagicTap'
      | 'onMouseDown'
      | 'onMouseEnter'
      | 'onMouseLeave'
      | 'onMouseMove'
      | 'onMouseOut'
      | 'onMouseOver'
      | 'onMouseUp'
      | 'onPaste'
      | 'onPointerCancel'
      | 'onPointerCancelCapture'
      | 'onPointerDown'
      | 'onPointerDownCapture'
      | 'onPointerEnter'
      | 'onPointerEnterCapture'
      | 'onPointerLeave'
      | 'onPointerLeaveCapture'
      | 'onPointerMove'
      | 'onPointerMoveCapture'
      | 'onPointerUp'
      | 'onPointerUpCapture'
      | 'onPress'
      | 'onPressIn'
      | 'onPressOut'
      | 'onScroll'
      | 'onTouchCancel'
      | 'onTouchEnd'
      | 'onTouchEndCapture'
      | 'onTouchMove'
      | 'onTouchStart'
      | 'onTransition'
      | 'onWheel'
      | 'opacity'
      | 'outline'
      | 'outlineColor'
      | 'outlineOffset'
      | 'outlineStyle'
      | 'outlineWidth'
      | 'overflow'
      | 'overflowBlock'
      | 'overflowInline'
      | 'overflowWrap'
      | 'overflowX'
      | 'overflowY'
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
      | 'passThrough'
      | 'perspective'
      | 'pointerEvents'
      | 'position'
      | 'removeClippedSubviews'
      | 'render'
      | 'renderToHardwareTextureAndroid'
      | 'required'
      | 'resize'
      | 'right'
      | 'role'
      | 'rotate'
      | 'rotateX'
      | 'rotateY'
      | 'rotateZ'
      | 'rotation'
      | 'rowGap'
      | 'scale'
      | 'scaleX'
      | 'scaleY'
      | 'screenReaderFocusable'
      | 'shadowColor'
      | 'shadowOffset'
      | 'shadowOpacity'
      | 'shadowRadius'
      | 'shouldRasterizeIOS'
      | 'size'
      | 'skewX'
      | 'skewY'
      | 'start'
      | 'style'
      | 'tabIndex'
      | 'target'
      | 'testID'
      | 'textEmphasis'
      | 'textWrap'
      | 'theme'
      | 'themeShallow'
      | 'top'
      | 'transform'
      | 'transformMatrix'
      | 'transformOrigin'
      | 'transformStyle'
      | 'transition'
      | 'translateX'
      | 'translateY'
      | 'tvParallaxMagnification'
      | 'tvParallaxShiftDistanceX'
      | 'tvParallaxShiftDistanceY'
      | 'tvParallaxTiltAngle'
      | 'untilMeasured'
      | 'userSelect'
      | 'value'
      | 'verticalAlign'
      | 'visibility'
      | 'width'
      | 'wordWrap'
      | 'x'
      | 'y'
      | 'zIndex'
    > &
      import('@tamagui/core').StackNonStyleProps &
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
      import('@tamagui/core').WithShorthands<
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
      > &
      import('./types').SwitchSharedProps &
      import('@tamagui/switch-headless').SwitchExtraProps & {
        native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
        nativeProps?: import('react-native').SwitchProps
      } & import('./types').SwitchFrameActiveStyleProps,
    | import('react-native').View
    | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      import('@tamagui/core').StackNonStyleProps &
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
      import('@tamagui/core').WithShorthands<
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
      > &
      import('./types').SwitchSharedProps &
      import('@tamagui/switch-headless').SwitchExtraProps & {
        native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
        nativeProps?: import('react-native').SwitchProps
      } & import('./types').SwitchFrameActiveStyleProps,
    import('@tamagui/core').StackStyleBase,
    {
      active?: boolean | undefined
      frameWidth?: number | undefined
      size?: number | import('@tamagui/core').Size | undefined
    },
    import('@tamagui/core').StaticConfigPublic
  > &
  Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      Omit<
        import('@tamagui/core').GetFinalProps<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/core').StackStyleBase,
          {
            active?: boolean | undefined
            frameWidth?: number | undefined
            size?: number | import('@tamagui/core').Size | undefined
          }
        >,
        | 'accessibilityActions'
        | 'accessibilityElementsHidden'
        | 'accessibilityHint'
        | 'accessibilityIgnoresInvertColors'
        | 'accessibilityLabel'
        | 'accessibilityLabelledBy'
        | 'accessibilityLanguage'
        | 'accessibilityLargeContentTitle'
        | 'accessibilityLiveRegion'
        | 'accessibilityRespondsToUserInteraction'
        | 'accessibilityRole'
        | 'accessibilityShowsLargeContentViewer'
        | 'accessibilityState'
        | 'accessibilityValue'
        | 'accessibilityViewIsModal'
        | 'accessible'
        | 'activeStyle'
        | 'activeTheme'
        | 'alignContent'
        | 'alignItems'
        | 'alignSelf'
        | 'animateOnly'
        | 'animatePresence'
        | 'animatedBy'
        | 'aria-busy'
        | 'aria-checked'
        | 'aria-disabled'
        | 'aria-expanded'
        | 'aria-hidden'
        | 'aria-label'
        | 'aria-labelledby'
        | 'aria-live'
        | 'aria-modal'
        | 'aria-selected'
        | 'aria-valuemax'
        | 'aria-valuemin'
        | 'aria-valuenow'
        | 'aria-valuetext'
        | 'asChild'
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
        | 'backgroundRepeat'
        | 'backgroundSize'
        | 'blockSize'
        | 'border'
        | 'borderBlock'
        | 'borderBlockColor'
        | 'borderBlockEndColor'
        | 'borderBlockEndStyle'
        | 'borderBlockEndWidth'
        | 'borderBlockStartColor'
        | 'borderBlockStartStyle'
        | 'borderBlockStartWidth'
        | 'borderBlockStyle'
        | 'borderBlockWidth'
        | 'borderBottomColor'
        | 'borderBottomEndRadius'
        | 'borderBottomLeftRadius'
        | 'borderBottomRightRadius'
        | 'borderBottomStartRadius'
        | 'borderBottomWidth'
        | 'borderColor'
        | 'borderCurve'
        | 'borderEndColor'
        | 'borderEndEndRadius'
        | 'borderEndStartRadius'
        | 'borderEndWidth'
        | 'borderImage'
        | 'borderInline'
        | 'borderInlineColor'
        | 'borderInlineEndColor'
        | 'borderInlineEndStyle'
        | 'borderInlineEndWidth'
        | 'borderInlineStartColor'
        | 'borderInlineStartStyle'
        | 'borderInlineStartWidth'
        | 'borderInlineStyle'
        | 'borderInlineWidth'
        | 'borderLeftColor'
        | 'borderLeftWidth'
        | 'borderRadius'
        | 'borderRightColor'
        | 'borderRightWidth'
        | 'borderStartColor'
        | 'borderStartEndRadius'
        | 'borderStartStartRadius'
        | 'borderStartWidth'
        | 'borderStyle'
        | 'borderTopColor'
        | 'borderTopEndRadius'
        | 'borderTopLeftRadius'
        | 'borderTopRightRadius'
        | 'borderTopStartRadius'
        | 'borderTopWidth'
        | 'borderWidth'
        | 'bottom'
        | 'boxShadow'
        | 'boxSizing'
        | 'caretColor'
        | 'checked'
        | 'children'
        | 'className'
        | 'clipPath'
        | 'collapsable'
        | 'collapsableChildren'
        | 'color'
        | 'columnGap'
        | 'componentName'
        | 'contain'
        | 'container'
        | 'containerName'
        | 'containerType'
        | 'cursor'
        | 'dangerouslySetInnerHTML'
        | 'debug'
        | 'defaultChecked'
        | 'direction'
        | 'disableClassName'
        | 'disableNativeStyle'
        | 'disableOptimization'
        | 'disabled'
        | 'display'
        | 'end'
        | 'experimental_backgroundImage'
        | 'filter'
        | 'flex'
        | 'flexBasis'
        | 'flexDirection'
        | 'flexGrow'
        | 'flexShrink'
        | 'flexWrap'
        | 'float'
        | 'forceStyle'
        | 'gap'
        | 'gridColumn'
        | 'gridColumnEnd'
        | 'gridColumnGap'
        | 'gridColumnStart'
        | 'gridRow'
        | 'gridRowEnd'
        | 'gridRowGap'
        | 'gridRowStart'
        | 'gridTemplateAreas'
        | 'gridTemplateColumns'
        | 'group'
        | 'hasTVPreferredFocus'
        | 'height'
        | 'hitSlop'
        | 'htmlFor'
        | 'id'
        | 'importantForAccessibility'
        | 'inlineSize'
        | 'inset'
        | 'insetBlock'
        | 'insetBlockEnd'
        | 'insetBlockStart'
        | 'insetInline'
        | 'insetInlineEnd'
        | 'insetInlineStart'
        | 'isTVSelectable'
        | 'isolation'
        | 'justifyContent'
        | 'labeledBy'
        | 'left'
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
        | 'marginVertical'
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
        | 'matrix'
        | 'maxBlockSize'
        | 'maxHeight'
        | 'maxInlineSize'
        | 'maxWidth'
        | 'minBlockSize'
        | 'minHeight'
        | 'minInlineSize'
        | 'minWidth'
        | 'mixBlendMode'
        | 'name'
        | 'native'
        | 'nativeID'
        | 'nativeProps'
        | 'needsOffscreenAlphaCompositing'
        | 'objectFit'
        | 'onAccessibilityAction'
        | 'onAccessibilityEscape'
        | 'onAccessibilityTap'
        | 'onBeforeInput'
        | 'onBlur'
        | 'onChange'
        | 'onCheckedChange'
        | 'onClick'
        | 'onContextMenu'
        | 'onCopy'
        | 'onCut'
        | 'onDoubleClick'
        | 'onDrag'
        | 'onDragEnd'
        | 'onDragEnter'
        | 'onDragLeave'
        | 'onDragOver'
        | 'onDragStart'
        | 'onDrop'
        | 'onFocus'
        | 'onInput'
        | 'onKeyDown'
        | 'onKeyUp'
        | 'onLongPress'
        | 'onMagicTap'
        | 'onMouseDown'
        | 'onMouseEnter'
        | 'onMouseLeave'
        | 'onMouseMove'
        | 'onMouseOut'
        | 'onMouseOver'
        | 'onMouseUp'
        | 'onPaste'
        | 'onPointerCancel'
        | 'onPointerCancelCapture'
        | 'onPointerDown'
        | 'onPointerDownCapture'
        | 'onPointerEnter'
        | 'onPointerEnterCapture'
        | 'onPointerLeave'
        | 'onPointerLeaveCapture'
        | 'onPointerMove'
        | 'onPointerMoveCapture'
        | 'onPointerUp'
        | 'onPointerUpCapture'
        | 'onPress'
        | 'onPressIn'
        | 'onPressOut'
        | 'onScroll'
        | 'onTouchCancel'
        | 'onTouchEnd'
        | 'onTouchEndCapture'
        | 'onTouchMove'
        | 'onTouchStart'
        | 'onTransition'
        | 'onWheel'
        | 'opacity'
        | 'outline'
        | 'outlineColor'
        | 'outlineOffset'
        | 'outlineStyle'
        | 'outlineWidth'
        | 'overflow'
        | 'overflowBlock'
        | 'overflowInline'
        | 'overflowWrap'
        | 'overflowX'
        | 'overflowY'
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
        | 'passThrough'
        | 'perspective'
        | 'pointerEvents'
        | 'position'
        | 'removeClippedSubviews'
        | 'render'
        | 'renderToHardwareTextureAndroid'
        | 'required'
        | 'resize'
        | 'right'
        | 'role'
        | 'rotate'
        | 'rotateX'
        | 'rotateY'
        | 'rotateZ'
        | 'rotation'
        | 'rowGap'
        | 'scale'
        | 'scaleX'
        | 'scaleY'
        | 'screenReaderFocusable'
        | 'shadowColor'
        | 'shadowOffset'
        | 'shadowOpacity'
        | 'shadowRadius'
        | 'shouldRasterizeIOS'
        | 'size'
        | 'skewX'
        | 'skewY'
        | 'start'
        | 'style'
        | 'tabIndex'
        | 'target'
        | 'testID'
        | 'textEmphasis'
        | 'textWrap'
        | 'theme'
        | 'themeShallow'
        | 'top'
        | 'transform'
        | 'transformMatrix'
        | 'transformOrigin'
        | 'transformStyle'
        | 'transition'
        | 'translateX'
        | 'translateY'
        | 'tvParallaxMagnification'
        | 'tvParallaxShiftDistanceX'
        | 'tvParallaxShiftDistanceY'
        | 'tvParallaxTiltAngle'
        | 'untilMeasured'
        | 'userSelect'
        | 'value'
        | 'verticalAlign'
        | 'visibility'
        | 'width'
        | 'wordWrap'
        | 'x'
        | 'y'
        | 'zIndex'
      > &
        import('@tamagui/core').StackNonStyleProps &
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > &
        import('./types').SwitchSharedProps &
        import('@tamagui/switch-headless').SwitchExtraProps & {
          native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
          nativeProps?: import('react-native').SwitchProps
        } & import('./types').SwitchFrameActiveStyleProps,
      (
        | import('react-native').View
        | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
      ),
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        import('@tamagui/core').StackNonStyleProps &
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > &
        import('./types').SwitchSharedProps &
        import('@tamagui/switch-headless').SwitchExtraProps & {
          native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
          nativeProps?: import('react-native').SwitchProps
        } & import('./types').SwitchFrameActiveStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        active?: boolean | undefined
        frameWidth?: number | undefined
        size?: number | import('@tamagui/core').Size | undefined
      },
      import('@tamagui/core').StaticConfigPublic,
    ]
  } & {
    Frame: React.FunctionComponent<
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        'active' | 'frameWidth' | 'size' | keyof import('@tamagui/core').StackStyleBase
      > &
        import('@tamagui/core').WithThemeValues<
          import('@tamagui/core').StackStyleBase
        > & {
          active?: boolean | undefined
          frameWidth?: number | undefined
          size?: number | import('@tamagui/core').Size | undefined
        } & import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > & {
          ref?: React.Ref<import('@tamagui/core').TamaguiElement> | undefined
        }
    > &
      import('@tamagui/core').StaticComponentObject<
        import('@tamagui/core').TamaDefer,
        import('@tamagui/core').TamaguiElement,
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/core').StackStyleBase,
        {
          active?: boolean | undefined
          frameWidth?: number | undefined
          size?: number | import('@tamagui/core').Size | undefined
        },
        import('@tamagui/core').StaticConfigPublic
      > &
      Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
        __tama: [
          import('@tamagui/core').TamaDefer,
          import('@tamagui/core').TamaguiElement,
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/core').StackStyleBase,
          {
            active?: boolean | undefined
            frameWidth?: number | undefined
            size?: number | import('@tamagui/core').Size | undefined
          },
          import('@tamagui/core').StaticConfigPublic,
        ]
      }
    Thumb: import('@tamagui/core').TamaguiComponent<
      Omit<
        import('@tamagui/core').GetFinalProps<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/core').StackStyleBase,
          {
            active?: boolean | undefined
            frameWidth?: number | undefined
            size?: number | import('@tamagui/core').Size | undefined
          }
        >,
        | 'active'
        | 'activeStyle'
        | 'download'
        | 'elevationAndroid'
        | 'frameWidth'
        | 'onLayout'
        | 'onMoveShouldSetResponder'
        | 'onMoveShouldSetResponderCapture'
        | 'onResponderEnd'
        | 'onResponderGrant'
        | 'onResponderMove'
        | 'onResponderReject'
        | 'onResponderRelease'
        | 'onResponderStart'
        | 'onResponderTerminate'
        | 'onResponderTerminationRequest'
        | 'onScrollShouldSetResponder'
        | 'onScrollShouldSetResponderCapture'
        | 'onSelectionChangeShouldSetResponder'
        | 'onSelectionChangeShouldSetResponderCapture'
        | 'onStartShouldSetResponder'
        | 'onStartShouldSetResponderCapture'
        | 'rel'
        | 'size'
        | keyof import('@tamagui/core').StackNonStyleProps
        | keyof import('@tamagui/core').StackStyleBase
      > &
        Omit<
          import('@tamagui/core').GetFinalProps<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            import('@tamagui/core').StackStyleBase,
            {
              active?: boolean | undefined
              frameWidth?: number | undefined
              size?: number | import('@tamagui/core').Size | undefined
            }
          >,
          | 'activeStyle'
          | 'size'
          | keyof import('@tamagui/core').StackNonStyleProps
          | keyof import('@tamagui/core').StackStyleBase
        > &
        import('@tamagui/core').StackNonStyleProps &
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > &
        import('./types').SwitchSharedProps &
        import('./types').SwitchThumbActiveStyleProps,
      | import('react-native').View
      | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').GetFinalProps<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            import('@tamagui/core').StackStyleBase,
            {
              active?: boolean | undefined
              frameWidth?: number | undefined
              size?: number | import('@tamagui/core').Size | undefined
            }
          >,
          | 'activeStyle'
          | 'size'
          | keyof import('@tamagui/core').StackNonStyleProps
          | keyof import('@tamagui/core').StackStyleBase
        > &
        import('@tamagui/core').StackNonStyleProps &
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > &
        import('./types').SwitchSharedProps &
        import('./types').SwitchThumbActiveStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        active?: boolean | undefined
        frameWidth?: number | undefined
        size?: number | import('@tamagui/core').Size | undefined
      },
      import('@tamagui/core').StaticConfigPublic
    >
  }
export declare const Switch: React.FunctionComponent<
  Omit<
    import('@tamagui/core').GetFinalProps<
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        active?: boolean | undefined
        frameWidth?: number | undefined
        size?: number | import('@tamagui/core').Size | undefined
      }
    >,
    | 'accessibilityActions'
    | 'accessibilityElementsHidden'
    | 'accessibilityHint'
    | 'accessibilityIgnoresInvertColors'
    | 'accessibilityLabel'
    | 'accessibilityLabelledBy'
    | 'accessibilityLanguage'
    | 'accessibilityLargeContentTitle'
    | 'accessibilityLiveRegion'
    | 'accessibilityRespondsToUserInteraction'
    | 'accessibilityRole'
    | 'accessibilityShowsLargeContentViewer'
    | 'accessibilityState'
    | 'accessibilityValue'
    | 'accessibilityViewIsModal'
    | 'accessible'
    | 'activeStyle'
    | 'activeTheme'
    | 'alignContent'
    | 'alignItems'
    | 'alignSelf'
    | 'animateOnly'
    | 'animatePresence'
    | 'animatedBy'
    | 'aria-busy'
    | 'aria-checked'
    | 'aria-disabled'
    | 'aria-expanded'
    | 'aria-hidden'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-live'
    | 'aria-modal'
    | 'aria-selected'
    | 'aria-valuemax'
    | 'aria-valuemin'
    | 'aria-valuenow'
    | 'aria-valuetext'
    | 'asChild'
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
    | 'backgroundRepeat'
    | 'backgroundSize'
    | 'blockSize'
    | 'border'
    | 'borderBlock'
    | 'borderBlockColor'
    | 'borderBlockEndColor'
    | 'borderBlockEndStyle'
    | 'borderBlockEndWidth'
    | 'borderBlockStartColor'
    | 'borderBlockStartStyle'
    | 'borderBlockStartWidth'
    | 'borderBlockStyle'
    | 'borderBlockWidth'
    | 'borderBottomColor'
    | 'borderBottomEndRadius'
    | 'borderBottomLeftRadius'
    | 'borderBottomRightRadius'
    | 'borderBottomStartRadius'
    | 'borderBottomWidth'
    | 'borderColor'
    | 'borderCurve'
    | 'borderEndColor'
    | 'borderEndEndRadius'
    | 'borderEndStartRadius'
    | 'borderEndWidth'
    | 'borderImage'
    | 'borderInline'
    | 'borderInlineColor'
    | 'borderInlineEndColor'
    | 'borderInlineEndStyle'
    | 'borderInlineEndWidth'
    | 'borderInlineStartColor'
    | 'borderInlineStartStyle'
    | 'borderInlineStartWidth'
    | 'borderInlineStyle'
    | 'borderInlineWidth'
    | 'borderLeftColor'
    | 'borderLeftWidth'
    | 'borderRadius'
    | 'borderRightColor'
    | 'borderRightWidth'
    | 'borderStartColor'
    | 'borderStartEndRadius'
    | 'borderStartStartRadius'
    | 'borderStartWidth'
    | 'borderStyle'
    | 'borderTopColor'
    | 'borderTopEndRadius'
    | 'borderTopLeftRadius'
    | 'borderTopRightRadius'
    | 'borderTopStartRadius'
    | 'borderTopWidth'
    | 'borderWidth'
    | 'bottom'
    | 'boxShadow'
    | 'boxSizing'
    | 'caretColor'
    | 'checked'
    | 'children'
    | 'className'
    | 'clipPath'
    | 'collapsable'
    | 'collapsableChildren'
    | 'color'
    | 'columnGap'
    | 'componentName'
    | 'contain'
    | 'container'
    | 'containerName'
    | 'containerType'
    | 'cursor'
    | 'dangerouslySetInnerHTML'
    | 'debug'
    | 'defaultChecked'
    | 'direction'
    | 'disableClassName'
    | 'disableNativeStyle'
    | 'disableOptimization'
    | 'disabled'
    | 'display'
    | 'end'
    | 'experimental_backgroundImage'
    | 'filter'
    | 'flex'
    | 'flexBasis'
    | 'flexDirection'
    | 'flexGrow'
    | 'flexShrink'
    | 'flexWrap'
    | 'float'
    | 'forceStyle'
    | 'gap'
    | 'gridColumn'
    | 'gridColumnEnd'
    | 'gridColumnGap'
    | 'gridColumnStart'
    | 'gridRow'
    | 'gridRowEnd'
    | 'gridRowGap'
    | 'gridRowStart'
    | 'gridTemplateAreas'
    | 'gridTemplateColumns'
    | 'group'
    | 'hasTVPreferredFocus'
    | 'height'
    | 'hitSlop'
    | 'htmlFor'
    | 'id'
    | 'importantForAccessibility'
    | 'inlineSize'
    | 'inset'
    | 'insetBlock'
    | 'insetBlockEnd'
    | 'insetBlockStart'
    | 'insetInline'
    | 'insetInlineEnd'
    | 'insetInlineStart'
    | 'isTVSelectable'
    | 'isolation'
    | 'justifyContent'
    | 'labeledBy'
    | 'left'
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
    | 'marginVertical'
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
    | 'matrix'
    | 'maxBlockSize'
    | 'maxHeight'
    | 'maxInlineSize'
    | 'maxWidth'
    | 'minBlockSize'
    | 'minHeight'
    | 'minInlineSize'
    | 'minWidth'
    | 'mixBlendMode'
    | 'name'
    | 'native'
    | 'nativeID'
    | 'nativeProps'
    | 'needsOffscreenAlphaCompositing'
    | 'objectFit'
    | 'onAccessibilityAction'
    | 'onAccessibilityEscape'
    | 'onAccessibilityTap'
    | 'onBeforeInput'
    | 'onBlur'
    | 'onChange'
    | 'onCheckedChange'
    | 'onClick'
    | 'onContextMenu'
    | 'onCopy'
    | 'onCut'
    | 'onDoubleClick'
    | 'onDrag'
    | 'onDragEnd'
    | 'onDragEnter'
    | 'onDragLeave'
    | 'onDragOver'
    | 'onDragStart'
    | 'onDrop'
    | 'onFocus'
    | 'onInput'
    | 'onKeyDown'
    | 'onKeyUp'
    | 'onLongPress'
    | 'onMagicTap'
    | 'onMouseDown'
    | 'onMouseEnter'
    | 'onMouseLeave'
    | 'onMouseMove'
    | 'onMouseOut'
    | 'onMouseOver'
    | 'onMouseUp'
    | 'onPaste'
    | 'onPointerCancel'
    | 'onPointerCancelCapture'
    | 'onPointerDown'
    | 'onPointerDownCapture'
    | 'onPointerEnter'
    | 'onPointerEnterCapture'
    | 'onPointerLeave'
    | 'onPointerLeaveCapture'
    | 'onPointerMove'
    | 'onPointerMoveCapture'
    | 'onPointerUp'
    | 'onPointerUpCapture'
    | 'onPress'
    | 'onPressIn'
    | 'onPressOut'
    | 'onScroll'
    | 'onTouchCancel'
    | 'onTouchEnd'
    | 'onTouchEndCapture'
    | 'onTouchMove'
    | 'onTouchStart'
    | 'onTransition'
    | 'onWheel'
    | 'opacity'
    | 'outline'
    | 'outlineColor'
    | 'outlineOffset'
    | 'outlineStyle'
    | 'outlineWidth'
    | 'overflow'
    | 'overflowBlock'
    | 'overflowInline'
    | 'overflowWrap'
    | 'overflowX'
    | 'overflowY'
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
    | 'passThrough'
    | 'perspective'
    | 'pointerEvents'
    | 'position'
    | 'removeClippedSubviews'
    | 'render'
    | 'renderToHardwareTextureAndroid'
    | 'required'
    | 'resize'
    | 'right'
    | 'role'
    | 'rotate'
    | 'rotateX'
    | 'rotateY'
    | 'rotateZ'
    | 'rotation'
    | 'rowGap'
    | 'scale'
    | 'scaleX'
    | 'scaleY'
    | 'screenReaderFocusable'
    | 'shadowColor'
    | 'shadowOffset'
    | 'shadowOpacity'
    | 'shadowRadius'
    | 'shouldRasterizeIOS'
    | 'size'
    | 'skewX'
    | 'skewY'
    | 'start'
    | 'style'
    | 'tabIndex'
    | 'target'
    | 'testID'
    | 'textEmphasis'
    | 'textWrap'
    | 'theme'
    | 'themeShallow'
    | 'top'
    | 'transform'
    | 'transformMatrix'
    | 'transformOrigin'
    | 'transformStyle'
    | 'transition'
    | 'translateX'
    | 'translateY'
    | 'tvParallaxMagnification'
    | 'tvParallaxShiftDistanceX'
    | 'tvParallaxShiftDistanceY'
    | 'tvParallaxTiltAngle'
    | 'untilMeasured'
    | 'userSelect'
    | 'value'
    | 'verticalAlign'
    | 'visibility'
    | 'width'
    | 'wordWrap'
    | 'x'
    | 'y'
    | 'zIndex'
  > &
    import('@tamagui/core').StackNonStyleProps &
    import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
    import('@tamagui/core').WithShorthands<
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
    > &
    import('./types').SwitchSharedProps &
    import('@tamagui/switch-headless').SwitchExtraProps & {
      native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
      nativeProps?: import('react-native').SwitchProps
    } & import('./types').SwitchFrameActiveStyleProps & {
      ref?:
        | React.Ref<
            | import('react-native').View
            | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
          >
        | undefined
    }
> &
  import('@tamagui/core').StaticComponentObject<
    Omit<
      import('@tamagui/core').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/core').StackStyleBase,
        {
          active?: boolean | undefined
          frameWidth?: number | undefined
          size?: number | import('@tamagui/core').Size | undefined
        }
      >,
      | 'accessibilityActions'
      | 'accessibilityElementsHidden'
      | 'accessibilityHint'
      | 'accessibilityIgnoresInvertColors'
      | 'accessibilityLabel'
      | 'accessibilityLabelledBy'
      | 'accessibilityLanguage'
      | 'accessibilityLargeContentTitle'
      | 'accessibilityLiveRegion'
      | 'accessibilityRespondsToUserInteraction'
      | 'accessibilityRole'
      | 'accessibilityShowsLargeContentViewer'
      | 'accessibilityState'
      | 'accessibilityValue'
      | 'accessibilityViewIsModal'
      | 'accessible'
      | 'activeStyle'
      | 'activeTheme'
      | 'alignContent'
      | 'alignItems'
      | 'alignSelf'
      | 'animateOnly'
      | 'animatePresence'
      | 'animatedBy'
      | 'aria-busy'
      | 'aria-checked'
      | 'aria-disabled'
      | 'aria-expanded'
      | 'aria-hidden'
      | 'aria-label'
      | 'aria-labelledby'
      | 'aria-live'
      | 'aria-modal'
      | 'aria-selected'
      | 'aria-valuemax'
      | 'aria-valuemin'
      | 'aria-valuenow'
      | 'aria-valuetext'
      | 'asChild'
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
      | 'backgroundRepeat'
      | 'backgroundSize'
      | 'blockSize'
      | 'border'
      | 'borderBlock'
      | 'borderBlockColor'
      | 'borderBlockEndColor'
      | 'borderBlockEndStyle'
      | 'borderBlockEndWidth'
      | 'borderBlockStartColor'
      | 'borderBlockStartStyle'
      | 'borderBlockStartWidth'
      | 'borderBlockStyle'
      | 'borderBlockWidth'
      | 'borderBottomColor'
      | 'borderBottomEndRadius'
      | 'borderBottomLeftRadius'
      | 'borderBottomRightRadius'
      | 'borderBottomStartRadius'
      | 'borderBottomWidth'
      | 'borderColor'
      | 'borderCurve'
      | 'borderEndColor'
      | 'borderEndEndRadius'
      | 'borderEndStartRadius'
      | 'borderEndWidth'
      | 'borderImage'
      | 'borderInline'
      | 'borderInlineColor'
      | 'borderInlineEndColor'
      | 'borderInlineEndStyle'
      | 'borderInlineEndWidth'
      | 'borderInlineStartColor'
      | 'borderInlineStartStyle'
      | 'borderInlineStartWidth'
      | 'borderInlineStyle'
      | 'borderInlineWidth'
      | 'borderLeftColor'
      | 'borderLeftWidth'
      | 'borderRadius'
      | 'borderRightColor'
      | 'borderRightWidth'
      | 'borderStartColor'
      | 'borderStartEndRadius'
      | 'borderStartStartRadius'
      | 'borderStartWidth'
      | 'borderStyle'
      | 'borderTopColor'
      | 'borderTopEndRadius'
      | 'borderTopLeftRadius'
      | 'borderTopRightRadius'
      | 'borderTopStartRadius'
      | 'borderTopWidth'
      | 'borderWidth'
      | 'bottom'
      | 'boxShadow'
      | 'boxSizing'
      | 'caretColor'
      | 'checked'
      | 'children'
      | 'className'
      | 'clipPath'
      | 'collapsable'
      | 'collapsableChildren'
      | 'color'
      | 'columnGap'
      | 'componentName'
      | 'contain'
      | 'container'
      | 'containerName'
      | 'containerType'
      | 'cursor'
      | 'dangerouslySetInnerHTML'
      | 'debug'
      | 'defaultChecked'
      | 'direction'
      | 'disableClassName'
      | 'disableNativeStyle'
      | 'disableOptimization'
      | 'disabled'
      | 'display'
      | 'end'
      | 'experimental_backgroundImage'
      | 'filter'
      | 'flex'
      | 'flexBasis'
      | 'flexDirection'
      | 'flexGrow'
      | 'flexShrink'
      | 'flexWrap'
      | 'float'
      | 'forceStyle'
      | 'gap'
      | 'gridColumn'
      | 'gridColumnEnd'
      | 'gridColumnGap'
      | 'gridColumnStart'
      | 'gridRow'
      | 'gridRowEnd'
      | 'gridRowGap'
      | 'gridRowStart'
      | 'gridTemplateAreas'
      | 'gridTemplateColumns'
      | 'group'
      | 'hasTVPreferredFocus'
      | 'height'
      | 'hitSlop'
      | 'htmlFor'
      | 'id'
      | 'importantForAccessibility'
      | 'inlineSize'
      | 'inset'
      | 'insetBlock'
      | 'insetBlockEnd'
      | 'insetBlockStart'
      | 'insetInline'
      | 'insetInlineEnd'
      | 'insetInlineStart'
      | 'isTVSelectable'
      | 'isolation'
      | 'justifyContent'
      | 'labeledBy'
      | 'left'
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
      | 'marginVertical'
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
      | 'matrix'
      | 'maxBlockSize'
      | 'maxHeight'
      | 'maxInlineSize'
      | 'maxWidth'
      | 'minBlockSize'
      | 'minHeight'
      | 'minInlineSize'
      | 'minWidth'
      | 'mixBlendMode'
      | 'name'
      | 'native'
      | 'nativeID'
      | 'nativeProps'
      | 'needsOffscreenAlphaCompositing'
      | 'objectFit'
      | 'onAccessibilityAction'
      | 'onAccessibilityEscape'
      | 'onAccessibilityTap'
      | 'onBeforeInput'
      | 'onBlur'
      | 'onChange'
      | 'onCheckedChange'
      | 'onClick'
      | 'onContextMenu'
      | 'onCopy'
      | 'onCut'
      | 'onDoubleClick'
      | 'onDrag'
      | 'onDragEnd'
      | 'onDragEnter'
      | 'onDragLeave'
      | 'onDragOver'
      | 'onDragStart'
      | 'onDrop'
      | 'onFocus'
      | 'onInput'
      | 'onKeyDown'
      | 'onKeyUp'
      | 'onLongPress'
      | 'onMagicTap'
      | 'onMouseDown'
      | 'onMouseEnter'
      | 'onMouseLeave'
      | 'onMouseMove'
      | 'onMouseOut'
      | 'onMouseOver'
      | 'onMouseUp'
      | 'onPaste'
      | 'onPointerCancel'
      | 'onPointerCancelCapture'
      | 'onPointerDown'
      | 'onPointerDownCapture'
      | 'onPointerEnter'
      | 'onPointerEnterCapture'
      | 'onPointerLeave'
      | 'onPointerLeaveCapture'
      | 'onPointerMove'
      | 'onPointerMoveCapture'
      | 'onPointerUp'
      | 'onPointerUpCapture'
      | 'onPress'
      | 'onPressIn'
      | 'onPressOut'
      | 'onScroll'
      | 'onTouchCancel'
      | 'onTouchEnd'
      | 'onTouchEndCapture'
      | 'onTouchMove'
      | 'onTouchStart'
      | 'onTransition'
      | 'onWheel'
      | 'opacity'
      | 'outline'
      | 'outlineColor'
      | 'outlineOffset'
      | 'outlineStyle'
      | 'outlineWidth'
      | 'overflow'
      | 'overflowBlock'
      | 'overflowInline'
      | 'overflowWrap'
      | 'overflowX'
      | 'overflowY'
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
      | 'passThrough'
      | 'perspective'
      | 'pointerEvents'
      | 'position'
      | 'removeClippedSubviews'
      | 'render'
      | 'renderToHardwareTextureAndroid'
      | 'required'
      | 'resize'
      | 'right'
      | 'role'
      | 'rotate'
      | 'rotateX'
      | 'rotateY'
      | 'rotateZ'
      | 'rotation'
      | 'rowGap'
      | 'scale'
      | 'scaleX'
      | 'scaleY'
      | 'screenReaderFocusable'
      | 'shadowColor'
      | 'shadowOffset'
      | 'shadowOpacity'
      | 'shadowRadius'
      | 'shouldRasterizeIOS'
      | 'size'
      | 'skewX'
      | 'skewY'
      | 'start'
      | 'style'
      | 'tabIndex'
      | 'target'
      | 'testID'
      | 'textEmphasis'
      | 'textWrap'
      | 'theme'
      | 'themeShallow'
      | 'top'
      | 'transform'
      | 'transformMatrix'
      | 'transformOrigin'
      | 'transformStyle'
      | 'transition'
      | 'translateX'
      | 'translateY'
      | 'tvParallaxMagnification'
      | 'tvParallaxShiftDistanceX'
      | 'tvParallaxShiftDistanceY'
      | 'tvParallaxTiltAngle'
      | 'untilMeasured'
      | 'userSelect'
      | 'value'
      | 'verticalAlign'
      | 'visibility'
      | 'width'
      | 'wordWrap'
      | 'x'
      | 'y'
      | 'zIndex'
    > &
      import('@tamagui/core').StackNonStyleProps &
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
      import('@tamagui/core').WithShorthands<
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
      > &
      import('./types').SwitchSharedProps &
      import('@tamagui/switch-headless').SwitchExtraProps & {
        native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
        nativeProps?: import('react-native').SwitchProps
      } & import('./types').SwitchFrameActiveStyleProps,
    | import('react-native').View
    | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      import('@tamagui/core').StackNonStyleProps &
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
      import('@tamagui/core').WithShorthands<
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
      > &
      import('./types').SwitchSharedProps &
      import('@tamagui/switch-headless').SwitchExtraProps & {
        native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
        nativeProps?: import('react-native').SwitchProps
      } & import('./types').SwitchFrameActiveStyleProps,
    import('@tamagui/core').StackStyleBase,
    {
      active?: boolean | undefined
      frameWidth?: number | undefined
      size?: number | import('@tamagui/core').Size | undefined
    },
    import('@tamagui/core').StaticConfigPublic
  > &
  Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      Omit<
        import('@tamagui/core').GetFinalProps<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/core').StackStyleBase,
          {
            active?: boolean | undefined
            frameWidth?: number | undefined
            size?: number | import('@tamagui/core').Size | undefined
          }
        >,
        | 'accessibilityActions'
        | 'accessibilityElementsHidden'
        | 'accessibilityHint'
        | 'accessibilityIgnoresInvertColors'
        | 'accessibilityLabel'
        | 'accessibilityLabelledBy'
        | 'accessibilityLanguage'
        | 'accessibilityLargeContentTitle'
        | 'accessibilityLiveRegion'
        | 'accessibilityRespondsToUserInteraction'
        | 'accessibilityRole'
        | 'accessibilityShowsLargeContentViewer'
        | 'accessibilityState'
        | 'accessibilityValue'
        | 'accessibilityViewIsModal'
        | 'accessible'
        | 'activeStyle'
        | 'activeTheme'
        | 'alignContent'
        | 'alignItems'
        | 'alignSelf'
        | 'animateOnly'
        | 'animatePresence'
        | 'animatedBy'
        | 'aria-busy'
        | 'aria-checked'
        | 'aria-disabled'
        | 'aria-expanded'
        | 'aria-hidden'
        | 'aria-label'
        | 'aria-labelledby'
        | 'aria-live'
        | 'aria-modal'
        | 'aria-selected'
        | 'aria-valuemax'
        | 'aria-valuemin'
        | 'aria-valuenow'
        | 'aria-valuetext'
        | 'asChild'
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
        | 'backgroundRepeat'
        | 'backgroundSize'
        | 'blockSize'
        | 'border'
        | 'borderBlock'
        | 'borderBlockColor'
        | 'borderBlockEndColor'
        | 'borderBlockEndStyle'
        | 'borderBlockEndWidth'
        | 'borderBlockStartColor'
        | 'borderBlockStartStyle'
        | 'borderBlockStartWidth'
        | 'borderBlockStyle'
        | 'borderBlockWidth'
        | 'borderBottomColor'
        | 'borderBottomEndRadius'
        | 'borderBottomLeftRadius'
        | 'borderBottomRightRadius'
        | 'borderBottomStartRadius'
        | 'borderBottomWidth'
        | 'borderColor'
        | 'borderCurve'
        | 'borderEndColor'
        | 'borderEndEndRadius'
        | 'borderEndStartRadius'
        | 'borderEndWidth'
        | 'borderImage'
        | 'borderInline'
        | 'borderInlineColor'
        | 'borderInlineEndColor'
        | 'borderInlineEndStyle'
        | 'borderInlineEndWidth'
        | 'borderInlineStartColor'
        | 'borderInlineStartStyle'
        | 'borderInlineStartWidth'
        | 'borderInlineStyle'
        | 'borderInlineWidth'
        | 'borderLeftColor'
        | 'borderLeftWidth'
        | 'borderRadius'
        | 'borderRightColor'
        | 'borderRightWidth'
        | 'borderStartColor'
        | 'borderStartEndRadius'
        | 'borderStartStartRadius'
        | 'borderStartWidth'
        | 'borderStyle'
        | 'borderTopColor'
        | 'borderTopEndRadius'
        | 'borderTopLeftRadius'
        | 'borderTopRightRadius'
        | 'borderTopStartRadius'
        | 'borderTopWidth'
        | 'borderWidth'
        | 'bottom'
        | 'boxShadow'
        | 'boxSizing'
        | 'caretColor'
        | 'checked'
        | 'children'
        | 'className'
        | 'clipPath'
        | 'collapsable'
        | 'collapsableChildren'
        | 'color'
        | 'columnGap'
        | 'componentName'
        | 'contain'
        | 'container'
        | 'containerName'
        | 'containerType'
        | 'cursor'
        | 'dangerouslySetInnerHTML'
        | 'debug'
        | 'defaultChecked'
        | 'direction'
        | 'disableClassName'
        | 'disableNativeStyle'
        | 'disableOptimization'
        | 'disabled'
        | 'display'
        | 'end'
        | 'experimental_backgroundImage'
        | 'filter'
        | 'flex'
        | 'flexBasis'
        | 'flexDirection'
        | 'flexGrow'
        | 'flexShrink'
        | 'flexWrap'
        | 'float'
        | 'forceStyle'
        | 'gap'
        | 'gridColumn'
        | 'gridColumnEnd'
        | 'gridColumnGap'
        | 'gridColumnStart'
        | 'gridRow'
        | 'gridRowEnd'
        | 'gridRowGap'
        | 'gridRowStart'
        | 'gridTemplateAreas'
        | 'gridTemplateColumns'
        | 'group'
        | 'hasTVPreferredFocus'
        | 'height'
        | 'hitSlop'
        | 'htmlFor'
        | 'id'
        | 'importantForAccessibility'
        | 'inlineSize'
        | 'inset'
        | 'insetBlock'
        | 'insetBlockEnd'
        | 'insetBlockStart'
        | 'insetInline'
        | 'insetInlineEnd'
        | 'insetInlineStart'
        | 'isTVSelectable'
        | 'isolation'
        | 'justifyContent'
        | 'labeledBy'
        | 'left'
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
        | 'marginVertical'
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
        | 'matrix'
        | 'maxBlockSize'
        | 'maxHeight'
        | 'maxInlineSize'
        | 'maxWidth'
        | 'minBlockSize'
        | 'minHeight'
        | 'minInlineSize'
        | 'minWidth'
        | 'mixBlendMode'
        | 'name'
        | 'native'
        | 'nativeID'
        | 'nativeProps'
        | 'needsOffscreenAlphaCompositing'
        | 'objectFit'
        | 'onAccessibilityAction'
        | 'onAccessibilityEscape'
        | 'onAccessibilityTap'
        | 'onBeforeInput'
        | 'onBlur'
        | 'onChange'
        | 'onCheckedChange'
        | 'onClick'
        | 'onContextMenu'
        | 'onCopy'
        | 'onCut'
        | 'onDoubleClick'
        | 'onDrag'
        | 'onDragEnd'
        | 'onDragEnter'
        | 'onDragLeave'
        | 'onDragOver'
        | 'onDragStart'
        | 'onDrop'
        | 'onFocus'
        | 'onInput'
        | 'onKeyDown'
        | 'onKeyUp'
        | 'onLongPress'
        | 'onMagicTap'
        | 'onMouseDown'
        | 'onMouseEnter'
        | 'onMouseLeave'
        | 'onMouseMove'
        | 'onMouseOut'
        | 'onMouseOver'
        | 'onMouseUp'
        | 'onPaste'
        | 'onPointerCancel'
        | 'onPointerCancelCapture'
        | 'onPointerDown'
        | 'onPointerDownCapture'
        | 'onPointerEnter'
        | 'onPointerEnterCapture'
        | 'onPointerLeave'
        | 'onPointerLeaveCapture'
        | 'onPointerMove'
        | 'onPointerMoveCapture'
        | 'onPointerUp'
        | 'onPointerUpCapture'
        | 'onPress'
        | 'onPressIn'
        | 'onPressOut'
        | 'onScroll'
        | 'onTouchCancel'
        | 'onTouchEnd'
        | 'onTouchEndCapture'
        | 'onTouchMove'
        | 'onTouchStart'
        | 'onTransition'
        | 'onWheel'
        | 'opacity'
        | 'outline'
        | 'outlineColor'
        | 'outlineOffset'
        | 'outlineStyle'
        | 'outlineWidth'
        | 'overflow'
        | 'overflowBlock'
        | 'overflowInline'
        | 'overflowWrap'
        | 'overflowX'
        | 'overflowY'
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
        | 'passThrough'
        | 'perspective'
        | 'pointerEvents'
        | 'position'
        | 'removeClippedSubviews'
        | 'render'
        | 'renderToHardwareTextureAndroid'
        | 'required'
        | 'resize'
        | 'right'
        | 'role'
        | 'rotate'
        | 'rotateX'
        | 'rotateY'
        | 'rotateZ'
        | 'rotation'
        | 'rowGap'
        | 'scale'
        | 'scaleX'
        | 'scaleY'
        | 'screenReaderFocusable'
        | 'shadowColor'
        | 'shadowOffset'
        | 'shadowOpacity'
        | 'shadowRadius'
        | 'shouldRasterizeIOS'
        | 'size'
        | 'skewX'
        | 'skewY'
        | 'start'
        | 'style'
        | 'tabIndex'
        | 'target'
        | 'testID'
        | 'textEmphasis'
        | 'textWrap'
        | 'theme'
        | 'themeShallow'
        | 'top'
        | 'transform'
        | 'transformMatrix'
        | 'transformOrigin'
        | 'transformStyle'
        | 'transition'
        | 'translateX'
        | 'translateY'
        | 'tvParallaxMagnification'
        | 'tvParallaxShiftDistanceX'
        | 'tvParallaxShiftDistanceY'
        | 'tvParallaxTiltAngle'
        | 'untilMeasured'
        | 'userSelect'
        | 'value'
        | 'verticalAlign'
        | 'visibility'
        | 'width'
        | 'wordWrap'
        | 'x'
        | 'y'
        | 'zIndex'
      > &
        import('@tamagui/core').StackNonStyleProps &
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > &
        import('./types').SwitchSharedProps &
        import('@tamagui/switch-headless').SwitchExtraProps & {
          native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
          nativeProps?: import('react-native').SwitchProps
        } & import('./types').SwitchFrameActiveStyleProps,
      (
        | import('react-native').View
        | (HTMLElement & import('@tamagui/core').TamaguiElementMethods)
      ),
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        import('@tamagui/core').StackNonStyleProps &
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > &
        import('./types').SwitchSharedProps &
        import('@tamagui/switch-headless').SwitchExtraProps & {
          native?: import('@tamagui/core').NativeValue<'mobile' | 'ios' | 'android'>
          nativeProps?: import('react-native').SwitchProps
        } & import('./types').SwitchFrameActiveStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        active?: boolean | undefined
        frameWidth?: number | undefined
        size?: number | import('@tamagui/core').Size | undefined
      },
      import('@tamagui/core').StaticConfigPublic,
    ]
  } & {
    Frame: React.FunctionComponent<
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        'active' | 'frameWidth' | 'size' | keyof import('@tamagui/core').StackStyleBase
      > &
        import('@tamagui/core').WithThemeValues<
          import('@tamagui/core').StackStyleBase
        > & {
          active?: boolean | undefined
          frameWidth?: number | undefined
          size?: number | import('@tamagui/core').Size | undefined
        } & import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > & {
          ref?: React.Ref<import('@tamagui/core').TamaguiElement> | undefined
        }
    > &
      import('@tamagui/core').StaticComponentObject<
        import('@tamagui/core').TamaDefer,
        import('@tamagui/core').TamaguiElement,
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/core').StackStyleBase,
        {
          active?: boolean | undefined
          frameWidth?: number | undefined
          size?: number | import('@tamagui/core').Size | undefined
        },
        import('@tamagui/core').StaticConfigPublic
      > &
      Omit<import('@tamagui/core').StaticConfigPublic, 'staticConfig'> & {
        __tama: [
          import('@tamagui/core').TamaDefer,
          import('@tamagui/core').TamaguiElement,
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/core').StackStyleBase,
          {
            active?: boolean | undefined
            frameWidth?: number | undefined
            size?: number | import('@tamagui/core').Size | undefined
          },
          import('@tamagui/core').StaticConfigPublic,
        ]
      }
    Thumb: import('@tamagui/core').TamaguiComponent<
      Omit<
        import('@tamagui/core').GetFinalProps<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/core').StackStyleBase,
          {
            active?: boolean | undefined
            frameWidth?: number | undefined
            size?: number | import('@tamagui/core').Size | undefined
          }
        >,
        | 'active'
        | 'activeStyle'
        | 'download'
        | 'elevationAndroid'
        | 'frameWidth'
        | 'onLayout'
        | 'onMoveShouldSetResponder'
        | 'onMoveShouldSetResponderCapture'
        | 'onResponderEnd'
        | 'onResponderGrant'
        | 'onResponderMove'
        | 'onResponderReject'
        | 'onResponderRelease'
        | 'onResponderStart'
        | 'onResponderTerminate'
        | 'onResponderTerminationRequest'
        | 'onScrollShouldSetResponder'
        | 'onScrollShouldSetResponderCapture'
        | 'onSelectionChangeShouldSetResponder'
        | 'onSelectionChangeShouldSetResponderCapture'
        | 'onStartShouldSetResponder'
        | 'onStartShouldSetResponderCapture'
        | 'rel'
        | 'size'
        | keyof import('@tamagui/core').StackNonStyleProps
        | keyof import('@tamagui/core').StackStyleBase
      > &
        Omit<
          import('@tamagui/core').GetFinalProps<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            import('@tamagui/core').StackStyleBase,
            {
              active?: boolean | undefined
              frameWidth?: number | undefined
              size?: number | import('@tamagui/core').Size | undefined
            }
          >,
          | 'activeStyle'
          | 'size'
          | keyof import('@tamagui/core').StackNonStyleProps
          | keyof import('@tamagui/core').StackStyleBase
        > &
        import('@tamagui/core').StackNonStyleProps &
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > &
        import('./types').SwitchSharedProps &
        import('./types').SwitchThumbActiveStyleProps,
      | import('react-native').View
      | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').GetFinalProps<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            import('@tamagui/core').StackStyleBase,
            {
              active?: boolean | undefined
              frameWidth?: number | undefined
              size?: number | import('@tamagui/core').Size | undefined
            }
          >,
          | 'activeStyle'
          | 'size'
          | keyof import('@tamagui/core').StackNonStyleProps
          | keyof import('@tamagui/core').StackStyleBase
        > &
        import('@tamagui/core').StackNonStyleProps &
        import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
        import('@tamagui/core').WithShorthands<
          import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
        > &
        import('./types').SwitchSharedProps &
        import('./types').SwitchThumbActiveStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        active?: boolean | undefined
        frameWidth?: number | undefined
        size?: number | import('@tamagui/core').Size | undefined
      },
      import('@tamagui/core').StaticConfigPublic
    >
  }
export declare const SwitchThumb: import('@tamagui/core').TamaguiComponent<
  Omit<
    import('@tamagui/core').GetFinalProps<
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        active?: boolean | undefined
        frameWidth?: number | undefined
        size?: number | import('@tamagui/core').Size | undefined
      }
    >,
    | 'active'
    | 'activeStyle'
    | 'download'
    | 'elevationAndroid'
    | 'frameWidth'
    | 'onLayout'
    | 'onMoveShouldSetResponder'
    | 'onMoveShouldSetResponderCapture'
    | 'onResponderEnd'
    | 'onResponderGrant'
    | 'onResponderMove'
    | 'onResponderReject'
    | 'onResponderRelease'
    | 'onResponderStart'
    | 'onResponderTerminate'
    | 'onResponderTerminationRequest'
    | 'onScrollShouldSetResponder'
    | 'onScrollShouldSetResponderCapture'
    | 'onSelectionChangeShouldSetResponder'
    | 'onSelectionChangeShouldSetResponderCapture'
    | 'onStartShouldSetResponder'
    | 'onStartShouldSetResponderCapture'
    | 'rel'
    | 'size'
    | keyof import('@tamagui/core').StackNonStyleProps
    | keyof import('@tamagui/core').StackStyleBase
  > &
    Omit<
      import('@tamagui/core').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/core').StackStyleBase,
        {
          active?: boolean | undefined
          frameWidth?: number | undefined
          size?: number | import('@tamagui/core').Size | undefined
        }
      >,
      | 'activeStyle'
      | 'size'
      | keyof import('@tamagui/core').StackNonStyleProps
      | keyof import('@tamagui/core').StackStyleBase
    > &
    import('@tamagui/core').StackNonStyleProps &
    import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
    import('@tamagui/core').WithShorthands<
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
    > &
    import('./types').SwitchSharedProps &
    import('./types').SwitchThumbActiveStyleProps,
  | import('react-native').View
  | (HTMLElement & import('@tamagui/core').TamaguiElementMethods),
  import('@tamagui/core').RNTamaguiViewNonStyleProps &
    Omit<
      import('@tamagui/core').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/core').StackStyleBase,
        {
          active?: boolean | undefined
          frameWidth?: number | undefined
          size?: number | import('@tamagui/core').Size | undefined
        }
      >,
      | 'activeStyle'
      | 'size'
      | keyof import('@tamagui/core').StackNonStyleProps
      | keyof import('@tamagui/core').StackStyleBase
    > &
    import('@tamagui/core').StackNonStyleProps &
    import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase> &
    import('@tamagui/core').WithShorthands<
      import('@tamagui/core').WithThemeValues<import('@tamagui/core').StackStyleBase>
    > &
    import('./types').SwitchSharedProps &
    import('./types').SwitchThumbActiveStyleProps,
  import('@tamagui/core').StackStyleBase,
  {
    active?: boolean | undefined
    frameWidth?: number | undefined
    size?: number | import('@tamagui/core').Size | undefined
  },
  import('@tamagui/core').StaticConfigPublic
>
//# sourceMappingURL=Switch.d.ts.map
