import type { StyleObject } from '@tamagui/helpers'
import type {
  CoreStateModifierName,
  TransformAccumulator,
} from '@tamagui/style-grammar/runtime'
import type { Properties } from 'csstype'
import type {
  CSSProperties,
  ComponentType,
  Context,
  FunctionComponent,
  HTMLAttributes,
  ProviderExoticComponent,
  Ref as ReactRef,
  ReactNode,
  RefObject,
} from 'react'
import type {
  PressableProps,
  Text as RNText,
  TextStyle as RNTextStyle,
  TextProps as ReactTextProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import type { NativeStyleEngineLinkHandle } from './helpers/nativeStyleEngine'
import type { StyleFrontend } from './helpers/styleFrontend'
import type { CSSColorNames } from './interfaces/CSSColorNames'
import type { RNOnlyProps } from './interfaces/RNExclusiveTypes'

export type SizeKeys =
  | 'width'
  | 'height'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
  | 'shadowRadius'

export type ColorKeys =
  | 'color'
  | 'backgroundColor'
  | 'borderColor'
  | 'borderBottomColor'
  | 'borderTopColor'
  | 'borderLeftColor'
  | 'borderRightColor'
  | 'shadowColor'
  | 'outlineColor'
  | 'textShadowColor'
  | 'borderBlockColor'
  | 'borderBlockEndColor'
  | 'borderBlockStartColor'
  | 'borderInlineColor'
  | 'borderInlineStartColor'
  | 'borderInlineEndColor'
  // these four resolve theme colors at runtime (tokenCategories.color in
  // @tamagui/helpers) and were missing here, so they typechecked via
  // `(string & {})` while offering no token autocomplete at all
  | 'borderEndColor'
  | 'borderStartColor'
  | 'textDecorationColor'
  | 'caretColor'

export type SpaceKeys =
  | 'space'
  | 'padding'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'paddingLeft'
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingEnd'
  | 'paddingStart'
  | 'margin'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'marginLeft'
  | 'marginTop'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginEnd'
  | 'marginStart'
  | 'marginBlock'
  | 'marginBlockStart'
  | 'marginBlockEnd'
  | 'marginInline'
  | 'marginInlineStart'
  | 'marginInlineEnd'
  | 'paddingBlock'
  | 'paddingBlockStart'
  | 'paddingBlockEnd'
  | 'paddingInline'
  | 'paddingInlineStart'
  | 'paddingInlineEnd'
  | 'x'
  | 'y'
  | 'gap'
  | 'rowGap'
  | 'columnGap'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'borderTopEndRadius'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderTopStartRadius'
  | 'borderBottomEndRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
  | 'borderBottomStartRadius'
  | 'borderBottomWidth'
  | 'borderLeftWidth'
  | 'borderRadius'
  | 'borderRightWidth'
  | 'borderTopEndRadius'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderEndWidth'
  | 'borderStartWidth'
  | 'borderTopStartRadius'
  | 'borderTopWidth'
  | 'borderWidth'
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'shadowOffset'
  | 'borderBlockWidth'
  | 'borderBlockStartWidth'
  | 'borderBlockEndWidth'
  | 'borderInlineWidth'
  | 'borderInlineStartWidth'
  | 'borderInlineEndWidth'

export type StyledContext<
  Props extends Record<string, any> = any,
  ConsumedKeys extends keyof Props & string = keyof Props & string,
> = Context<Props> & {
  context: Context<Props>
  props: Record<string, any> | undefined
  propKeys?: readonly ConsumedKeys[]
  Provider: ProviderExoticComponent<
    Partial<Props | undefined> & {
      children?: ReactNode
      scope?: string
    }
  >

  useStyledContext: (scope?: string) => Props
}

export type StyledContextOptions<
  Props extends Record<string, any>,
  ConsumedKeys extends keyof Props & string = keyof Props & string,
> = {
  keys?: readonly ConsumedKeys[]
  namespace?: string
}

export type TamaguiComponentState = {
  unmounted: boolean | 'should-enter'
  disabled?: boolean
  hover?: boolean
  press?: boolean
  pressIn?: boolean
  focus?: boolean
  focusVisible?: boolean
  focusWithin?: boolean
  transition?: null | {
    style?: any
    avoidClasses?: boolean
  }

  // this is used by the component itself to figure out group styles:
  group?: Record<string, ChildGroupState>
  hasDynGroupChildren?: boolean
}

// from react-native Accessibility.d.ts

export type Role =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'meter'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'summary'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem'

export type TamaguiComponentPropsBaseBase = {
  target?: string

  htmlFor?: string

  /**
   * When truthy passes through all props to a single child element, and avoids rendering its own element.
   * Must pass just one child React element that will receive all the props.
   *
   * The option "except-style" will avoid passing any style related props.
   *
   * The option "web" will map all React Native style props to web props (onPress becomes onClick).
   *
   * The option "except-style-web" combines the except-style and web options.
   *
   */
  asChild?: boolean | 'except-style' | 'except-style-web' | 'web'

  dangerouslySetInnerHTML?: { __html: string }
  children?: any | any[]

  debug?: DebugProp

  disabled?: boolean

  /**
   * Same as the web className property, useful for applying styles from CSS on web only
   */
  className?: string

  /**
   * If given a theme it will only apply to this element, instead of passing down to children
   */
  themeShallow?: boolean

  /**
   * Same as the web id property for setting a uid on an element
   */
  id?: string

  /**
   * Controls the rendered element on web.
   * - String: renders as that HTML element (e.g., `render="button"`)
   * - JSX Element: clones element with merged props (e.g., `render={<a href="/" />}`)
   * - Function: full control with props and state (e.g., `render={(props) => <Custom {...props} />}`)
   * @example render="button"
   * @example render={<a href="/" />}
   * @example render={(props, state) => <MyComponent {...props} isPressed={state.press} />}
   */
  render?:
    | keyof HTMLElementTagNameMap
    | (string & {})
    | React.ReactElement
    | ((
        props: Record<string, any> & { ref?: React.Ref<any> },
        state: TamaguiComponentState
      ) => React.ReactElement)

  /**
   * Applies a theme to this element
   */
  theme?: ThemeName | null

  /**
   * Marks this component as a group for use in styling children based on parents named group
   * See: https://tamagui.dev/docs/intro/props
   */
  group?: GroupNames | (string & {}) | boolean

  /**
   * Marks this component as an inline-size query container. A string names the
   * container for matching `@sm/name:` clauses.
   */
  container?: boolean | (string & {})

  /**
   * Works alongside container. On native, children using container sizing can
   * be hidden until the parent is measured.
   * See: https://tamagui.dev/docs/intro/props
   */
  untilMeasured?: 'hide' | 'show'

  /** web: forwards to the HTML name attribute. */
  name?: string

  /**
   * Used for controlling the order of focus with keyboard or assistive device enavigation
   * See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
   */
  tabIndex?: string | number

  /**
   * Equivalent to role="" attribute on web for accessibility
   */
  role?: Role

  /**
   * Disable all compiler optimization
   */
  disableOptimization?: boolean

  /**
   * Opt this component out of the experimental native style fast path
   * (setNativeStyleEngine); it re-renders through React on theme/media
   * changes like normal
   */
  disableNativeStyle?: boolean

  /**
   * Forces the pseudo style state to be on
   */
  forceStyle?: 'hover' | 'press' | 'focus' | 'focusVisible' | 'focusWithin'

  /**
   * Disables className output of styles, instead using only inline styles
   */
  disableClassName?: boolean

  /**
   * Adds some area outside the typical bounds of the component for touch actions to register.
   * Tamagui uses Pressable internally so it supports `number | Insets` rather than just `Insets`
   */
  hitSlop?: number | Insets | null

  /**
   * Select which animation driver to use for this component.
   * Pass a string key matching a driver registered in the `animations` config.
   * Example: `<View animatedBy="spring">` when config has `animations: { default: css, spring: moti }`
   */
  animatedBy?: AnimationDriverKeys | null
}

export interface Insets {
  top?: number
  left?: number
  bottom?: number
  right?: number
}

export interface WebOnlyPressEvents {
  onPress?: PressableProps['onPress']
  onLongPress?: PressableProps['onLongPress']
  onPressIn?: PressableProps['onPress']
  onPressOut?: PressableProps['onPress']
  onMouseEnter?: DivAttributes['onMouseEnter']
  onMouseLeave?: DivAttributes['onMouseLeave']
  onMouseDown?: DivAttributes['onMouseDown']
  onMouseUp?: DivAttributes['onMouseUp']
  onMouseMove?: DivAttributes['onMouseMove']
  onMouseOver?: DivAttributes['onMouseOver']
  onMouseOut?: DivAttributes['onMouseOut']
  onFocus?: DivAttributes['onFocus']
  onBlur?: DivAttributes['onBlur']
  onClick?: DivAttributes['onClick']
  onDoubleClick?: DivAttributes['onDoubleClick']
  onContextMenu?: DivAttributes['onContextMenu']
  onWheel?: DivAttributes['onWheel']

  // Keyboard events
  onKeyDown?: DivAttributes['onKeyDown']
  onKeyUp?: DivAttributes['onKeyUp']

  // Input/Change events
  onChange?: DivAttributes['onChange']
  onInput?: DivAttributes['onInput']
  onBeforeInput?: DivAttributes['onBeforeInput']

  // Scroll
  onScroll?: DivAttributes['onScroll']

  // Clipboard
  onCopy?: DivAttributes['onCopy']
  onCut?: DivAttributes['onCut']
  onPaste?: DivAttributes['onPaste']

  // Drag and drop
  onDrag?: DivAttributes['onDrag']
  onDragStart?: DivAttributes['onDragStart']
  onDragEnd?: DivAttributes['onDragEnd']
  onDragEnter?: DivAttributes['onDragEnter']
  onDragLeave?: DivAttributes['onDragLeave']
  onDragOver?: DivAttributes['onDragOver']
  onDrop?: DivAttributes['onDrop']

  // Pointer events
  onPointerDown?: DivAttributes['onPointerDown']
  onPointerMove?: DivAttributes['onPointerMove']
  onPointerUp?: DivAttributes['onPointerUp']
  onPointerCancel?: DivAttributes['onPointerCancel']
}

export type { MediaStyleObject, StyleObject } from '@tamagui/helpers'

type FontFamilies = FontTokens

export type LanguageContextType = Partial<{
  [key in FontFamilies]: FontLanguages | 'default'
}>

export type FontLanguageProps = LanguageContextType & {
  children?: React.ReactNode
}

export type ThemeProviderProps = {
  className?: string
  defaultTheme: string | null | undefined
  children?: any
  reset?: boolean
  /**
   * This provider is mounted inside a page it does not own, so it must not write
   * its theme class onto `html` or `body`. Its theme class goes on its own node
   * instead. Set by the generated zero-runtime island entry.
   */
  isSubtreeRoot?: boolean
}

export type ThemeState = {
  id: string
  name: string
  theme: ThemeParsed
  parentName?: string
  isInverse?: boolean
  // cumulative count of scheme inversions from the root down to this state.
  // isInverse only compares to the immediate parent, so a sub-theme that keeps
  // its parent's scheme (e.g. dark_blue under dark) has isInverse=false even
  // though the whole subtree is inverted vs the root/OS. `inverses > 0` means
  // "this subtree forced a scheme away from the OS somewhere above" and must not
  // use the DynamicColorIOS scheme-optimization (which always follows the OS).
  inverses?: number
  isNew?: boolean
  parentId?: string
  scheme?: 'light' | 'dark'
}

export interface Variable<A = any> {
  isVar: true
  variable?: string
  val: A
  name: string
  key: string
  needsPx?: boolean // Flag to indicate this token should get px units
}

export type MakeVariable<A = any> = A extends string | number ? Variable<A> : A

/**
 * Type for the px helper object that indicates a token value needs px units
 */
export interface PxValue {
  val: number
  needsPx: true
}

export type ColorScheme = 'light' | 'dark'

export type MaybeTamaguiComponent<A = any> = TamaguiComponent<A> | React.FC<A>

type MeasureOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void

type MeasureInWindowOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number
) => void

type MeasureLayoutOnSuccessCallback = (
  left: number,
  top: number,
  width: number,
  height: number
) => void

/**
 * Methods added to element refs that work across web and native.
 * On web these are added at runtime to HTMLElements.
 * On native these exist on View already.
 */
export interface TamaguiElementMethods {
  measure(callback: MeasureOnSuccessCallback): void
  measureInWindow(callback: MeasureInWindowOnSuccessCallback): void
  measureLayout(
    relativeToNativeNode: View | HTMLElement,
    onSuccess: MeasureLayoutOnSuccessCallback,
    onFail?: () => void
  ): void
  focus(): void
  blur(): void
}

/**
 * Cross-platform element ref type. On web, includes TamaguiElementMethods
 * (measure, focus, blur) which Tamagui adds at runtime. On native, View
 * already has these via NativeMethods.
 */
export type TamaguiElement = (HTMLElement & TamaguiElementMethods) | View
export type TamaguiTextElement = (HTMLElement & TamaguiElementMethods) | RNText

/**
 * Web-specific element type for platform-specific .tsx files.
 * Use when you need HTMLElement subtype properties (e.g., selectionStart on HTMLInputElement)
 * that aren't on the cross-platform TamaguiElement type.
 *
 * @example
 * const ref = useRef<TamaguiWebElement<HTMLInputElement>>(null)
 * // ref.current has both HTMLInputElement props and TamaguiElementMethods
 */
export type TamaguiWebElement<T extends HTMLElement = HTMLElement> = T &
  TamaguiElementMethods

export type DebugProp = boolean | 'break' | 'verbose' | 'visualize' | 'profile'

export interface TamaguiComponentPropsBase
  extends TamaguiComponentPropsBaseBase, WebOnlyPressEvents {}

/**
 * For static / studio
 */

type NameToPaths = {
  [key: string]: Set<string>
}

export type LoadedComponents = {
  moduleName: string
  nameToInfo: Record<
    string,
    {
      staticConfig: StaticConfig
    }
  >
}

export type TamaguiProjectInfo = {
  components: LoadedComponents[]
  tamaguiConfig: TamaguiInternalConfig
  nameToPaths: NameToPaths
}

// base props that are accepted by createComponent (additional to react-native-web)

export type DivAttributes = HTMLAttributes<HTMLDivElement>

export type ReactComponentWithRef<Props, Ref> = ComponentType<
  Props & { ref?: ReactRef<Ref> }
>

// needs to be cb style for subscribeToContextGroup to be able to poke through to last state
export type ComponentSetStateShallow = React.Dispatch<
  React.SetStateAction<Partial<TamaguiComponentState>>
>

export type ComponentContextI = {
  disableSSR?: boolean
  inText: boolean
  language: LanguageContextType | null
  animationDriver: AnimationDriver | null
  setParentFocusState: ComponentSetStateShallow | null
  mediaEmit?: (state: UseMediaState) => void
  mediaEmitListeners?: Set<(state: UseMediaState) => void>
  insets?: { top: number; right: number; bottom: number; left: number } | null
}

export type TamaguiComponentStateRef = {
  startedUnhydrated: boolean
  optimizeForFirstRender?: boolean

  host?: TamaguiElement
  composedRef?: (x: TamaguiElement) => void
  willHydrate?: boolean
  hasMeasured?: boolean
  hasAnimated?: boolean
  shouldRegisterPresence?: boolean
  themeShallow?: boolean
  hasEverThemed?: boolean | 'wrapped'
  hasEverResetPresence?: boolean
  hasHadEvents?: boolean
  hasRealPressEvents?: boolean
  isListeningToTheme?: boolean
  unPress?: Function
  setStateShallow?: ComponentSetStateShallow
  // hoisted base shallow-setter that always calls the real React setState.
  // kept on its own field so the avoidReRenders wrapper (which overwrites
  // `setStateShallow`) can capture this as its real-re-render escape hatch.
  baseSetStateShallow?: ComponentSetStateShallow
  themeNeedsUpdate?: () => boolean
  useStyleListener?: UseStyleListener
  updateStyleListener?: () => void

  // this is only used by group="" components
  // sets up a context object to track current state + emit
  group?: ComponentGroupEmitter

  // avoid re-render animation support
  nextState?: TamaguiComponentState
  nextMedia?: UseMediaState

  // avoidReRenders latched on first render (animationDriver derives from the
  // per-render animatedBy prop; hooks gated on it must keep a stable count)
  avoidReRenders?: boolean

  // cleanup function for media emit listener
  mediaEmitCleanup?: () => void

  // previous pseudo state for detecting enter vs exit transitions
  prevPseudoState?: {
    hover?: boolean
    press?: boolean
    focus?: boolean
    groups?: Record<string, { hover?: boolean; press?: boolean; focus?: boolean }>
  }

  // native fast path (experimental): engine link handle for the host view,
  // the per-render themed-style updater, its stable proxy handed to
  // useThemeState, and the set of theme names already pushed to the engine
  // since the last render (reset every render, so cached native state props
  // can never outlive the props/state that produced them)
  nativeLink?: NativeStyleEngineLinkHandle | null
  nativeStyleUpdate?: (next: ThemeState) => boolean
  nativeUpdateProxy?: (next: ThemeState) => boolean
  nativePushedStates?: Set<string>
  // the state name currently committed for this view (by the render or the
  // last intercepted update): an update resolving to the same name is a no-op
  nativeActiveState?: string
  // media interception: recompute styles under the current theme when a
  // relevant media key flips (useMedia's subscription calls this before
  // forcing a re-render, passing that re-render as the miss fallback);
  // recomputes coalesce per event turn via nativeMediaQueued, and
  // nativeThemeState tracks the last theme handled natively so the recompute
  // uses it instead of the stale render capture
  nativeMediaUpdate?: (onMiss?: () => void) => boolean
  nativeMediaQueued?: boolean
  nativeThemeState?: ThemeState
  // union of style keys pushed to the engine since link: keys present before
  // but absent from the next push are sent as null (reset-to-default),
  // matching what a real re-render's style diff would do
  nativePushedKeys?: Set<string>
}

export type ComponentGroupEmitter = {
  listeners: Set<GroupStateListener>
  emit: GroupStateListener
  subscribe: (cb: GroupStateListener) => () => void
}

export type WidthHeight = {
  width: number
  height: number
}

export type ChildGroupState = {
  pseudo?: PseudoGroupState
  media?: Record<MediaQueryKey extends number ? never : MediaQueryKey, boolean>
}

export type ComponentGroupState = {
  pseudo?: PseudoGroupState
  layout?: WidthHeight
}

export type GroupStateListener = (state: ComponentGroupState) => void

export type SingleGroupContext = {
  subscribe: (cb: GroupStateListener) => DisposeFn
  state: ComponentGroupState
}

export type AllGroupContexts = {
  [GroupName: string]: SingleGroupContext
}

export type PseudoGroupState = Pick<
  TamaguiComponentState,
  'disabled' | 'hover' | 'press' | 'pressIn' | 'focus' | 'focusVisible' | 'focusWithin'
>

export type LayoutEvent = {
  nativeEvent: {
    layout: LayoutValue
    target: any
  }
  timeStamp: number
}

type LayoutValue = {
  x: number
  y: number
  width: number
  height: number
  left: number
  top: number
}

export type DisposeFn = () => void

export type ConfigListener = (conf: TamaguiInternalConfig) => void

// to prevent things from going circular, hoisting some types in this file
// to generally order them as building up towards TamaguiConfig

export type VariableVal = number | string | Variable | VariableValGeneric | PxValue
export type VariableColorVal = string | Variable

// values accepted by createTamagui({ variables }) and inline <Theme> props
export type VariableValIn = string | number | PxValue

export type GenericVariables = {
  [key: string]: VariableValIn | { light: VariableValIn; dark: VariableValIn }
}

type GenericKey = string

export type CreateTokens<Val extends VariableVal = VariableVal> = Record<
  string,
  { [key: GenericKey]: Val }
> & {
  color?: { [key: GenericKey]: Val }
  space?: { [key: GenericKey]: Val }
  size?: { [key: GenericKey]: Val }
  radius?: { [key: GenericKey]: Val }
  zIndex?: { [key: GenericKey]: Val }
}

export type TokenCategories = 'color' | 'space' | 'size' | 'radius' | 'zIndex'

type Tokenify<A extends GenericTokens> = Omit<
  {
    [Key in keyof A]: TokenifyRecord<A[Key]>
  },
  TokenCategories
> & {
  color: TokenifyRecord<A extends { color: any } ? A['color'] : {}>
  space: TokenifyRecord<A extends { space: any } ? A['space'] : {}>
  size: TokenifyRecord<A extends { size: any } ? A['size'] : {}>
  radius: TokenifyRecord<A extends { radius: any } ? A['radius'] : {}>
  zIndex: TokenifyRecord<A extends { zIndex: any } ? A['zIndex'] : {}>
}

type TokenifyRecord<A extends object> = {
  [Key in keyof A]: CoerceToVariable<A[Key]>
}

type CoerceToVariable<A> = A extends Variable ? A : Variable<A>

export type TamaguiBaseTheme = {
  // defined for our tamagui kit , we could do this inside `tamagui`
  // but maybe helpful to have some sort of universally shared things +
  // + enforce if they want their own, redefine in their design sys
  background: VariableColorVal
  backgroundHover: VariableColorVal
  backgroundPress: VariableColorVal
  backgroundFocus: VariableColorVal
  color: VariableColorVal
  colorHover: VariableColorVal
  colorPress: VariableColorVal
  colorFocus: VariableColorVal
  borderColor: VariableColorVal
  borderColorHover: VariableColorVal
  borderColorPress: VariableColorVal
  borderColorFocus: VariableColorVal
  shadowColor: VariableColorVal
  shadowColorHover: VariableColorVal
  shadowColorPress: VariableColorVal
  shadowColorFocus: VariableColorVal
}

export type VariableValGeneric = { __generic: 1 }

type GenericTokens = CreateTokens
type GenericThemes = {
  [key: string]: Partial<TamaguiBaseTheme> & {
    [key: string]: VariableVal
  }
}

export type CreateShorthands = {
  // for some reason using keyof ViewStyle here will cause type circularity on react native 0.71
  [key: string]: string
}

export type GenericShorthands = {}

// sm: { minWidth: 100 }
type GenericMedia = {
  [key: string]: {
    [key: string]: number | string
  }
}

export type GenericFonts = Record<string, GenericFont>

type GenericAnimations = {
  [key: string]:
    | string
    | {
        [key: string]: any
      }
    | any[]
}

// this is the "main" typed object, which users re-define
// (internal) keep all types directly on this object and reference them from elsewhere
//
// const config = createTamagui(...)
// type MyConfig = typeof config
// declare module 'tamagui' {
//   export interface TamaguiCustomConfig extends MyConfig {}
// }
// now your whole app/kit should be typed correctly
//
export interface TamaguiCustomConfig {}

export interface TamaguiConfig
  extends Omit<GenericTamaguiConfig, keyof TamaguiCustomConfig>, TamaguiCustomConfig {}

export type OnlyAllowShorthandsSetting = TamaguiConfig['settings'] extends {
  onlyAllowShorthands: infer X
}
  ? X
  : false

export type OnlyShorthandStylePropsSetting = TamaguiConfig['settings'] extends {
  onlyShorthandStyleProps: infer X
}
  ? X
  : false

export type CreateTamaguiConfig<
  A extends GenericTokens,
  B extends GenericThemes,
  C extends GenericShorthands = GenericShorthands,
  D extends GenericMedia = GenericMedia,
  E extends GenericAnimations = GenericAnimations,
  F extends GenericFonts = GenericFonts,
  H extends GenericTamaguiSettings = GenericTamaguiSettings,
  // preserve the raw animation driver keys ('default' | 'css' | etc)
  // defaults to string so generic TamaguiInternalConfig accepts any driver keys
  AnimDriverKeys extends string = string,
> = {
  fonts: RemoveLanguagePostfixes<F>
  fontLanguages: GetLanguagePostfixes<F> extends never
    ? string[]
    : GetLanguagePostfixes<F>[]
  tokens: A
  // parsed
  themes: {
    [Name in keyof B]: {
      [Key in keyof B[Name]]: CoerceToVariable<B[Name][Key]>
    }
  }
  shorthands: C
  media: D
  // Support both single driver and multi-driver config
  // Multi-driver: { default: cssDriver, spring: motiDriver }
  // Single: AnimationDriver<E>
  animations: AnimationDriverLike<E> | AnimationsConfigObject
  // phantom type for preserving driver keys - never set at runtime, only for type inference
  animationDriverKeys?: AnimDriverKeys
  settings: H
}

type GetLanguagePostfix<Set> = Set extends string
  ? Set extends `${string}_${infer Postfix}`
    ? Postfix
    : never
  : never

type OmitLanguagePostfix<Set> = Set extends string
  ? Set extends `${infer Prefix}_${string}`
    ? Prefix
    : Set
  : never

type RemoveLanguagePostfixes<F extends GenericFonts> = {
  [Key in OmitLanguagePostfix<keyof F>]: F[Key]
}

type GetLanguagePostfixes<F extends GenericFonts> = GetLanguagePostfix<keyof F>

// test RemoveLanguagePostfixes
// type x = CreateTamaguiConfig<any, any, any, any, any, {
//   body: any,
//   body_en: any
// }>['fonts']

type ConfProps<A, B, C, D, E, F, I, V = undefined> = {
  tokens?: A
  themes?: B
  shorthands?: C
  media?: D
  animations?: E
  fonts?: F
  settings?: I
  variables?: V
}

// config-declared custom variables become keys on every base theme, so they
// flow into ThemeKeys/ThemeParsed and theme-value autocompletion with no separate
// augmentation surface
type VariableValInScheme<V> = V extends { light: infer L } ? L : V
type ThemesWithVariables<B, V> = [V] extends [undefined]
  ? B
  : [keyof V] extends [never]
    ? B
    : {
        [N in keyof B]: B[N] & {
          [K in keyof V & string]: VariableValInScheme<V[K]> extends PxValue
            ? number
            : VariableValInScheme<V[K]>
        }
      }

type EmptyTokens = {
  color: {}
  space: {}
  size: {}
  radius: {}
  zIndex: {}
}
type EmptyThemes = {}
type EmptyShorthands = {}
type EmptyMedia = {}
type EmptyAnimations = {}
type EmptyFonts = {}

type EmptyTamaguiSettings = {
  allowedStyleValues: false
}

// Helper to extract animation config from AnimationDriver<Config> or multi-driver object
type ExtractAnimationConfig<E> =
  E extends AnimationDriverLike<infer Config>
    ? Config
    : E extends { default: AnimationDriverLike<infer Config> }
      ? Config
      : E extends GenericAnimations
        ? E
        : EmptyAnimations

// Helper to extract animation driver keys from raw animations prop
// Single driver: returns 'default'
// Multi-driver { default: x, css: y }: returns 'default' | 'css'
type ExtractAnimationDriverKeys<E> =
  E extends AnimationDriverLike<any>
    ? 'default'
    : E extends { default: AnimationDriverLike<any> }
      ? Extract<keyof E, string>
      : 'default'

export type InferTamaguiConfig<Conf> =
  Conf extends ConfProps<
    infer A,
    infer B,
    infer C,
    infer D,
    infer E,
    infer F,
    infer H,
    infer V
  >
    ? TamaguiInternalConfig<
        A extends GenericTokens ? A : EmptyTokens,
        B extends GenericThemes ? ThemesWithVariables<B, V> : EmptyThemes,
        C extends GenericShorthands ? C : EmptyShorthands,
        D extends GenericMedia ? D : EmptyMedia,
        ExtractAnimationConfig<E>,
        F extends GenericFonts ? F : EmptyFonts,
        H extends GenericTamaguiSettings ? H : EmptyTamaguiSettings,
        ExtractAnimationDriverKeys<E>
      >
    : unknown

// for use in creation functions so it doesnt get overwritten
export type GenericTamaguiConfig = CreateTamaguiConfig<
  GenericTokens,
  GenericThemes,
  GenericShorthands,
  GenericMedia,
  GenericAnimations,
  GenericFonts
>

// try and find the top level types as they can be supersets:
export type RootThemeName<TK extends keyof Themes = keyof Themes> = TK extends string
  ? string extends TK
    ? never
    : TK extends `${string}_${string}`
      ? never
      : TK
  : never
type BaseThemeDefinitions = TamaguiConfig['themes'][RootThemeName]
type GenericThemeDefinition = TamaguiConfig['themes'][keyof TamaguiConfig['themes']]
export type ThemeDefinition = BaseThemeDefinitions extends never
  ? GenericThemeDefinition
  : BaseThemeDefinitions
export type ThemeKeys = keyof ThemeDefinition
export type ThemeParsed = {
  [key in ThemeKeys]: CoerceToVariable<ThemeDefinition[key]>
}

/**
 * Prop names `<Theme>` owns. Inline values are authored on `<ThemeUpdate>`.
 */
export type ReservedThemePropName =
  | '_isRoot'
  | 'children'
  | 'className'
  | 'contain'
  | 'debug'
  | 'deopt'
  | 'disable'
  | 'disable-child-theme'
  | 'forceClassName'
  | '_themeUpdate'
  | 'name'
  | 'nativeUpdate'
  | 'needsUpdate'
  | 'passThrough'
  | 'reset'
  | 'shallow'

export type Tokens = TamaguiConfig['tokens']

export type TokensParsed = {
  [Key in keyof Required<Tokens>]: TokenifyRecord<NonNullable<Tokens[Key]>>
}

export type Shorthands = TamaguiConfig['shorthands']
export type Media = TamaguiConfig['media']
export type Themes = TamaguiConfig['themes']
type BuiltInSubThemeName = 'inverse'
export type ThemeName = Exclude<
  GetAltThemeNames<keyof Themes> | BuiltInSubThemeName,
  number
>
export type ThemeTokens = GetTokenString<ThemeKeys>
// Animation names (slow, fast, bouncy) for the `transition` prop
// Extract animation keys from the driver's `animations` property
// The AnimationDriver<Config> has an `animations: Config` property
// Use Extract<keyof A, string> to filter out number/symbol keys from fallback case
type GetAnimationsFromDriver<T> = T extends { animations: infer A }
  ? Extract<keyof A, string>
  : never

// For multi-driver configs like { default: AnimationDriver, css: AnimationDriver }
// Extract from the 'default' driver or first driver found
type GetAnimationsFromMultiDriver<T> = T extends { default: infer D }
  ? GetAnimationsFromDriver<D>
  : T extends { [key: string]: infer D }
    ? GetAnimationsFromDriver<D>
    : never

// Extract just the AnimationDriver from the union (excluding AnimationsConfigObject)
type ExtractDriver<T> = Extract<T, AnimationDriver<any>>

// Main extraction - use Extract to get AnimationDriver from union, then get keys
type InferredTransitionKeys =
  ExtractDriver<TamaguiConfig['animations']> extends AnimationDriver<any>
    ? GetAnimationsFromDriver<ExtractDriver<TamaguiConfig['animations']>>
    : GetAnimationsFromMultiDriver<TamaguiConfig['animations']>

export type TransitionKeys = InferredTransitionKeys

// Driver keys (default, css, spring) for the `animatedBy` prop
// Gets driver keys directly from TamaguiConfig.animationDriverKeys
// Falls back to 'default' only when TamaguiCustomConfig is empty (no augmentation)
// The Exclude<X, undefined> handles optional property, then we intersect with string
// to ensure only string keys (not symbols/numbers)
export type AnimationDriverKeys =
  | 'default'
  | Extract<Exclude<TamaguiConfig['animationDriverKeys'], undefined>, string>
  // add TypeOverride keys for lazy-loaded drivers
  | (ReturnType<TypeOverride['animationDrivers']> extends 1
      ? never
      : ReturnType<TypeOverride['animationDrivers']>)

export type FontLanguages = ArrayIntersection<TamaguiConfig['fontLanguages']>

export interface ThemeProps {
  className?: string
  name?: Exclude<ThemeName, number> | null
  children?: any
  reset?: boolean
  debug?: DebugProp
  // on the web, for portals we need to re-insert className
  forceClassName?: boolean

  // used internally for shallow themes
  shallow?: boolean
}

// more low level
export type UseThemeWithStateProps = ThemeProps & {
  deopt?: boolean
  passThrough?: boolean
  disable?: boolean
  needsUpdate?: () => boolean
  /** opaque internal value patch created by `<ThemeUpdate>` */
  _themeUpdate?: import('./helpers/themeUpdateState').ThemeUpdateState
  /**
   * native fast path (experimental): called on a theme update instead of
   * re-rendering; return true when the update was committed natively so the
   * re-render is skipped. never called for forced updates.
   */
  nativeUpdate?: (next: ThemeState) => boolean
}

type ArrayIntersection<A extends any[]> = A[keyof A]

type GetAltThemeNames<S> =
  | (S extends `${infer Theme}_${infer Alt}` ? Theme | GetAltThemeNames<Alt> : S)
  | S

type AllowedValueSettingBase =
  | boolean
  | 'strict'
  | 'somewhat-strict'
  | 'strict-web'
  | 'somewhat-strict-web'

type AllowedStyleValuesSettingSize = AllowedValueSettingBase | 'number' | 'percent'
type AllowedStyleValuesSettingZIndex = AllowedValueSettingBase | 'number'
type AllowedStyleValuesSettingRadius = AllowedValueSettingBase | 'number'
type AllowedStyleValuesSettingColor = AllowedValueSettingBase | 'named'

type AllowedStyleValuesSettingPerCategory = {
  space?: AllowedStyleValuesSettingSize
  size?: AllowedStyleValuesSettingSize
  radius?: AllowedStyleValuesSettingRadius
  zIndex?: AllowedStyleValuesSettingZIndex
  color?: AllowedStyleValuesSettingColor
}

type AllowedStyleValuesSetting =
  | AllowedValueSettingBase
  | AllowedStyleValuesSettingPerCategory

export interface GenericTamaguiSettings {
  /**
   * controls style semantics where React Native/Yoga and CSS differ.
   *
   * - "legacy": preserves Tamagui v1 flex expansion.
   * - "react-native": follows React Native/Yoga flex and raw numeric lineHeight semantics.
   * - "web": follows CSS flex and unitless numeric lineHeight semantics.
   *
   * @default "web"
   */
  styleCompat?: 'legacy' | 'react-native' | 'web'

  // TODO
  /**
   * When true, Tamagui will always prefer a more specific style prop over a
   * less specific one.
   *
   * By default, Tamagui processes all style props in order of definition on the
   * object. This is a bit strange to most people, but it gets around many
   * annoying issues with specificity. You can see our docs on this here:
   * https://tamagui.dev/docs/intro/styles#style-order-is-important
   *
   * But this can be confusing in simple cases, like when you do:
   *
   *   <View paddingTop={0} padding={10} />
   *
   * This would set paddingTop ultimately to be 10, because padding comes after
   * paddingTop. When this setting is set to true, paddingTop will always beat
   * padding, because it is more specific.
   *
   * For variants, it will still take the prop order as definitive.
   *
   *
   * @default false
   */
  // preferSpecificStyleProps?: boolean

  /**
   * Set up allowed values on style props, this is only a type-level validation.
   *
   * "strict" - only allows tokens for any token-enabled properties "strict-web"
   * - same as strict but allows for web-specific tokens like auto/inherit
   * "somewhat-strict" - allow tokens or: for space/size: string% or numbers for
   * radius: number for zIndex: number for color: named colors or rgba/hsla
   * strings "somewhat-strict-web" - same as somewhat-strict but allows for
   * web-specific tokens
   *
   * @default false - allows any string (or number for styles that accept
   * numbers)
   *
   */
  allowedStyleValues?: AllowedStyleValuesSetting

  /**
   * On iOS, this enables a mode where Tamagui returns color values using
   * `DynamicColorIOS` This is a React Native built in feature, you can read the
   * docs here: https://reactnative.dev/docs/dynamiccolorios
   *
   * We're working to make this enabled by default without any setting, but
   * Tamagui themes support inversing and/or changing to light/dark at any point
   * in the tree. We haven't implemented support for either of these cases when
   * combined with this feature.
   *
   * So - as long as you:
   *
   *   1. Only use light/dark changes of themes at the root of your app
   *   2. Always change light/dark alongside the Appearance.colorScheme
   *
   * Then this feature is safe to turn on and will significantly speed up
   * dark/light re-renders.
   */
  fastSchemeChange?: boolean

  /**
   * Chooses whether Tamagui optimizes component renders for granular updates or
   * for the lowest first-render overhead.
   *
   * - "updates" tracks the theme and media keys each component reads so changes
   *   only re-render consumers of those values.
   * - "first-render" skips per-key tracking and uses coarse theme and media
   *   subscriptions. Theme and media changes still apply, but may re-render
   *   every Tamagui component under the changed provider.
   *
   * This is a startup-level setting. Set it when creating the Tamagui config
   * and do not change it while the app is running.
   *
   * Defaults per platform: web defaults to "updates" (granular theme/media
   * changes matter most), native defaults to "first-render" (initial render
   * speed matters most, and full-tree re-renders are cheaper without the DOM).
   *
   * @default "updates" on web, "first-render" on native
   */
  optimizeFor?: 'updates' | 'first-render'

  /**
   * Only allow shorthands when enabled. Recommended to be true to avoid having
   * two ways to style the same property.
   */
  onlyAllowShorthands?: boolean | undefined

  /**
   * Define a default font, for better types and default font on Text
   */
  defaultFont?: string

  /**
   * Web-only: define CSS text-selection styles
   */
  selectionStyles?: (theme: Record<string, string>) => null | {
    backgroundColor?: any
    color?: any
  }

  /**
   * If building a non-server rendered app, set this to true.
   *
   * For SSR compatibility on the web, Tamagui will render once with the settings
   * from `mediaQueryDefaultActive` set for all media queries. Then, it will render
   * again after the initial render using the proper media query values. This is so that
   * hydration will match perfectly with the server.
   *
   * Setting disableSSR will avoid this second render by setting the media query state
   * to the actual browser dimensions on initial load. This is only useful for client-only
   * apps.
   *
   * @default false
   *
   */
  disableSSR?: boolean

  /**
   * For the first render, determines which media queries are true, this only
   * affects things on native or on web if you disableSSR, as otherwise Tamagui
   * relies on CSS to avoid the need for re-rendering on first render.
   */
  mediaQueryDefaultActive?: Record<string, boolean>

  /**
   * Adds @media(prefers-color-scheme) media queries for dark/light, must be set
   * true if you are supporting system preference for light and dark mode themes
   */
  shouldAddPrefersColorThemes?: boolean

  /**
   * If you want to style your <body> tag to use theme CSS variables on web, you
   * must place the theme className onto the body element or above. This will do so.
   * If disabled, Tamagui will place the className onto the element rendered by
   * the TamaguiProvider
   *
   * @default html
   */
  addThemeClassName?: 'body' | 'html' | false

  /**
   * Sets the default position value for all Tamagui components.
   * @default 'static'
   */
  defaultPosition?: 'static' | 'relative'

  /**
   * Sets the base font size for rem calculations on native platforms.
   * On web, browsers use the root font size (typically 16px).
   * @default 16
   */
  remBaseFontSize?: number

  /**
   * When true, removes the individual longhand style props for border,
   * outline, and shadow (borderWidth, borderStyle, borderColor,
   * outlineWidth, outlineStyle, outlineColor, outlineOffset,
   * shadowColor, shadowOffset, shadowOpacity, shadowRadius) from the
   * type system, encouraging use of the combined shorthand props instead
   * (`border`, `outline`, `boxShadow`).
   *
   * This avoids specificity issues when mixing shorthand and longhand
   * props in atomic CSS output.
   *
   * Note: this is type-level only - it does not change runtime behavior.
   *
   * @default false
   */
  onlyShorthandStyleProps?: boolean
}

export type TamaguiSettings = TamaguiConfig['settings']

export type BaseStyleProps = {
  [Key in keyof TextStylePropsBase]?: TextStyle[Key] | GetThemeValueForKey<Key>
} & {
  [Key in keyof StackStyleBase]?: StackStyle[Key] | GetThemeValueForKey<Key>
}

/**
 * Animation drivers config - can be a single driver or named drivers object.
 * If object, must include a 'default' key.
 */
export type AnimationsConfig = AnimationDriverLike<any> | AnimationsConfigObject

export type AnimationsConfigObject = {
  default: AnimationDriverLike<any>
  [key: string]: AnimationDriverLike<any>
}

export type CreateTamaguiProps = {
  reactNative?: any
  shorthands?: CreateShorthands
  media?: GenericTamaguiConfig['media']
  /**
   * Animation driver(s) configuration.
   * Can be a single driver or an object of named drivers (must include 'default').
   * @example
   * // Single driver
   * animations: createAnimations({ slow: '...', fast: '...' })
   * // Multiple named drivers
   * animations: { default: cssDriver, spring: motiDriver }
   */
  animations?: AnimationsConfig
  fonts?: GenericTamaguiConfig['fonts']
  tokens?: GenericTamaguiConfig['tokens']
  themes?: {
    [key: string]: {
      [key: string]: string | number | Variable
    }
  }

  /**
   * Custom variables: merged into every base theme at createTamagui time, so
   * they resolve like theme keys everywhere (bare names in style props, useTheme(),
   * CSS variable emission) and can be redefined per-subtree via `<Theme>` props.
   * Values may reference theme keys or tokens by bare name or
   * be literals; per-scheme values via { light, dark }.
   */
  variables?: GenericVariables

  settings?: Partial<GenericTamaguiSettings>

  /**
   * Web-only: define text-selection CSS
   */
  selectionStyles?: (theme: Record<string, string>) => null | {
    backgroundColor?: any
    color?: any
  }
}

export type GetCSS = (opts?: {
  separator?: string
  exclude?: 'themes' | 'design-system' | null
  sinceLastCall?: boolean
}) => string

// this is the config generated via createTamagui()
export type TamaguiInternalConfig<
  A extends GenericTokens = GenericTokens,
  B extends GenericThemes = GenericThemes,
  C extends GenericShorthands = GenericShorthands,
  D extends GenericMedia = GenericMedia,
  E extends GenericAnimations = GenericAnimations,
  F extends GenericFonts = GenericFonts,
  G extends GenericTamaguiSettings = GenericTamaguiSettings,
  // preserve the raw animation driver keys ('default' | 'css' | etc)
  // defaults to string so generic TamaguiInternalConfig accepts any driver keys
  AnimDriverKeys extends string = string,
> = Omit<CreateTamaguiProps, keyof GenericTamaguiConfig> &
  Omit<CreateTamaguiConfig<A, B, C, D, E, F, G, AnimDriverKeys>, 'tokens'> & {
    // TODO need to make it this but this breaks types, revisit
    // animations: E //AnimationDriver<E>
    tokens: Tokenify<A>
    tokensParsed: Tokenify<A>
    themeConfig: any
    fontsParsed: GenericFonts
    getCSS: GetCSS
    getNewCSS: GetCSS
    parsed: boolean
    inverseShorthands: Record<string, string>
    userShorthands: C
    reactNative?: any
    fontSizeTokens: Set<string>
    settings: Omit<GenericTamaguiSettings, keyof G> & G
    defaultFont?: string
    defaultFontToken: `${string}`
    // multi-driver animation config (e.g., { default: motionDriver, css: cssDriver })
    // used for component-level driver selection via animatedBy prop
    animationDrivers?: Record<string, AnimationDriverLike | null>
  }

export type GetAnimationKeys<A extends GenericTamaguiConfig> = keyof A['animations']

// prevents const intersections from being clobbered into string, keeping the consts
export type UnionableString = string & {}
export type UnionableNumber = number & {}

type GenericFontKey = string | number | symbol

export type GenericFont<Key extends GenericFontKey = GenericFontKey> = {
  size: { [key in Key]: number | Variable }
  family?: string | Variable
  lineHeight?: Partial<{ [key in Key]: number | Variable }> | undefined
  letterSpacing?: Partial<{ [key in Key]: number | Variable }> | undefined
  weight?: Partial<{ [key in Key]: number | string | Variable }> | undefined
  style?: Partial<{ [key in Key]: RNTextStyle['fontStyle'] | Variable }> | undefined
  transform?:
    | Partial<{ [key in Key]: RNTextStyle['textTransform'] | Variable }>
    | undefined
  color?: Partial<{ [key in Key]: string | Variable }> | undefined
  // for native use only, lets you map to alternative fonts
  face?:
    | Partial<{
        [key in FontWeightValues]: { normal?: string; italic?: string }
      }>
    | undefined
}

// media
export type MediaQueryObject = { [key: string]: string | number | string }
export type MediaQueryKey = keyof Media
export type MediaQueryState = { [key in MediaQueryKey]: boolean }

export interface TypeOverride {
  groupNames(): 1
  animationDrivers(): 1
}

export type GroupNames =
  ReturnType<TypeOverride['groupNames']> extends 1
    ? never
    : ReturnType<TypeOverride['groupNames']>

export type AddWebOnlyStyleProps<A> = Partial<
  Omit<CSSProperties, keyof WebOnlyValidStyleValues>
> &
  Partial<WebOnlyValidStyleValues> & {
    [K in Exclude<keyof A, keyof CSSProperties>]?: A[K]
  }

export type WebOnlyValidStyleValues = {
  position: CSSProperties['position'] | '-webkit-sticky'
}

export type MediaQueries = {
  [key in MediaQueryKey]: MediaQueryObject
}

export interface MediaQueryList {
  addListener(listener?: any): void
  removeListener(listener?: any): void
  match?: (query: string, dimensions: { width: number; height: number }) => boolean
  matches: boolean
}

export type MatchMedia = (query: string) => MediaQueryList

// createComponent props helpers

// transition="bouncy"
// transition={['bouncy', {  }]}
// { all: 'name' }

// TODO can override for better types
export type AnimationConfigType = any

/**
 * Spring configuration parameters that can override preset defaults.
 * Use with array syntax: transition={['bouncy', { stiffness: 1000, damping: 70 }]}
 */
export type TransitionSpringConfig = {
  stiffness?: number
  damping?: number
  mass?: number
  tension?: number
  friction?: number
  velocity?: number
  overshootClamping?: boolean
  duration?: number
  bounciness?: number
  speed?: number
}

/**
 * A transition value: the name of a configured driver animation, or a raw CSS
 * transition string such as `200ms` or `200ms hover:400ms`. The runtime accepts
 * both — a name that is not a configured preset is treated as CSS — so the type
 * must too. `(string & {})` keeps the preset names in autocomplete instead of
 * collapsing the union to plain `string`.
 */
export type TransitionValue = TransitionKeys | (string & {})

export type TransitionProp =
  | TransitionValue
  | ({
      default?: TransitionValue
      enter?: TransitionValue
      exit?: TransitionValue
      delay?: number
    } & TransitionSpringConfig & {
        [key: string]:
          | TransitionValue
          | {
              type: TransitionValue
              [key: string]: any
            }
          | number
          | boolean
          | undefined
      })
  | [
      TransitionValue,
      {
        delay?: number
        enter?: TransitionValue
        exit?: TransitionValue
      } & TransitionSpringConfig & {
          [key: string]:
            | TransitionValue
            | {
                type?: TransitionValue
                [key: string]: any
              }
            | number
            | boolean
            | undefined
        },
    ]

/**
 * Emitted by the animation driver at the start and end of a transition.
 *
 * `cause` is `enter` when the component mounts into an AnimatePresence, `exit`
 * when it unmounts, and `update` for any style change while it stays mounted.
 * On the `end` phase, `finished` is `false` when the transition was interrupted
 * (e.g. an exit canceled by a re-enter, or an update superseded by another).
 */
export type TransitionEvent = {
  phase: 'start' | 'end'
  cause: 'enter' | 'exit' | 'update'
  finished?: boolean
}

export type OnTransition = (event: TransitionEvent) => void

/**
 * Tokens
 */

type PercentString = `${string}%` & {}
type RemString = `${number}rem`

type SomewhatSpecificSizeValue = 'auto' | PercentString | RemString | UnionableNumber
type SomewhatSpecificSpaceValue = 'auto' | PercentString | RemString | UnionableNumber

type VariableString = `var(${string})`

export type SomewhatSpecificColorValue =
  | CSSColorNames
  | 'transparent'
  | (`rgba(${string})` & {})
  | (`rgb(${string})` & {})
  | (`hsl(${string})` & {})
  | (`hsla(${string})` & {})
  | (`#${string}` & {})

type WebOnlySizeValue =
  | `${number}vw`
  | `${number}dvw`
  | `${number}lvw`
  | `${number}svw`
  | `${number}vh`
  | `${number}dvh`
  | `${number}lvh`
  | `${number}svh`
  | `calc(${string})`
  | `min(${string})`
  | `max(${string})`
  | 'max-content'
  | 'min-content'

type UserAllowedStyleValuesSetting = Exclude<
  TamaguiSettings['allowedStyleValues'],
  undefined
>

export type GetThemeValueSettingForCategory<
  Cat extends keyof AllowedStyleValuesSettingPerCategory,
> = UserAllowedStyleValuesSetting extends AllowedValueSettingBase | undefined
  ? UserAllowedStyleValuesSetting
  : UserAllowedStyleValuesSetting extends AllowedStyleValuesSettingPerCategory
    ? UserAllowedStyleValuesSetting[Cat]
    : true

export type GetThemeValueFallbackFor<
  Setting,
  StrictValue,
  SomewhatStrictValue,
  LooseValue,
  WebOnlyValue,
> = Setting extends 'strict'
  ? StrictValue
  : Setting extends 'strict-web'
    ? StrictValue | WebOnlyValue
    : Setting extends 'somewhat-strict'
      ? SomewhatStrictValue
      : Setting extends 'somewhat-strict-web'
        ? SomewhatStrictValue | WebOnlyValue
        : LooseValue

// the most generic fallback for anything not covered by special values
export type ThemeValueFallback =
  // for backwards compat with overriding the type we make this either UnionableString
  // or never if they don't define any UserAllowedStyleValuesSetting
  | (TamaguiSettings extends { allowedStyleValues: any } ? never : UnionableString)
  | Variable

export type AllowedValueSettingSpace = GetThemeValueSettingForCategory<'space'>
export type AllowedValueSettingSize = GetThemeValueSettingForCategory<'size'>
export type AllowedValueSettingColor = GetThemeValueSettingForCategory<'color'>
export type AllowedValueSettingZIndex = GetThemeValueSettingForCategory<'zIndex'>
export type AllowedValueSettingRadius = GetThemeValueSettingForCategory<'radius'>

export type WebStyleValueUniversal = 'unset' | 'inherit' | VariableString

export type ThemeValueFallbackSpace =
  | ThemeValueFallback
  | GetThemeValueFallbackFor<
      AllowedValueSettingSpace,
      never,
      SomewhatSpecificSpaceValue,
      UnionableString | UnionableNumber,
      WebStyleValueUniversal | WebOnlySizeValue
    >

export type SpaceValue = number | SpaceTokens | ThemeValueFallback

export type ThemeValueFallbackSize = GetThemeValueFallbackFor<
  AllowedValueSettingSize,
  never,
  SomewhatSpecificSizeValue,
  UnionableString | UnionableNumber,
  WebStyleValueUniversal | WebOnlySizeValue
>

export type ThemeValueFallbackColor =
  | ThemeValueFallback
  | GetThemeValueFallbackFor<
      AllowedValueSettingColor,
      never,
      SomewhatSpecificColorValue,
      UnionableString | UnionableNumber,
      WebStyleValueUniversal
    >

export type ThemeValueFallbackRadius =
  | ThemeValueFallback
  | GetThemeValueFallbackFor<
      AllowedValueSettingRadius,
      never,
      UnionableNumber,
      UnionableNumber,
      WebStyleValueUniversal
    >

export type ThemeValueFallbackZIndex =
  | ThemeValueFallback
  | GetThemeValueFallbackFor<
      AllowedValueSettingZIndex,
      never,
      UnionableNumber,
      UnionableNumber,
      WebStyleValueUniversal
    >

export type GetTokenString<A> = A extends string | number ? `${A}` : string

export type Size =
  | ThemeValueFallbackSize
  | GetTokenString<keyof Tokens['size']>
  | (string & {})
  | true

export type SizeTokens = Size

export type Space = GetTokenString<keyof Tokens['space']> | ThemeValueFallbackSpace | true

export type SpaceTokens = Space

// base color token strings (before opacity modifier)
type ColorTokenBase =
  | GetTokenString<keyof Tokens['color']>
  | GetTokenString<keyof ThemeParsed>

// keep this non-expanded. using `${ColorTokenBase}/${number}` preserves stricter
// token names, but large user token/theme unions hit TS2590.
type TokenWithOpacity = `${string}/${number}`

export type Color =
  | ColorTokenBase
  | CSSColorNames
  // opacity modifier: token/50
  | TokenWithOpacity
  // clause-bearing values are intentionally open-ended; the language service
  // validates the grammar without materializing a combinatorial type union
  | (string & {})

export type ColorTokens = Color

export type ZIndex =
  | GetTokenString<keyof Tokens['zIndex']>
  | ThemeValueFallbackZIndex
  | number
  | true

export type ZIndexTokens = ZIndex

export type Radius =
  | GetTokenString<keyof Tokens['radius']>
  | ThemeValueFallbackRadius
  | number
  | RemString
  | true

export type RadiusTokens = Radius

export type Token =
  | GetTokenString<keyof Tokens['radius']>
  | GetTokenString<keyof Tokens['zIndex']>
  | GetTokenString<keyof Tokens['color']>
  | GetTokenString<keyof Tokens['space']>
  | GetTokenString<keyof Tokens['size']>

export type ColorStyleProp = ThemeValueFallbackColor | ColorTokens

// fonts
type DefaultFont = TamaguiSettings['defaultFont']

export type Fonts = DefaultFont extends string
  ? TamaguiConfig['fonts'][DefaultFont]
  : never

export type Font = ParseFont<Fonts>

export type GetTokenFontKeysFor<
  A extends
    | 'size'
    | 'weight'
    | 'letterSpacing'
    | 'family'
    | 'lineHeight'
    | 'transform'
    | 'style'
    | 'color',
> = keyof TamaguiConfig['fonts']['body'][A]

export type FontTokens = GetTokenString<keyof TamaguiConfig['fonts']>
export type FontFamilyTokens = FontTokens
export type FontSize =
  | GetTokenString<GetTokenFontKeysFor<'size'>>
  | number
  | RemString
  | true

export type FontSizeTokens = FontSize
export type FontLineHeightTokens =
  | GetTokenString<GetTokenFontKeysFor<'lineHeight'>>
  | number
  | RemString
export type FontWeightValues =
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00`
  | 'bold'
  | 'normal'
export type FontWeightTokens =
  | GetTokenString<GetTokenFontKeysFor<'weight'>>
  | FontWeightValues
// font color tokens also support the opacity modifier
type FontColorTokenBase = GetTokenString<GetTokenFontKeysFor<'color'>>
export type FontColorTokens = FontColorTokenBase | number | TokenWithOpacity
export type FontLetterSpacingTokens =
  | GetTokenString<GetTokenFontKeysFor<'letterSpacing'>>
  | number
  | RemString
export type FontStyleTokens =
  | GetTokenString<GetTokenFontKeysFor<'style'>>
  | RNTextStyle['fontStyle']
export type FontTransformTokens =
  | GetTokenString<GetTokenFontKeysFor<'transform'>>
  | RNTextStyle['textTransform']

export type ParseFont<A extends GenericFont> = {
  size: TokenifyRecord<A['size']>
  lineHeight: TokenParsedIfExists<A['lineHeight']>
  letterSpacing: TokenParsedIfExists<A['letterSpacing']>
  weight: TokenParsedIfExists<A['weight']>
  family: TokenParsedIfExists<A['family']>
  style: TokenParsedIfExists<A['style']>
  transform: TokenParsedIfExists<A['transform']>
  color: TokenParsedIfExists<A['color']>
  face: TokenParsedIfExists<A['face']>
}

export type TokenParsedIfExists<A> =
  A extends Record<string, any> ? TokenifyRecord<A> : {}

//
// adds theme short values to relevant props
//

export type ThemeValueByCategory<K extends string | number | symbol> = K extends 'theme'
  ? ThemeTokens
  : K extends 'size'
    ? SizeTokens
    : K extends 'font'
      ? FontTokens
      : K extends 'fontSize'
        ? FontSizeTokens
        : K extends 'space'
          ? SpaceTokens
          : K extends 'color'
            ? ColorTokens
            : K extends 'zIndex'
              ? ZIndexTokens
              : K extends 'radius'
                ? RadiusTokens
                : K extends 'lineHeight'
                  ? FontLineHeightTokens
                  : K extends 'fontWeight'
                    ? FontWeightTokens
                    : K extends 'letterSpacing'
                      ? FontLetterSpacingTokens
                      : K extends keyof Tokens
                        ? // fallback to user-defined tokens
                          GetTokenString<keyof Tokens[K]>
                        : never

export type FontKeys = 'fontFamily'
export type FontSizeKeys = 'fontSize'
export type FontWeightKeys = 'fontWeight'
export type FontLetterSpacingKeys = 'letterSpacing'
export type LineHeightKeys = 'lineHeight'
export type ZIndexKeys = 'zIndex'
export type OpacityKeys = 'opacity'

export type ThemeValueGet<K extends string | number | symbol> = K extends 'theme'
  ? ThemeTokens
  : K extends SizeKeys
    ? SizeTokens
    : K extends FontKeys
      ? FontTokens
      : K extends FontSizeKeys
        ? FontSizeTokens
        : K extends `${`border${string | ''}Radius`}`
          ? RadiusTokens
          : K extends SpaceKeys
            ? K extends 'shadowOffset'
              ? { width: SpaceTokens; height: SpaceTokens }
              : SpaceTokens
            : K extends ColorKeys
              ? ColorTokens | ThemeValueFallbackColor
              : K extends ZIndexKeys
                ? ZIndexTokens
                : K extends LineHeightKeys
                  ? FontLineHeightTokens
                  : K extends FontWeightKeys
                    ? FontWeightTokens
                    : K extends FontLetterSpacingKeys
                      ? FontLetterSpacingTokens
                      : K extends OpacityKeys
                        ? ThemeValueFallback
                        : never

export type GetThemeValueForKey<K extends string | symbol | number> =
  | ThemeValueGet<K>
  | ThemeValueFallback

// keys that accept the first-class "safe" value (-> env(safe-area-inset-*) on
// web, numeric insets on native). must mirror propEdges in resolveSafeArea.ts.
// only the longhands are listed; shorthands (pt, mt, ...) inherit via WithShorthands.
export type SafeAreaValueKeys =
  | 'padding'
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'paddingStart'
  | 'paddingEnd'
  | 'paddingBlock'
  | 'paddingInline'
  | 'paddingBlockStart'
  | 'paddingBlockEnd'
  | 'paddingInlineStart'
  | 'paddingInlineEnd'
  | 'margin'
  | 'marginTop'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'marginStart'
  | 'marginEnd'
  | 'marginBlock'
  | 'marginInline'
  | 'marginBlockStart'
  | 'marginBlockEnd'
  | 'marginInlineStart'
  | 'marginInlineEnd'
  | 'inset'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'start'
  | 'end'

/**
 * Flat values: every style prop accepts either a clause-bearing string
 * (`bg="red hover:blue"`, `p="4 sm:6"`) or its flat object equivalent
 * (`bg={{ default: 'red', hover: 'blue' }}`). `(string & {})` admits the broad
 * string without collapsing the token/literal unions, so autocomplete
 * survives (design record, "Types and editor tooling"). Candidate and
 * modifier validation is the compiler's and language service's job.
 */
type ClauseModifierName =
  | (MediaQueryKey & string)
  | RootThemeName
  | CoreStateModifierName
  | `group-${CoreStateModifierName}`
  | AllPlatforms

/**
 * Object keys have no `(string & {})` escape hatch the way string values do,
 * so the container (`@sm`, `@sm/card`) and named-group (`group-hover/card`)
 * spellings need their own single-template arms.
 */
type FlatClauseName =
  | ClauseModifierName
  | `${ClauseModifierName}:${string}`
  | `@${string}`
  | `group-${CoreStateModifierName}/${string}`

/**
 * The structured twin of a flat clause string. It stays deliberately
 * non-recursive: the condition chain is the key, and every leaf keeps the
 * style property's value type. `(string & {})` rides along on each leaf for
 * the same reason it does on the whole value: the string form accepts any
 * payload text, and without it two `FlatStyleValue`s that differ only by
 * string members ('unset', a fallback union) stop being assignable across
 * package boundaries.
 */
export type FlatStyleObject<T> = { default?: T | (string & {}) } & {
  [K in FlatClauseName]?: T | (string & {})
}

/**
 * The string arm stays at base values only: `(string & {})` admits every
 * clause string, and structured clause completion comes from the object
 * form's keys (and the language-service plugin for strings). A per-prop
 * `${modifier}:` prefix union used to ride along for first-prefix
 * completion; it multiplied across the whole component prop graph and the
 * object form made it redundant.
 */
export type FlatStyleValue<T> = T | FlatStyleObject<T> | (string & {})

export type WithThemeValues<T extends object> = {
  [K in keyof T]:
    | (ThemeValueGet<K> extends never
        ? K extends keyof ExtraBaseProps
          ? T[K]
          : FlatStyleValue<T[K] | 'unset'>
        : FlatStyleValue<GetThemeValueForKey<K> | Exclude<T[K], string> | 'unset'>)
    | (K extends SafeAreaValueKeys ? 'safe' : never)
}

export type NarrowShorthands = Narrow<Shorthands>
export type Longhands = NarrowShorthands[keyof NarrowShorthands]

type OnlyAllowShorthands = TamaguiConfig['settings']['onlyAllowShorthands']
type OnlyShorthandStyleProps = TamaguiConfig['settings']['onlyShorthandStyleProps']

// longhand style props that overlap with border/outline/shadow shorthands
type ShorthandLonghandProps =
  | 'borderWidth'
  | 'borderStyle'
  | 'borderColor'
  | 'outlineWidth'
  | 'outlineStyle'
  | 'outlineColor'
  | 'outlineOffset'
  | 'shadowColor'
  | 'shadowOffset'
  | 'shadowOpacity'
  | 'shadowRadius'

// adds shorthand props
export type WithShorthands<StyleProps> = {
  [Key in keyof Shorthands]?: Shorthands[Key] extends keyof StyleProps
    ? StyleProps[Shorthands[Key]] | null
    : undefined
}

export type AllPlatforms =
  | 'web'
  | 'native'
  | 'android'
  | 'ios'
  | 'tv'
  | 'androidtv'
  | 'tvos'

// MUST EXPORT ALL IN BETWEEN or else it expands declarations like crazy

//
// add both theme and shorthands
//
type MaybeOmitLonghands<A> = OnlyShorthandStyleProps extends true
  ? Omit<A, ShorthandLonghandProps>
  : A

// variant props at the call site take the same conditional forms as style
// values: density="compact sm:roomy" and density={{ default: 'compact', sm: 'roomy' }}.
// the widening happens only here, at the final public props, so every
// definition-side type (defaultVariants, compound matchers, inheritance)
// keeps the exact branch-key unions
export type WithFlatVariantValues<Variants> = {
  [Key in keyof Variants]?: FlatStyleValue<NonNullable<Variants[Key]>>
}

export type WithThemeAndShorthands<
  A extends object,
  Variants = {},
> = OnlyAllowShorthands extends true
  ? WithThemeValues<MaybeOmitLonghands<Omit<A, Longhands>>> &
      WithFlatVariantValues<Variants> &
      WithShorthands<WithThemeValues<A>>
  : WithThemeValues<MaybeOmitLonghands<A>> &
      WithFlatVariantValues<Variants> &
      WithShorthands<WithThemeValues<A>>

/**
 * Base style-only props (no media, pseudo):
 */

type Px = `${string | number}px`
type PxOrPct = Px | `${string | number}%`
type TwoValueTransformOrigin = `${PxOrPct | 'left' | 'center' | 'right'} ${
  | PxOrPct
  | 'top'
  | 'center'
  | 'bottom'}`

export interface TransformStyleProps {
  /**
   * Maps to translateX
   */
  x?: number
  /**
   * Maps to translateY
   */
  y?: number
  perspective?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  skewX?: string
  skewY?: string
  matrix?: number[]
  rotate?: `${number}deg` | UnionableString
  rotateY?: `${number}deg` | UnionableString
  rotateX?: `${number}deg` | UnionableString
  rotateZ?: `${number}deg` | UnionableString
}

// box shadow presets - one example per pattern for autocomplete hints
type BoxShadowPreset =
  | '0 0' // offset only
  | '0 1px 2px' // offset + blur
  | '0 1px 2px 0' // offset + blur + spread
  | '0 1px 2px shadow-color' // offset + blur + color token
  | '0 1px 3px 0 shadow-color' // offset + blur + spread + color token
  | '0 4px 6px -1px shadow-color' // negative spread
  | 'inset 0 2px 4px shadow-color' // inset
  | 'none'

// Box Shadow - CSS string format (e.g. "0 4px 8px shadow-color")
// Supports embedded bare tokens that get resolved at runtime
export type BoxShadowValue = BoxShadowPreset | (string & {})

// filter presets - one example per function for autocomplete hints
type FilterPreset =
  | 'blur(4px)'
  | 'brightness(1.2)'
  | 'contrast(1.2)'
  | 'drop-shadow(0 4px 8px shadow-color)'
  | 'grayscale(1)'
  | 'hue-rotate(90deg)'
  | 'invert(1)'
  | 'opacity(0.5)'
  | 'saturate(1.5)'
  | 'sepia(1)'
  | 'none'

// Filter - CSS string format (e.g. "blur(10px) brightness(1.2)")
// Supports embedded bare tokens that get resolved at runtime
export type FilterValue = FilterPreset | (string & {})

// border shorthand presets - examples for autocomplete hints
type BorderPreset =
  | '1px solid' // width + style
  | '1px solid border-color' // width + style + color token
  | '2px dashed border-color' // width + style + color
  | '1px dotted red' // width + style + color
  | 'none'

// Border - CSS shorthand string format (e.g. "1px solid border-color")
// Expands to borderWidth, borderStyle, borderColor on web and native
// Note: on native, only supports a single border (all sides)
export type BorderValue = BorderPreset | (string & {})

// outline shorthand presets - examples for autocomplete hints
type OutlinePreset =
  | '1px solid' // width + style
  | '1px solid outline-color' // width + style + color token
  | '2px dashed outline-color' // width + style + color
  | '1px dotted red' // width + style + color
  | 'none'

// Outline - CSS shorthand string format (e.g. "2px solid outline-color")
// Expands to outlineWidth, outlineStyle, outlineColor on native
export type OutlineValue = OutlinePreset | (string & {})

interface ExtraStyleProps {
  /**
   * Text color, or a web-scoped color clause on a View.
   */
  color?: ColorStyleProp
  /**
   * Controls the curve style of rounded corners.
   * - 'circular': Standard circular arc corners (default)
   * - 'continuous': Apple's "squircle" style continuous curve
   * @platform iOS 13+
   */
  borderCurve?: 'circular' | 'continuous'
  /**
   * Web-only style property. Will be omitted on native.
   */
  contain?: Properties['contain']
  /**
   * Cursor style. On web, supports all CSS cursor values.
   * On iOS 17+ (trackpad/stylus), only 'auto' and 'pointer' are supported.
   */
  cursor?: Properties['cursor']
  /**
   * Outline color. Supported on web and native.
   */
  outlineColor?: ColorStyleProp
  /**
   * Outline offset. Supported on web and native.
   */
  outlineOffset?: SpaceValue
  /**
   * Outline style. Supported on web and native.
   */
  outlineStyle?: 'solid' | 'dotted' | 'dashed' | (string & {})
  /**
   * Outline width. Supported on web and native.
   */
  outlineWidth?: SpaceValue
  /**
   * CSS outline shorthand string. Supports tokens: "2px solid outline-color"
   * Expands to outlineWidth, outlineStyle, outlineColor on native.
   * Works on web and native.
   */
  outline?: OutlineValue
  /**
   * On native, maps to the `selectable` prop on Text (userSelect !== 'none')
   */
  userSelect?: Properties['userSelect']
  /**
   * Web-only style property. Will be omitted on native.
   */
  backdropFilter?: Properties['backdropFilter']
  /**
   * Works on web and native. Native lowers a single color value to
   * backgroundColor and drops url()/gradient/multi-part values it can't express.
   *
   * The v6 shorthands map `bg` here rather than to `backgroundColor`, because
   * the background family splits a value like `url(x.png) color1` across
   * backgroundImage and backgroundColor. Color tokens lead the union so `bg`
   * completes them; `Properties['background']` keeps the CSS shorthand
   * keywords. Adding this key to `ColorKeys` instead would erase that second
   * arm, since that path runs the value type through `Exclude<T[K], string>`.
   */
  background?: ColorTokens | Properties['background']
  /**
   * Web-only style property. Will be omitted on native.
   */
  backgroundImage?: Properties['backgroundImage']
  /**
   * Web-only style property. Will be omitted on native.
   */
  backgroundOrigin?: Properties['backgroundOrigin']
  /**
   * Web-only style property. Will be omitted on native.
   */
  backgroundPosition?: Properties['backgroundPosition']
  /**
   * Web-only style property. Will be omitted on native.
   */
  backgroundRepeat?: Properties['backgroundRepeat']
  /**
   * Web-only style property. Will be omitted on native.
   */
  backgroundSize?: Properties['backgroundSize']
  // boxSizing - provided by RN's ViewStyle
  /**
   * CSS box-shadow string. Supports tokens: "0 4px 8px shadow-color"
   * Works on web and native (RN 0.76+).
   */
  boxShadow?: BoxShadowValue
  /**
   * CSS border shorthand string. Supports tokens: "1px solid border-color"
   * Expands to borderWidth, borderStyle, borderColor.
   * Works on web and native. On native, applies to all sides.
   */
  border?: BorderValue
  /**
   * CSS logical border shorthand string, like `border` for the block axis.
   * Splits to the CSS logical longhands on web; native has no logical border
   * properties, so it is diagnosed and dropped there rather than approximated.
   */
  borderBlock?: BorderValue
  /**
   * CSS logical border shorthand string, like `border` for the inline axis.
   * Splits to the CSS logical longhands on web; native has no logical border
   * properties, so it is diagnosed and dropped there rather than approximated.
   */
  borderInline?: BorderValue
  /**
   * Web-only style property. Will be omitted on native.
   */
  overflowWrap?: Properties['overflowWrap']
  /**
   * Web-only legacy alias of overflowWrap. Will be omitted on native.
   */
  wordWrap?: Properties['wordWrap']
  /**
   * Web-only style property. Will be omitted on native.
   */
  resize?: Properties['resize']
  /**
   * Web-only style property. Will be omitted on native.
   */
  overflowX?: Properties['overflowX']
  /**
   * Web-only style property. Will be omitted on native.
   */
  overflowY?: Properties['overflowY']
  /**
   * Web-only text wrapping strategy. Will be omitted on native.
   */
  textWrap?: Properties['textWrap']
  /**
   * Web visibility. Native lowers hidden visibility to opacity and pointer events.
   */
  visibility?: Properties['visibility']

  pointerEvents?: ViewProps['pointerEvents']

  /**
   * The point at which transforms originate from.
   */
  transformOrigin?:
    | PxOrPct
    | 'left'
    | 'center'
    | 'right'
    | 'top'
    | 'bottom'
    | TwoValueTransformOrigin
    | `${TwoValueTransformOrigin} ${Px}`

  /**
   * CSS filter string. Example: "blur(10px) brightness(1.2)"
   * Works on web and native (RN 0.76+). Supports embedded tokens.
   */
  filter?: FilterValue
  // mixBlendMode - provided by RN's ViewStyle
  // isolation - provided by RN's ViewStyle
  /**
   * Web-only style property. Will be omitted on native.
   */
  backgroundClip?: Properties['backgroundClip']
  /**
   * Web-only style property. Will be omitted on native.
   */
  backgroundBlendMode?: Properties['backgroundBlendMode']
  /**
   * Web-only style property. Will be omitted on native.
   */
  backgroundAttachment?: Properties['backgroundAttachment']
  /**
   * Web-only style property. Will be omitted on native.
   */
  clipPath?: Properties['clipPath']
  /**
   * Web-only style property. Will be omitted on native.
   */
  caretColor?: Properties['caretColor']
  /**
   * Web-only style property. Will be omitted on native.
   */
  transformStyle?: Properties['transformStyle']
  /**
   * Web-only style property. Will be omitted on native.
   */
  mask?: Properties['mask']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskImage?: Properties['maskImage']
  /**
   * Web-only style property. Will be omitted on native.
   */
  textEmphasis?: Properties['textEmphasis']
  /**
   * Web-only style property. Will be omitted on native.
   */
  borderImage?: Properties['borderImage']
  /**
   * Web-only style property. Will be omitted on native.
   */
  float?: Properties['float']
  /**
   * Web-only style property. Will be omitted on native.
   */
  overflowBlock?: Properties['overflowBlock']
  /**
   * Web-only style property. Will be omitted on native.
   */
  overflowInline?: Properties['overflowInline']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskBorder?: Properties['maskBorder']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskBorderMode?: Properties['maskBorderMode']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskBorderOutset?: Properties['maskBorderOutset']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskBorderRepeat?: Properties['maskBorderRepeat']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskBorderSlice?: Properties['maskBorderSlice']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskBorderSource?: Properties['maskBorderSource']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskBorderWidth?: Properties['maskBorderWidth']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskClip?: Properties['maskClip']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskComposite?: Properties['maskComposite']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskMode?: Properties['maskMode']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskOrigin?: Properties['maskOrigin']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskPosition?: Properties['maskPosition']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskRepeat?: Properties['maskRepeat']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskSize?: Properties['maskSize']
  /**
   * Web-only style property. Will be omitted on native.
   */
  maskType?: Properties['maskType']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridRow?: Properties['gridRow']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridRowEnd?: Properties['gridRowEnd']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridRowGap?: Properties['gridRowGap']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridRowStart?: Properties['gridRowStart']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridColumn?: Properties['gridColumn']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridColumnEnd?: Properties['gridColumnEnd']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridColumnGap?: Properties['gridColumnGap']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridColumnStart?: Properties['gridColumnStart']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridTemplateColumns?: Properties['gridTemplateColumns']
  /**
   * Web-only style property. Will be omitted on native.
   */
  gridTemplateAreas?: Properties['gridTemplateAreas']

  /**
   * Web-only style property. Will be omitted on native.
   */
  containerType?: Properties['containerType']
  /**
   * Names this element as a query container for `@sm/name:`-style clauses.
   * Lowers to CSS `container-name` on web; on native it configures the
   * container context instead of emitting a style.
   */
  containerName?: string
  /**
   * Web-only style property. Will be omitted on native.
   */
  blockSize?: SizeTokens | number
  /**
   * Web-only style property. Will be omitted on native.
   */
  inlineSize?: SizeTokens | number
  /**
   * Web-only style property. Will be omitted on native.
   */
  minBlockSize?: SizeTokens | number
  /**
   * Web-only style property. Will be omitted on native.
   */
  maxBlockSize?: SizeTokens | number
  /**
   * Web-only style property. Will be omitted on native.
   */
  objectFit?: Properties['objectFit']
  /**
   * Web-only style property. Will be omitted on native.
   */
  verticalAlign?: Properties['verticalAlign']
  /**
   * Web-only style property. Will be omitted on native.
   */
  minInlineSize?: SizeTokens | number
  /**
   * Web-only style property. Will be omitted on native.
   */
  maxInlineSize?: SizeTokens | number
  /**
   * Web-only style property. Will be omitted on native.
   */
  borderInlineColor?: ColorTokens
  /**
   * Web-only style property. Will be omitted on native.
   */
  borderInlineStartColor?: ColorTokens
  /**
   * Web-only style property. Will be omitted on native.
   */
  borderInlineEndColor?: ColorTokens

  // TODO validate these are supported in react native, if so keep, if not deprecate like the above web-only deprecations
  borderBlockWidth?: SpaceTokens | number
  borderBlockStartWidth?: SpaceTokens | number
  borderBlockEndWidth?: SpaceTokens | number
  borderInlineWidth?: SpaceTokens | number
  borderInlineStartWidth?: SpaceTokens | number
  borderInlineEndWidth?: SpaceTokens | number
  borderBlockStyle?: ViewStyle['borderStyle']
  borderBlockStartStyle?: ViewStyle['borderStyle']
  borderBlockEndStyle?: ViewStyle['borderStyle']
  borderInlineStyle?: ViewStyle['borderStyle']
  borderInlineStartStyle?: ViewStyle['borderStyle']
  borderInlineEndStyle?: ViewStyle['borderStyle']
  marginBlock?: SpaceTokens | number
  marginBlockStart?: SpaceTokens | number
  marginBlockEnd?: SpaceTokens | number
  marginInline?: SpaceTokens | number
  marginInlineStart?: SpaceTokens | number
  marginInlineEnd?: SpaceTokens | number
  paddingBlock?: SpaceTokens | number
  paddingBlockStart?: SpaceTokens | number
  paddingBlockEnd?: SpaceTokens | number
  paddingInline?: SpaceTokens | number
  paddingInlineStart?: SpaceTokens | number
  paddingInlineEnd?: SpaceTokens | number
  inset?: SpaceTokens | number
  insetBlock?: SpaceTokens | number
  insetBlockStart?: SpaceTokens | number
  insetBlockEnd?: SpaceTokens | number
  insetInline?: SpaceTokens | number
  insetInlineStart?: SpaceTokens | number
  insetInlineEnd?: SpaceTokens | number
}

export interface ExtendBaseStackProps {}
export interface ExtendBaseTextProps {}

interface ExtraBaseProps {
  /**
   * Transitions are defined using `createTamagui` typically in a tamagui.config.ts file.
   * Pass a string transition name here and it uses an animation driver to execute it.
   *
   * See: https://tamagui.dev/docs/core/animations
   */
  transition?: TransitionProp | null

  /**
   * Pass an array of strings containing the long style property names
   * which will be exclusively transitioned.
   */
  animateOnly?: string[]

  /**
   * If you'd like this component to not attach to the nearest parent AnimatePresence,
   * set this to `false` and it will pass through to the next animated child.
   */
  animatePresence?: boolean

  /**
   * Called by the animation driver at the start and end of each transition
   * (enter, exit, or an in-place style update). See `TransitionEvent`.
   */
  onTransition?: OnTransition

  /**
   * Avoids as much work as possible and passes through the children with no changes.
   * Advanced: Useful for adapting to other element when you want to avoid re-parenting.
   */
  passThrough?: boolean
}

interface ExtendedBaseProps
  extends
    TransformStyleProps,
    ExtendBaseTextProps,
    ExtendBaseStackProps,
    ExtraStyleProps,
    ExtraBaseProps {
  display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
  // extends RN's position to include 'fixed' (converted to 'absolute' on native)
  position?: 'absolute' | 'relative' | 'fixed' | 'static' | 'sticky'
}

export interface StackStyleBase
  extends Omit<ViewStyle, keyof ExtendedBaseProps | 'elevation'>, ExtendedBaseProps {}

export interface TextStylePropsBase
  extends Omit<RNTextStyle, keyof ExtendedBaseProps>, ExtendedBaseProps {
  ellipsis?: boolean
  numberOfLines?: number
  textDecorationDistance?: number
  textOverflow?: Properties['textOverflow']
  whiteSpace?: Properties['whiteSpace']
  wordWrap?: Properties['wordWrap']
  /**
   * CSS text-shadow string. Supports tokens: "2px 2px 4px shadow-color"
   * On native, only a single shadow is supported.
   */
  textShadow?: string
  /**
   * CSS text-decoration shorthand string ("underline dotted red").
   * Splits to line/style/color; on native the three RN longhand props.
   */
  textDecoration?: string
  /**
   * CSS font shorthand string ("italic bold 16px/1.5 Inter").
   * Splits by the CSS micro-syntax; ambiguous forms stay unparsed.
   */
  font?: string
}

//
// View
//

type LooseCombinedObjects<A extends object, B extends object> = A | B | (A & B)

// v2: Removed A11yDeprecated - use web-standard props instead:
// - accessibilityLabel → aria-label
// - accessibilityRole → role
// - accessibilityHint → aria-describedby
// - accessibilityState → aria-disabled, aria-selected, aria-checked, aria-busy, aria-expanded
// - accessibilityValue → aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext
// - accessibilityElementsHidden → aria-hidden
// - accessibilityViewIsModal → aria-modal
// - accessibilityLiveRegion → aria-live
// - accessible → tabIndex={0}
// - nativeID → id

export interface StackNonStyleProps
  extends
    Omit<
      ViewProps,
      | 'hitSlop' //  we bring our own via Pressable in TamaguiComponentPropsBase
      | 'pointerEvents'
      | 'display'
      | 'children'
      | keyof TamaguiComponentPropsBaseBase
      // these are added back in by core
      | RNOnlyProps
      | keyof ExtendBaseStackProps
      | 'style'
      // Event handlers that conflict between RN ViewProps and Web DivAttributes
      | 'onFocus'
      | 'onBlur'
      | 'onPointerCancel'
      | 'onPointerDown'
      | 'onPointerMove'
      | 'onPointerUp'
    >,
    ExtendBaseStackProps,
    TamaguiComponentPropsBase {
  // we allow either RN or web style props, of course only web css props only works on web
  style?: StyleProp<LooseCombinedObjects<React.CSSProperties, ViewStyle>>
}

export type StackStyle = WithThemeAndShorthands<StackStyleBase>

//
// Text props
//

export interface TextNonStyleProps
  extends
    Omit<
      ReactTextProps,
      | 'children'
      | keyof WebOnlyPressEvents
      // these are added back in by core
      | RNOnlyProps
      | keyof ExtendBaseTextProps
      | 'style'
      // web-standard `userSelect` is the one authoring name; core maps it to
      // RN's `selectable` prop on native
      | 'selectable'
      // the style side owns these as flat-value style props; intersecting
      // RN's plain unions would strip the clause string and object forms
      | 'numberOfLines'
      | 'pointerEvents'
    >,
    ExtendBaseTextProps,
    TamaguiComponentPropsBase {
  // we allow either RN or web style props, of course only web css props only works on web
  style?: StyleProp<LooseCombinedObjects<React.CSSProperties, RNTextStyle>>
}

export type TextStyle = WithThemeAndShorthands<TextStylePropsBase>

export type TextProps = TextNonStyleProps & TextStyle

export interface ThemeableProps {
  theme?: ThemeName | null
  themeReset?: boolean
  debug?: DebugProp
}

export type StyledHOCOptions = {
  disableTheme?: boolean
  displayName?: string
  staticConfig?: Partial<StaticConfig>
}

// merges an annotated render-fn props type over the wrapped component's props.
// when the render fn param is unannotated CustomProps stays {} and the wrapped
// component's props pass through untouched.
export type StyledHOCMergedProps<Props, CustomProps> = keyof CustomProps extends never
  ? Props
  : Omit<Props, keyof CustomProps> & CustomProps

export type GetFinalProps<NonStyleProps, StylePropsBase, Variants> = Omit<
  NonStyleProps,
  keyof StylePropsBase | keyof Variants
> &
  (StylePropsBase extends object ? WithThemeAndShorthands<StylePropsBase, Variants> : {})

export type TamaguiComponent<
  Props = any,
  Ref = any,
  NonStyledProps = {},
  BaseStyles extends object = {},
  Variants = {},
  ParentStaticProperties = {},
> = FunctionComponent<
  (Props extends TamaDefer
    ? GetFinalProps<NonStyledProps, BaseStyles, Variants>
    : Props) & { ref?: ReactRef<Ref> }
> &
  StaticComponentObject<
    Props,
    Ref,
    NonStyledProps,
    BaseStyles,
    Variants,
    ParentStaticProperties
  > &
  Omit<ParentStaticProperties, 'staticConfig'> & {
    __tama: [Props, Ref, NonStyledProps, BaseStyles, Variants, ParentStaticProperties]
  }

export type InferGenericComponentProps<A> =
  A extends ComponentType<infer Props>
    ? Props
    : A extends ReactComponentWithRef<infer P, any>
      ? P
      : A extends new (props: infer Props) => any
        ? Props
        : {}

export type InferStyledProps<
  A extends StylableComponent,
  B extends StaticConfigPublic,
> = A extends {
  __tama: any
}
  ? GetProps<A>
  : GetFinalProps<InferGenericComponentProps<A>, GetBaseStyles<{}, B>, {}>

/** Like InferStyledProps but returns only style props (no non-styled props or variants). */
export type InferStyleProps<
  A extends StylableComponent,
  B extends StaticConfigPublic,
> = WithThemeAndShorthands<GetBaseStyles<A, B>, {}>

export type GetProps<A extends StylableComponent> = A extends {
  __tama: [
    infer Props,
    any,
    infer NonStyledProps,
    infer BaseStyles,
    infer VariantProps,
    any,
  ]
}
  ? Props extends TamaDefer
    ? GetFinalProps<NonStyledProps, BaseStyles, VariantProps>
    : Props
  : InferGenericComponentProps<A>

export type GetNonStyledProps<A extends StylableComponent> = A extends {
  __tama: [any, any, infer B, any, any, any]
}
  ? B
  : TamaguiComponentPropsBaseBase & GetProps<A>

export type GetBaseStyles<A, B> = A extends {
  __tama: [any, any, any, infer C, any, any]
}
  ? // when extending an existing tamagui component (e.g. styled(View, ...)), it
    // contributes its base styles. but isText/isInput in the config still means
    // "this accepts text styles" (it drives runtime validStyles too), so merge
    // text style props in, otherwise text-only props and their shorthands (e.g.
    // the `text` shorthand for `textAlign`) get dropped from the type.
    B extends { isText: true } | { isInput: true }
    ? C & TextStylePropsBase
    : C
  : B extends { isText: true }
    ? TextStylePropsBase
    : B extends { isInput: true }
      ? TextStylePropsBase
      : StackStyleBase

export type GetStyledVariants<A> = A extends {
  __tama: [any, any, any, any, infer B, any]
}
  ? B
  : {}

export type GetStaticConfig<A, Extra = {}> = A extends {
  __tama: [any, any, any, any, any, infer B]
}
  ? B & Extra
  : Extra

export type StaticComponentObject<
  Props,
  Ref,
  NonStyledProps,
  BaseStyles extends object,
  VariantProps,
  ParentStaticProperties,
> = {
  staticConfig: StaticConfig
}

export type TamaguiComponentExpectingVariants<
  Props = {},
  Variants extends object = {},
> = TamaguiComponent<Props, any, any, any, Variants>

export type TamaguiProviderProps = Omit<ThemeProviderProps, 'children'> & {
  config?: TamaguiInternalConfig
  disableInjectCSS?: boolean
  children?: ReactNode
  insets?: { top: number; right: number; bottom: number; left: number }
}

// entry[3] is the raw modifier source of a conditional variant clause
// (`"sm"` in `density="compact sm:roomy"`), present only on clause entries
export type PropMappedValue = [string, any, any?, string?][] | undefined

export type GetStyleState = {
  style: TextStyle | null
  classNames: ClassNamesObject
  staticConfig: StaticConfig
  theme: ThemeParsed
  props: Record<string, any>
  context?: ComponentContextI
  viewProps: Record<string, any>
  styleProps: SplitStyleProps
  componentState: TamaguiComponentState
  conf: TamaguiInternalConfig
  avoidMergeTransform?: boolean
  fontFamily?: string
  debug?: DebugProp
  transformAccumulator?: TransformAccumulator
  // direct flat-value scan context and its subscription output
  flatRulesToInsert?: RulesToInsert
  flatShouldDoClasses?: boolean
  flatThemeName?: string
  flatMediaState?: Record<string, boolean | undefined>
  flatGroupContext?: AllGroupContexts | null
  flatConditionOrder?: number
  flatActiveConditions?: Record<string, true>
  flatStateKeys?: Set<string>
  flatMediaKeys?: Set<string>
  flatGroupKeys?: Set<string>
  flatGroupMedia?: Set<string>
  flatEnterKeys?: Set<string>
  flatExitKeys?: Set<string>
  flatHasEnterStyle?: boolean
  flatHasPlatformPseudo?: boolean
  flatInlineWinners?: Record<
    string,
    {
      value: any
      originalValue: any
      precedence: number
      conditioned: boolean
    }
  >
  flatUsesSafeArea?: boolean
  // Track style values that override context props (for issues #3670, #3676)
  overriddenContextProps?: Record<string, any>
  // Track original token values before they get resolved to CSS vars
  // This is used to preserve token strings in overriddenContextProps
  originalContextPropValues?: Record<string, any>
  // opt-in dev-tools token provenance: original token string
  // for each winning base style key, cleared on literal override. stamped onto
  // the final style object as non-enumerable metadata (see helpers/styleProvenance).
  tokenProvenance?: Record<string, string>
  // Resolved animation driver (respects animatedBy prop)
  animationDriver?: AnimationDriver | null
}

export type StyleResolver<Response = PropMappedValue> = (
  key: string,
  value: any,
  props: SplitStyleProps,
  state: GetStyleState,
  parentVariantKey: string
) => Response

export type PropMapper = (
  key: string,
  value: any,
  state: GetStyleState,
  disabled: boolean,
  // condition is an opaque resolved-condition handle owned by getSplitStyles
  map: (key: string, val: any, originalVal?: any, condition?: object) => void
) => void

export type GenericVariantDefinitions = {
  [key: string]: {
    [key: string]:
      | ((a: any, b: any) => any)
      | StaticStyleInput
      | {
          [key: string]: any
        }
  }
}

export type CompoundVariantDefinition<
  MatchProps extends Record<string, any> = Record<string, any>,
  StyleProps extends Record<string, any> = Record<string, any>,
> = {
  [Key in keyof MatchProps]?: MatchProps[Key] | readonly MatchProps[Key][]
} & {
  style: StyleProps | StaticStyleInput
}

export type GenericCompoundVariant = CompoundVariantDefinition<
  Record<string, any>,
  Record<string, any>
>

export type StaticConfigPublic = {
  defaultProps?: Record<string, any>

  /** Static class input supplied to styled(Component, baseClassName, ...). */
  baseClassName?: StaticStyleInput

  /**
   * (compiler) If you need to pass context or something, prevents from ever
   * flattening. The 'jsx' option means it will never flatten. if you
   * pass JSX as a children (if its purely string, it will still flatten).
   */
  neverFlatten?: boolean | 'jsx'

  /**
   * Adds support for text props and handles focus properly
   */
  isInput?: boolean

  /**
   * Determines ultimate output tag (Text vs View)
   */
  isText?: boolean

  /**
   * Which style keys are allowed to be extracted.
   */
  validStyles?: { [key: string]: boolean }

  /**
   * Accept Tamagui tokens for these props (key for the prop key, val for the token category)
   */
  accept?: {
    [key: string]: keyof Tokens | 'style' | 'textStyle'
  }

  /**
   * (compiler) If these props are encountered, leave them un-extracted.
   */
  inlineProps?: Set<string>

  /**
   * Props that reach `Component` even though the platform prop-skip list drops
   * them. The native DOM primitives build their own event payloads, so a DOM
   * frame's `onClick` is the primitive's input, not a web-only prop.
   */
  neverSkipProps?: Record<string, 1>

  /**
   * Auto-detected, but can override. Wraps children to space them on top
   */
  isZStack?: boolean

  /**
   * Auto-detect, but can override, passes styles properly to react-native-web
   */
  isReactNative?: boolean

  /**
   * By default if styled() doesn't recognize a parent Tamagui component or specific react-native views,
   * it will assume the passed in component only accepts style={} for react-native compatibility.
   * Setting `acceptsClassName: true` indicates Tamagui can pass in className props.
   */
  acceptsClassName?: boolean

  /**
   * memoizes component, rarely useful except mostly style components that don't take children
   */
  memo?: boolean

  compoundVariants?: readonly GenericCompoundVariant[]

  contextProps?: readonly string[]
}

type StaticConfigBase = StaticConfigPublic & {
  Component?: FunctionComponent<any> & StaticComponentObject<any, any, any, any, any, any>

  baseStyle?: Record<string, any>

  variants?: GenericVariantDefinitions

  compoundVariants?: readonly GenericCompoundVariant[]

  context?: StyledContext

  contextProps?: readonly string[]

  /**
   * Merges into defaultProps later on, used internally only
   */
  defaultVariants?: { [key: string]: any }

  /**
   * Memoize the component
   */
  memo?: boolean

  /**
   * Used internally for knowing how to handle when a HOC is in-between styled()
   */
  isHOC?: boolean

  // Tracks when styled() wraps a HOC that already wraps styled().
  isStyledHOC?: boolean

  /**
   * The immutable authoring syntax of this component, set by the package that
   * created it and inherited by styled() descendants. Absent means the regular
   * Tamagui frontend (see `regularStyleFrontend`).
   */
  styleFrontend?: StyleFrontend

  /**
   * Raw classes from `baseClassName` that the frontend did not claim, produced by
   * the descriptor's `normalizeStaticConfig`. They stay a class string so the app's
   * own CSS still applies them, and stay out of `baseStyle` because that object
   * holds styles only.
   */
  passthroughClassName?: string
}

export type StaticConfig = StaticConfigBase & {
  parentStaticConfig?: StaticConfigBase
}

export type ViewStyleObject = TextStyle

/**
 * --------------------------------------------
 *   variants
 * --------------------------------------------
 */

export type StylableComponent =
  | TamaguiComponent
  | ComponentType<any>
  | ReactComponentWithRef<any, any>
  | (new (props: any) => any)

export const variantResolverNames = [
  'Size',
  'Space',
  'Color',
  'Radius',
  'ZIndex',
  'Theme',
  'FontSize',
  'FontStyle',
  'FontTransform',
  'FontLineHeight',
  'FontLetterSpacing',
  'number',
  'string',
  'boolean',
  'any',
] as const

export type VariantResolverName = (typeof variantResolverNames)[number]

type TrimWhitespace = ' ' | '\n' | '\t' | '\r' | '\v' | '\f'

type Trim<S extends string> = S extends `${TrimWhitespace}${infer Next}`
  ? Trim<Next>
  : S extends `${infer Next}${TrimWhitespace}`
    ? Trim<Next>
    : S

type ValidateVariantResolverKey<Key extends string> =
  Trim<Key> extends `${infer Left}|${infer Right}`
    ? Trim<Left> extends VariantResolverName
      ? ValidateVariantResolverKey<Right> extends never
        ? never
        : Key
      : never
    : Trim<Key> extends VariantResolverName
      ? Key
      : never

export type VariantResolverKey<Key extends string = string> = Key extends string
  ? ValidateVariantResolverKey<Key>
  : never

type VariantResolverValueForName<Name extends string> = Name extends 'Size'
  ? Size
  : Name extends 'Space'
    ? Space
    : Name extends 'Color'
      ? Color
      : Name extends 'Radius'
        ? Radius
        : Name extends 'ZIndex'
          ? ZIndex
          : Name extends 'Theme'
            ? ThemeTokens
            : Name extends 'FontSize'
              ? FontSize
              : Name extends 'FontStyle'
                ? FontStyleTokens
                : Name extends 'FontTransform'
                  ? FontTransformTokens
                  : Name extends 'FontLineHeight'
                    ? FontLineHeightTokens
                    : Name extends 'FontLetterSpacing'
                      ? FontLetterSpacingTokens
                      : Name extends 'number'
                        ? number
                        : Name extends 'string'
                          ? string
                          : Name extends 'boolean'
                            ? boolean
                            : Name extends 'any'
                              ? any
                              : never

export type VariantResolverValue<Key extends string> =
  Trim<Key> extends `${infer Left}|${infer Right}`
    ? VariantResolverValueForName<Trim<Left>> | VariantResolverValue<Right>
    : VariantResolverValueForName<Trim<Key>>

export function createVariantResolver<
  Key extends string,
  Props extends PropLike = PropLike,
  Resolver extends VariantSpreadFunction<Props, VariantResolverValue<Key>> =
    VariantSpreadFunction<Props, VariantResolverValue<Key>>,
>(
  key: string extends Key ? never : Key & VariantResolverKey<Key>,
  resolver: Resolver
): Resolver {
  return resolver
}

export type VariantDefinitions<
  Parent extends StylableComponent = TamaguiComponent,
  StaticConfig extends StaticConfigPublic = Parent extends {
    __tama: [any, any, any, any, any, infer S]
  }
    ? S
    : {},
  MyProps extends object = Partial<
    GetVariantProps<
      Parent,
      StaticConfig['isText'] extends true
        ? true
        : StaticConfig['isInput'] extends true
          ? true
          : false
    >
  >,
  Val = any,
> = VariantDefinitionFromProps<MyProps, Val> & {
  _isEmpty?: 1
}

export type StaticStyleInput = string

export type GetVariantProps<
  A extends StylableComponent,
  IsText extends boolean | undefined,
> = A extends {
  __tama: [
    infer Props,
    any,
    infer NonStyledProps,
    infer BaseStyles,
    infer VariantProps,
    any,
  ]
}
  ? Props extends TamaDefer
    ? GetFinalProps<NonStyledProps, BaseStyles, VariantProps>
    : Props
  : WithThemeAndShorthands<IsText extends true ? TextStylePropsBase : StackStyleBase>

export type VariantDefinitionFromProps<MyProps, Val> = MyProps extends object
  ? {
      [propName: string]:
        | VariantSpreadFunction<MyProps, Val>
        | {
            [Key in string | number | 'true' | 'false']?:
              | MyProps
              | VariantSpreadFunction<MyProps, Val>
              | StaticStyleInput
          }
    }
  : {}

export type GenericStackVariants = VariantDefinitionFromProps<
  StackNonStyleProps & StackStyle,
  any
>
export type GenericTextVariants = VariantDefinitionFromProps<TextProps, any>

export type VariantSpreadExtras<Props> = {
  fonts: TamaguiConfig['fonts']
  tokens: TokensParsed
  theme: Themes extends { [key: string]: infer B } ? B : unknown
  props: Props
  fontFamily?: FontFamilyTokens
  font?: Font
}

type PropLike = { [key: string]: any }

export type VariantSpreadFunction<Props extends PropLike, Val = any> = (
  val: Val,
  config: VariantSpreadExtras<Props>
) =>
  | {
      [Key in keyof Props]: Props[Key] | Variable | VariableVal
    }
  | null
  | undefined

export type FontSizeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  FontSizeTokens
>
export type SizeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  SizeTokens
>
export type SpaceVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  SpaceTokens
>
export type ColorVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  ColorTokens
>
export type FontLineHeightVariantSpreadFunction<A extends PropLike> =
  VariantSpreadFunction<A, FontLineHeightTokens>
export type FontLetterSpacingVariantSpreadFunction<A extends PropLike> =
  VariantSpreadFunction<A, FontLetterSpacingTokens>
export type FontStyleVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  FontStyleTokens
>
export type FontTransformVariantSpreadFunction<A extends PropLike> =
  VariantSpreadFunction<A, FontTransformTokens>
export type ZIndexVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  ZIndexTokens
>
export type RadiusVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  RadiusTokens
>
export type ThemeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  ThemeTokens
>

/**
 * --------------------------------------------
 *   end variants
 * --------------------------------------------
 */

export type ResolveVariableAs =
  | 'auto'
  | 'value'
  | 'variable'
  | 'none'
  | 'web'
  | 'except-theme'

export type SplitStyleProps = {
  displayName?: string
  styledContext?: Record<string, any>
  styledContextKeys?: Set<string>
  mediaState?: Record<string, boolean>
  noClass?: boolean
  noExpand?: boolean
  noNormalize?: boolean | 'values'
  noSkip?: boolean
  noMergeStyle?: boolean
  resolveValues?: ResolveVariableAs
  disableExpandShorthands?: boolean
  hasTextAncestor?: boolean
  // for animations
  willBeAnimated?: boolean // we need to track media queries even before animation
  canPlatformPseudo?: boolean
  isAnimated: boolean
  isExiting?: boolean
}

// Presence

export interface PresenceContextProps {
  id: string
  isPresent: boolean
  register: (id: string) => () => void
  onExitComplete?: (id: string) => void
  initial?: false | string | string[]
  custom?: any
}

type SafeToRemoveCallback = () => void
type AlwaysPresent = [true, null, null]
type Present = [true, undefined, PresenceContextProps]
type NotPresent = [false, SafeToRemoveCallback, PresenceContextProps]

export type UsePresenceResult = AlwaysPresent | Present | NotPresent

export type PresenceRegistration = {
  shouldRegisterPresence?: boolean
}

// Animations:

type AnimationConfig = {
  [key: string]: any
}

// adapter between driver implementations for imperative number => style mapping

export type AnimatedNumberStrategy =
  // only values shared between reanimated/react-native for now
  | {
      type: 'spring'
      stiffness?: number
      damping?: number
      mass?: number
      overshootClamping?: boolean
      restSpeedThreshold?: number
      restDisplacementThreshold?: number
    }
  | { type: 'timing'; duration: number }
  | { type: 'direct' }

export type UniversalAnimatedNumber<A> = {
  getInstance(): A
  getValue(): number
  setValue(next: number, config?: AnimatedNumberStrategy, onFinished?: () => void): void
  stop(): void
}

export type UseAnimatedNumberReaction<
  V extends UniversalAnimatedNumber<any> = UniversalAnimatedNumber<any>,
> = (
  opts: {
    value: V
    hostRef: RefObject<TamaguiElement>
  },
  onValue: (current: number) => void
) => void

export type UseAnimatedNumberStyle<
  V extends UniversalAnimatedNumber<any> = UniversalAnimatedNumber<any>,
> = (val: V, getStyle: (current: any) => any) => any

export type UseAnimatedNumbersStyle<
  V extends UniversalAnimatedNumber<any> = UniversalAnimatedNumber<any>,
> = (vals: V[], getStyle: (...currentValues: any[]) => any) => any

export type UseAnimatedNumber<
  N extends UniversalAnimatedNumber<any> = UniversalAnimatedNumber<any>,
> = (initial: number) => N

type AnimationDriverBase<A extends AnimationConfig = AnimationConfig> = {
  isReactNative?: boolean
  /** What style format the driver expects as input: 'css' (CSS variables) or 'value' (resolved values) */
  inputStyle?: 'css' | 'value'
  /** How the driver outputs styles: 'css' (className-based) or 'inline' (style object) */
  outputStyle?: 'css' | 'inline'
  needsCustomComponent?: boolean
  avoidReRenders?: boolean
  onMount?: () => void
  animations: A
  View?: any
  Text?: any
}

export type AnimationDriver<A extends AnimationConfig = AnimationConfig> =
  AnimationDriverBase<A> & {
    /** When true, this is a stub driver with no real animation support */
    isStub?: boolean
    useAnimations: UseAnimationHook
    usePresence: (registration?: PresenceRegistration) => UsePresenceResult
    ResetPresence: (props: {
      children?: React.ReactNode
      disabled?: boolean
    }) => React.ReactNode
  }

export type AnimationDriverWithAnimatedNumbers<
  A extends AnimationConfig = AnimationConfig,
> = AnimationDriver<A> & {
  useAnimatedNumber: UseAnimatedNumber
  useAnimatedNumberStyle: UseAnimatedNumberStyle
  useAnimatedNumbersStyle: UseAnimatedNumbersStyle
  useAnimatedNumberReaction: UseAnimatedNumberReaction
}

export type AnimationDriverStub<A extends AnimationConfig = AnimationConfig> =
  AnimationDriverBase<A> & {
    isStub: true
  }

export type AnimationDriverLike<A extends AnimationConfig = AnimationConfig> =
  | AnimationDriver<A>
  | AnimationDriverStub<A>

export type UseAnimationProps = TamaguiComponentPropsBase & Record<string, any>

type UseStyleListener = (
  nextStyle: Record<string, unknown>,
  effectiveTransition?: TransitionProp | null,
  // true while a self pseudo (hover/press/focus) is active. lets avoidReRenders drivers know
  // the emitted style is a transient pseudo override that a real re-render must not be allowed
  // to reconcile away, vs the no-pseudo base which renders own again.
  pseudoActive?: boolean
) => void
export type UseStyleEmitter = (cb: UseStyleListener) => void

export type UseAnimationHook = (props: {
  style: Record<string, any>
  props: Record<string, any>
  styleState?: GetStyleResult | null
  presence?: UsePresenceResult | null
  staticConfig: StaticConfig
  styleProps: SplitStyleProps
  componentState: TamaguiComponentState
  useStyleEmitter?: UseStyleEmitter
  theme: ThemeParsed
  themeName: string
  stateRef: { current: TamaguiComponentStateRef }
  onTransition?: OnTransition
  delay?: number
}) => null | {
  style?: unknown
  className?: string
  ref?: any
}

export type GestureReponderEvent =
  Exclude<View['props']['onResponderMove'], void> extends (event: infer Event) => void
    ? Event
    : never

export type RulesToInsert = Record<string, StyleObject>

export type GetStyleResult = {
  style: ViewStyle | null
  classNames: ClassNamesObject
  rulesToInsert: RulesToInsert
  viewProps: (StackNonStyleProps & StackStyle) & Record<string, any>
  fontFamily: string | undefined
  space?: any // SpaceTokens?
  hasMedia: boolean | Set<string>
  pseudoGroups?: Set<string>
  mediaGroups?: Set<string>
  dynamicThemeAccess?: boolean
  // Style values that override context props (for issues #3670, #3676)
  overriddenContextProps?: Record<string, any>
  // interaction states referenced by flat-value clauses, so createComponent
  // attaches the matching event handlers. the field name remains for the
  // compiler host contract.
  programStates?: Set<string>
  // subscribe this component to live safe-area insets
  usesSafeArea?: true
  // the transition selected by active flat-value clauses
  effectiveTransition?: TransitionProp | null
  // css properties controlled by active lifecycle clauses. internal
  // animation-driver metadata; authored condition objects never enter
  // this contract.
  programLifecycleStyleKeys?: {
    enter?: Set<string>
    exit?: Set<string>
  }
  hasEnterStyle?: true
  platformPseudo?: true
}

export type ClassNamesObject = Record<string, string>

export type ModifyTamaguiComponentStyleProps<
  Comp extends TamaguiComponent,
  ChangedProps extends object,
> =
  Comp extends TamaguiComponent<infer A, infer B, infer C, infer D, infer E>
    ? A extends object
      ? TamaguiComponent<Omit<A, keyof ChangedProps> & ChangedProps, B, C, D, E>
      : never
    : never

/**
 * Narrow copied from ts-toolbelt
 * https://github.com/millsp/ts-toolbelt/blob/master/sources/Function/Narrow.ts
 */
export type Try<A1, A2, Catch = never> = A1 extends A2 ? A1 : Catch

type Narrowable = string | number | bigint | boolean

type NarrowRaw<A> =
  | (A extends [] ? [] : never)
  | (A extends Narrowable ? A : never)
  | {
      [K in keyof A]: A[K] extends Function ? A[K] : NarrowRaw<A[K]>
    }

export type Narrow<A> = Try<A, [], NarrowRaw<A>>

/**
 * `StyleProp` copied from React Native:
 *  Exported to fix https://github.com/tamagui/tamagui/issues/1258
 */

export type Falsy = undefined | null | false | ''
export interface RecursiveArray<T> extends Array<
  T | ReadonlyArray<T> | RecursiveArray<T>
> {}
/** Keep a brand of 'T' so that calls to `StyleSheet.flatten` can take `RegisteredStyle<T>` and return `T`. */

export type RegisteredStyle<T> = number & { __registeredStyleBrand: T }

export type StyleProp<T> =
  | T
  | RegisteredStyle<T>
  | RecursiveArray<T | RegisteredStyle<T> | Falsy>
  | Falsy

export type FillInFont<A extends GenericFont, DefaultKeys extends string | number> = {
  family: string
  lineHeight: FillInFontValues<A, 'lineHeight', DefaultKeys>
  weight: FillInFontValues<A, 'weight', DefaultKeys>
  letterSpacing: FillInFontValues<A, 'letterSpacing', DefaultKeys>
  size: FillInFontValues<A, 'size', DefaultKeys>
  style: FillInFontValues<A, 'style', DefaultKeys>
  transform: FillInFontValues<A, 'transform', DefaultKeys>
  color: FillInFontValues<A, 'color', DefaultKeys>
  face: Partial<A['face']>
}

type FillInFontValues<
  A extends GenericFont,
  K extends keyof A,
  DefaultKeys extends string | number,
> = keyof A[K] extends GenericFontKey
  ? {
      [Key in DefaultKeys]: A[K][any]
    }
  : {
      [Key in keyof A[K] | DefaultKeys]: Key extends keyof A[K]
        ? Exclude<A[K][Key], Variable>
        : any
    }

export type ThemesLikeObject = Record<string, Record<string, string>>

// dedupe themes to avoid duplicate CSS generation
export type DedupedTheme = {
  names: string[]
  theme: ThemeParsed
}

export type DedupedThemes = DedupedTheme[]

export type UseMediaState = {
  [key in MediaQueryKey]: boolean
}

export type TamaDefer = { __tamaDefer: true }
