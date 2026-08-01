import type { FrontendStaticConfig } from '@tamagui/core/internal-runtime'
import type {
  AriaAttributes,
  CSSProperties,
  FunctionComponent,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref as ReactRef,
} from 'react'
import type {
  PressableProps,
  StyleProp,
  Text as ReactNativeText,
  TextProps as ReactNativeTextProps,
  TextStyle,
  View as ReactNativeView,
  ViewProps as ReactNativeViewProps,
  ViewStyle,
} from 'react-native'

type WebEventProps = {
  onMouseEnter?: HTMLAttributes<HTMLDivElement>['onMouseEnter']
  onMouseLeave?: HTMLAttributes<HTMLDivElement>['onMouseLeave']
  onMouseDown?: HTMLAttributes<HTMLDivElement>['onMouseDown']
  onMouseUp?: HTMLAttributes<HTMLDivElement>['onMouseUp']
  onMouseMove?: HTMLAttributes<HTMLDivElement>['onMouseMove']
  onMouseOver?: HTMLAttributes<HTMLDivElement>['onMouseOver']
  onMouseOut?: HTMLAttributes<HTMLDivElement>['onMouseOut']
  onFocus?: HTMLAttributes<HTMLDivElement>['onFocus']
  onBlur?: HTMLAttributes<HTMLDivElement>['onBlur']
  onClick?: HTMLAttributes<HTMLDivElement>['onClick']
  onDoubleClick?: HTMLAttributes<HTMLDivElement>['onDoubleClick']
  onContextMenu?: HTMLAttributes<HTMLDivElement>['onContextMenu']
  onWheel?: HTMLAttributes<HTMLDivElement>['onWheel']
  onKeyDown?: HTMLAttributes<HTMLDivElement>['onKeyDown']
  onKeyUp?: HTMLAttributes<HTMLDivElement>['onKeyUp']
  onChange?: HTMLAttributes<HTMLDivElement>['onChange']
  onInput?: HTMLAttributes<HTMLDivElement>['onInput']
  onBeforeInput?: HTMLAttributes<HTMLDivElement>['onBeforeInput']
  onScroll?: HTMLAttributes<HTMLDivElement>['onScroll']
  onCopy?: HTMLAttributes<HTMLDivElement>['onCopy']
  onCut?: HTMLAttributes<HTMLDivElement>['onCut']
  onPaste?: HTMLAttributes<HTMLDivElement>['onPaste']
  onDrag?: HTMLAttributes<HTMLDivElement>['onDrag']
  onDragStart?: HTMLAttributes<HTMLDivElement>['onDragStart']
  onDragEnd?: HTMLAttributes<HTMLDivElement>['onDragEnd']
  onDragEnter?: HTMLAttributes<HTMLDivElement>['onDragEnter']
  onDragLeave?: HTMLAttributes<HTMLDivElement>['onDragLeave']
  onDragOver?: HTMLAttributes<HTMLDivElement>['onDragOver']
  onDrop?: HTMLAttributes<HTMLDivElement>['onDrop']
  onPointerDown?: HTMLAttributes<HTMLDivElement>['onPointerDown']
  onPointerMove?: HTMLAttributes<HTMLDivElement>['onPointerMove']
  onPointerUp?: HTMLAttributes<HTMLDivElement>['onPointerUp']
  onPointerCancel?: HTMLAttributes<HTMLDivElement>['onPointerCancel']
}

type TailwindComponentState = {
  unmounted: boolean | 'should-enter'
  disabled?: boolean
  hover?: boolean
  press?: boolean
  pressIn?: boolean
  focus?: boolean
  focusVisible?: boolean
  focusWithin?: boolean
}

type TailwindCommonProps = AriaAttributes &
  WebEventProps & {
    target?: string
    htmlFor?: string
    asChild?: boolean | 'except-style' | 'except-style-web' | 'web'
    dangerouslySetInnerHTML?: { __html: string }
    children?: ReactNode
    debug?: boolean | 'break' | 'verbose' | 'visualize' | 'profile'
    disabled?: boolean
    themeShallow?: boolean
    id?: string
    render?:
      | keyof HTMLElementTagNameMap
      | (string & {})
      | ReactElement
      | ((
          props: Record<string, any> & { ref?: ReactRef<any> },
          state: TailwindComponentState
        ) => ReactElement)
    theme?: string | null
    group?: string | boolean
    container?: boolean
    untilMeasured?: 'hide' | 'show'
    componentName?: string
    tabIndex?: string | number
    role?: HTMLAttributes<HTMLDivElement>['role']
    disableOptimization?: boolean
    forceStyle?: 'hover' | 'press' | 'focus' | 'focusVisible' | 'focusWithin'
    disableClassName?: boolean
    hitSlop?:
      | number
      | { top?: number; left?: number; bottom?: number; right?: number }
      | null
    animatedBy?: string | null
    onPress?: PressableProps['onPress']
    onLongPress?: PressableProps['onLongPress']
    onPressIn?: PressableProps['onPress']
    onPressOut?: PressableProps['onPress']
  }

type LooseCombinedObjects<A extends object, B extends object> = A | B | (A & B)

export type TailwindViewNonStyleProps = Omit<
  ReactNativeViewProps,
  'children' | 'display' | 'hitSlop' | 'pointerEvents' | 'style' | keyof WebEventProps
> &
  TailwindCommonProps & {
    style?: StyleProp<LooseCombinedObjects<CSSProperties, ViewStyle>>
  }

export type TailwindTextNonStyleProps = Omit<
  ReactNativeTextProps,
  'children' | 'style' | keyof WebEventProps
> &
  TailwindCommonProps & {
    style?: StyleProp<LooseCombinedObjects<CSSProperties, TextStyle>>
  }

type MeasureOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void

export interface TailwindElementMethods {
  measure(callback: MeasureOnSuccessCallback): void
  measureInWindow(
    callback: (x: number, y: number, width: number, height: number) => void
  ): void
  measureLayout(
    relativeToNativeNode: ReactNativeView | HTMLElement,
    onSuccess: (left: number, top: number, width: number, height: number) => void,
    onFail?: () => void
  ): void
  focus(): void
  blur(): void
}

export type TailwindViewElement = (HTMLElement & TailwindElementMethods) | ReactNativeView
export type TailwindTextElement = (HTMLElement & TailwindElementMethods) | ReactNativeText

/**
 * The complete styling surface of a `@tamagui/tailwind` component.
 *
 * Everything else a component accepts is ordinary behavior: children, refs,
 * accessibility, events, ids, and the raw platform `style` escape hatch, all
 * inherited from the shared non-style prop types. Tamagui inline style props
 * (`padding`, `bg`, shorthands, state/media clauses, theme style props) are
 * deliberately absent — that authoring syntax belongs to `@tamagui/core`.
 */
export type TailwindStyleProps = {
  className?: string
}

/** `true`/`false` matchers become a boolean prop; every other matcher is its own literal. */
type VariantAcceptedValue<Key> = Key extends 'true' | 'false' ? boolean : Key

/**
 * Finite variant inference: one optional prop per variant, accepting exactly the
 * matchers that variant declares. It never reaches core's style prop graph.
 */
export type TailwindVariantProps<Variants> = Variants extends object
  ? {
      [Key in keyof Variants]?: VariantAcceptedValue<keyof Variants[Key]>
    }
  : {}

/** Variant values are class strings — the same authoring syntax as `className`. */
export type TailwindVariantDefinitions = {
  [variantName: string]: { [matcher: string]: string }
}

export type TailwindCompoundVariant<Variants> = TailwindVariantProps<Variants> & {
  style: string
}

export type TailwindStyledOptions<Variants extends TailwindVariantDefinitions> = {
  name?: string
  variants?: Variants
  defaultVariants?: TailwindVariantProps<Variants>
  compoundVariants?: readonly TailwindCompoundVariant<Variants>[]
}

export interface TailwindComponent<
  Ref = any,
  NonStyleProps = {},
  VariantProps = {},
> extends FunctionComponent<
  NonStyleProps & TailwindStyleProps & VariantProps & { ref?: ReactRef<Ref> }
> {
  staticConfig: FrontendStaticConfig
  /** phantom carrier so `styled()` can recover the parts of a parent component */
  __tailwind?: { ref: Ref; props: NonStyleProps; variants: VariantProps }
}

export type GetTailwindRef<Component> =
  Component extends TailwindComponent<infer Ref, any, any> ? Ref : any

export type GetTailwindNonStyleProps<Component> =
  Component extends TailwindComponent<any, infer Props, any> ? Props : {}

export type GetTailwindVariantProps<Component> =
  Component extends TailwindComponent<any, any, infer Variants> ? Variants : {}

export type TailwindView = TailwindComponent<
  TailwindViewElement,
  TailwindViewNonStyleProps
>
export type TailwindText = TailwindComponent<
  TailwindTextElement,
  TailwindTextNonStyleProps
>

export type TailwindViewProps = TailwindViewNonStyleProps & TailwindStyleProps
export type TailwindTextProps = TailwindTextNonStyleProps & TailwindStyleProps
