/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import type { ColorValue, DimensionValue } from './types';
type NumberOrString = number | string;
/**
 * Animations and transitions
 */
type AnimationDirection = 'alternate' | 'alternate-reverse' | 'normal' | 'reverse';
type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';
type AnimationIterationCount = number | 'infinite';
type AnimationKeyframes = string | Object;
type AnimationPlayState = 'paused' | 'running';
export type AnimationStyles = {
    animationDelay?: string | Array<string> | null;
    animationDirection?: AnimationDirection | Array<AnimationDirection> | null;
    animationDuration?: string | Array<string> | null;
    animationFillMode?: AnimationFillMode | Array<AnimationFillMode> | null;
    animationIterationCount?: AnimationIterationCount | Array<AnimationIterationCount> | null;
    animationKeyframes?: AnimationKeyframes | Array<AnimationKeyframes> | null;
    animationPlayState?: AnimationPlayState | Array<AnimationPlayState> | null;
    animationTimingFunction?: string | Array<string> | null;
    transitionDelay?: string | Array<string> | null;
    transitionDuration?: string | Array<string> | null;
    transitionProperty?: string | Array<string> | null;
    transitionTimingFunction?: string | Array<string> | null;
};
/**
 * Border
 */
type BorderRadiusValue = number | string;
type BorderStyleValue = 'solid' | 'dotted' | 'dashed';
export type BorderStyles = {
    borderColor?: ColorValue | null;
    borderBottomColor?: ColorValue | null;
    borderEndColor?: ColorValue | null;
    borderLeftColor?: ColorValue | null;
    borderRightColor?: ColorValue | null;
    borderStartColor?: ColorValue | null;
    borderTopColor?: ColorValue | null;
    borderRadius?: BorderRadiusValue | null;
    borderBottomEndRadius?: BorderRadiusValue | null;
    borderBottomLeftRadius?: BorderRadiusValue | null;
    borderBottomRightRadius?: BorderRadiusValue | null;
    borderBottomStartRadius?: BorderRadiusValue | null;
    borderTopEndRadius?: BorderRadiusValue | null;
    borderTopLeftRadius?: BorderRadiusValue | null;
    borderTopRightRadius?: BorderRadiusValue | null;
    borderTopStartRadius?: BorderRadiusValue | null;
    borderStyle?: BorderStyleValue | null;
    borderBottomStyle?: BorderStyleValue | null;
    borderEndStyle?: BorderStyleValue | null;
    borderLeftStyle?: BorderStyleValue | null;
    borderRightStyle?: BorderStyleValue | null;
    borderStartStyle?: BorderStyleValue | null;
    borderTopStyle?: BorderStyleValue | null;
};
/**
 * Interactions
 */
type CursorValue = 'alias' | 'all-scroll' | 'auto' | 'cell' | 'context-menu' | 'copy' | 'crosshair' | 'default' | 'grab' | 'grabbing' | 'help' | 'pointer' | 'progress' | 'wait' | 'text' | 'vertical-text' | 'move' | 'none' | 'no-drop' | 'not-allowed' | 'zoom-in' | 'zoom-out' | 'col-resize' | 'e-resize' | 'ew-resize' | 'n-resize' | 'ne-resize' | 'ns-resize' | 'nw-resize' | 'row-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'nesw-resize' | 'nwse-resize';
type TouchActionValue = 'auto' | 'inherit' | 'manipulation' | 'none' | 'pan-down' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-x' | 'pan-y' | 'pinch-zoom';
type UserSelect = 'all' | 'auto' | 'contain' | 'none' | 'text';
export type InteractionStyles = {
    cursor?: CursorValue | null;
    touchAction?: TouchActionValue | null;
    userSelect?: UserSelect | null;
    willChange?: string | null;
};
/**
 * Layout
 */
type OverflowValue = 'auto' | 'hidden' | 'scroll' | 'visible';
type VisiblilityValue = 'hidden' | 'visible';
export type LayoutStyles = {
    alignContent?: 'center' | 'flex-end' | 'flex-start' | 'space-around' | 'space-between' | 'stretch';
    alignItems?: 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch' | null;
    alignSelf?: 'auto' | 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch' | null;
    aspectRatio?: number | null;
    backfaceVisibility?: VisiblilityValue | null;
    borderWidth?: DimensionValue | null;
    borderBottomWidth?: DimensionValue | null;
    borderEndWidth?: DimensionValue | null;
    borderLeftWidth?: DimensionValue | null;
    borderRightWidth?: DimensionValue | null;
    borderStartWidth?: DimensionValue | null;
    borderTopWidth?: DimensionValue | null;
    bottom?: DimensionValue | null;
    boxSizing?: 'border-box' | 'content-box' | 'padding-box' | null;
    direction?: 'inherit' | 'ltr' | 'rtl' | null;
    display?: string | null;
    end?: DimensionValue | null;
    flex?: number | null;
    flexBasis?: DimensionValue | null;
    flexDirection?: 'column' | 'column-reverse' | 'row' | 'row-reverse' | null;
    flexGrow?: number | null;
    flexShrink?: number | null;
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | null;
    height?: DimensionValue | null;
    justifyContent?: 'center' | 'flex-end' | 'flex-start' | 'space-around' | 'space-between' | 'space-evenly' | null;
    left?: DimensionValue | null;
    margin?: DimensionValue | null;
    marginBottom?: DimensionValue | null;
    marginHorizontal?: DimensionValue | null;
    marginEnd?: DimensionValue | null;
    marginLeft?: DimensionValue | null;
    marginRight?: DimensionValue | null;
    marginStart?: DimensionValue | null;
    marginTop?: DimensionValue | null;
    marginVertical?: DimensionValue | null;
    maxHeight?: DimensionValue | null;
    maxWidth?: DimensionValue | null;
    minHeight?: DimensionValue | null;
    minWidth?: DimensionValue | null;
    order?: number | null;
    overflow?: OverflowValue | null;
    overflowX?: OverflowValue | null;
    overflowY?: OverflowValue | null;
    padding?: DimensionValue | null;
    paddingBottom?: DimensionValue | null;
    paddingHorizontal?: DimensionValue | null;
    paddingEnd?: DimensionValue | null;
    paddingLeft?: DimensionValue | null;
    paddingRight?: DimensionValue | null;
    paddingStart?: DimensionValue | null;
    paddingTop?: DimensionValue | null;
    paddingVertical?: DimensionValue | null;
    position?: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky' | null;
    right?: DimensionValue | null;
    start?: DimensionValue | null;
    top?: DimensionValue | null;
    visibility?: VisiblilityValue | null;
    width?: DimensionValue | null;
    zIndex?: number | null;
    /**
     * @platform web
     */
    gridAutoColumns?: string | null;
    gridAutoFlow?: string | null;
    gridAutoRows?: string | null;
    gridColumnEnd?: string | null;
    gridColumnGap?: string | null;
    gridColumnStart?: string | null;
    gridRowEnd?: string | null;
    gridRowGap?: string | null;
    gridRowStart?: string | null;
    gridTemplateColumns?: string | null;
    gridTemplateRows?: string | null;
    gridTemplateAreas?: string | null;
};
/**
 * Shadows
 */
export type ShadowStyles = {
    shadowColor?: ColorValue | null;
    shadowOffset?: {
        width?: DimensionValue;
        height?: DimensionValue;
    };
    shadowOpacity?: number | null;
    shadowRadius?: DimensionValue | null;
};
/**
 * Transforms
 */
export type TransformStyles = {
    perspective?: NumberOrString | null;
    perspectiveOrigin?: string | null;
    transform?: Array<{
        readonly perspective: NumberOrString;
    } | {
        readonly rotate: string;
    } | {
        readonly rotateX: string;
    } | {
        readonly rotateY: string;
    } | {
        readonly rotateZ: string;
    } | {
        readonly scale: number;
    } | {
        readonly scaleX: number;
    } | {
        readonly scaleY: number;
    } | {
        readonly scaleZ: number;
    } | {
        readonly scale3d: string;
    } | {
        readonly skewX: string;
    } | {
        readonly skewY: string;
    } | {
        readonly translateX: NumberOrString;
    } | {
        readonly translateY: NumberOrString;
    } | {
        readonly translateZ: NumberOrString;
    } | {
        readonly translate3d: string;
    }>;
    transformOrigin?: string | null;
    transformStyle?: 'flat' | 'preserve-3d' | null;
};
export {};
//# sourceMappingURL=styleTypes.d.ts.map