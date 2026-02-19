import type { StyleObject } from '@tamagui/helpers'
import type { Properties } from 'csstype'
import type {
  CSSProperties,
  ComponentType,
  Context,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  FunctionComponent,
  HTMLAttributes,
  ProviderExoticComponent,
  ReactNode,
  RefAttributes,
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

export type StyledContext<Props extends Record<string, any> = any> = Context<Props> & {
  context: Context<Props>
  props: Record<string, any> | undefined
  Provider: ProviderExoticComponent<
    Partial<Props | undefined> & {
      children?: ReactNode
      scope?: string
    }
  >

  useStyledContext: (scope?: string) => Props
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
   * If true, component themes will not be applied
   */
  unstyled?: boolean

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
  group?: GroupNames | boolean

  /**
   * Works only alongside group, when children of the group are using container based sizing on native you can hide them until parent is measured.
   * See: https://tamagui.dev/docs/intro/props
   */
  untilMeasured?: 'hide' | 'show'

  /**
   * Equivalent to "name" property on styled() for automatically applying a theme
   */
  componentName?: string

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

type FontFamilies = FontTokens extends `$${infer Token}` ? Token : never

export type LanguageContextType = Partial<{
  [key in FontFamilies]: FontLanguages | 'default'
}>

export type FontLanguageProps = LanguageContextType & {
  children?: React.ReactNode
}

export type ThemeProviderProps = {
  className?: string
  defaultTheme: string
  /** @deprecated moved to createTamagui({ settings: { disableRootThemeClass } }) */
  disableRootThemeClass?: boolean
  /** @deprecated moved to createTamagui({ settings: { themeClassNameOnRoot } }) */
  themeClassNameOnRoot?: boolean
  children?: any
  reset?: boolean
}

export type ThemeState = {
  id: string
  name: string
  theme: ThemeParsed
  parentName?: string
  isInverse?: boolean
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

export type IsMediaType = boolean | 'platform' | 'theme' | 'group'

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

export type ReactComponentWithRef<Props, Ref> = ForwardRefExoticComponent<
  Props & RefAttributes<Ref>
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

  host?: TamaguiElement
  composedRef?: (x: TamaguiElement) => void
  willHydrate?: boolean
  hasMeasured?: boolean
  hasAnimated?: boolean
  themeShallow?: boolean
  hasEverThemed?: boolean | 'wrapped'
  hasEverResetPresence?: boolean
  hasHadEvents?: boolean
  isListeningToTheme?: boolean
  unPress?: Function
  setStateShallow?: ComponentSetStateShallow
  useStyleListener?: UseStyleListener
  updateStyleListener?: () => void

  // this is only used by group="" components
  // sets up a context object to track current state + emit
  group?: ComponentGroupEmitter

  // avoid re-render animation support
  nextState?: TamaguiComponentState
  nextMedia?: UseMediaState

  // cleanup function for media emit listener
  mediaEmitCleanup?: () => void

  // previous pseudo state for detecting enter vs exit transitions
  prevPseudoState?: {
    hover?: boolean
    press?: boolean
    focus?: boolean
    groups?: Record<string, { hover?: boolean; press?: boolean; focus?: boolean }>
  }
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
  animations: AnimationDriver<E> | AnimationsConfigObject
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

type ConfProps<A, B, C, D, E, F, I> = {
  tokens?: A
  themes?: B
  shorthands?: C
  media?: D
  animations?: E
  fonts?: F
  settings?: I
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
  autocompleteSpecificTokens: 'except-special'
}

// Helper to extract animation config from AnimationDriver<Config> or multi-driver object
type ExtractAnimationConfig<E> =
  E extends AnimationDriver<infer Config>
    ? Config
    : E extends { default: AnimationDriver<infer Config> }
      ? Config
      : E extends GenericAnimations
        ? E
        : EmptyAnimations

export type InferTamaguiConfig<Conf> =
  Conf extends ConfProps<infer A, infer B, infer C, infer D, infer E, infer F, infer H>
    ? TamaguiInternalConfig<
        A extends GenericTokens ? A : EmptyTokens,
        B extends GenericThemes ? B : EmptyThemes,
        C extends GenericShorthands ? C : EmptyShorthands,
        D extends GenericMedia ? D : EmptyMedia,
        ExtractAnimationConfig<E>,
        F extends GenericFonts ? F : EmptyFonts,
        H extends GenericTamaguiSettings ? H : EmptyTamaguiSettings
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
type NonSubThemeNames<A extends string | number> = A extends `${string}_${string}`
  ? never
  : A
type BaseThemeDefinitions = TamaguiConfig['themes'][NonSubThemeNames<
  keyof TamaguiConfig['themes']
>]
type GenericThemeDefinition = TamaguiConfig['themes'][keyof TamaguiConfig['themes']]
export type ThemeDefinition = BaseThemeDefinitions extends never
  ? GenericThemeDefinition
  : BaseThemeDefinitions
export type ThemeKeys = keyof ThemeDefinition
export type ThemeParsed = {
  [key in ThemeKeys]: CoerceToVariable<ThemeDefinition[key]>
}

export type Tokens = TamaguiConfig['tokens']

export type TokensParsed = {
  [Key in keyof Required<Tokens>]: TokenPrefixed<Tokens[Key]>
}

type TokenPrefixed<A extends { [key: string]: any }> = {
  [Key in Ensure$Prefix<keyof A> | keyof A]: A[keyof A]
}

type Ensure$Prefix<A extends string | number | symbol> = A extends
  | string
  | number
  | boolean
  ? A extends `$${string | number}`
    ? A
    : `$${A}`
  : never

export type TokensMerged = TokensParsed & Tokens

export type Shorthands = TamaguiConfig['shorthands']
export type Media = TamaguiConfig['media']
export type Themes = TamaguiConfig['themes']
export type ThemeName = Exclude<GetAltThemeNames<keyof Themes>, number>
export type ThemeTokens = `$${ThemeKeys}`
// Animation names (slow, fast, bouncy) for the `transition` prop
// Extract animation keys from the driver's `animations` property
// The AnimationDriver<Config> has an `animations: Config` property
type GetAnimationsFromDriver<T> = T extends { animations: infer A } ? keyof A : never

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
type InferredAnimationDriverKeys =
  TamaguiConfig['animations'] extends AnimationDriver<any>
    ? 'default'
    : TamaguiConfig['animations'] extends Record<string, AnimationDriver<any>>
      ? keyof TamaguiConfig['animations']
      : 'default'

// Combine inferred keys from config with TypeOverride keys
// This ensures both config-defined drivers AND lazy-loaded drivers are available
export type AnimationDriverKeys =
  | 'default'
  | InferredAnimationDriverKeys
  | (ReturnType<TypeOverride['animationDrivers']> extends 1
      ? never
      : ReturnType<TypeOverride['animationDrivers']>)
export type FontLanguages = ArrayIntersection<TamaguiConfig['fontLanguages']>

export interface ThemeProps {
  className?: string
  name?: Exclude<ThemeName, number> | null
  componentName?: string
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
  unstyled?: boolean
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

type AutocompleteSpecificTokensSetting = boolean | 'except-special'

export interface GenericTamaguiSettings {
  /**
   * When true, flexBasis will be set to 0 when flex is positive. This will be
   * the default in v2 of Tamagui alongside an alternative mode for web compat.
   */
  styleCompat?: 'react-native' | 'legacy'

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
   * Set up if "specific tokens" ($color.name) are added to the types where
   * tokens are allowed. The VSCode autocomplete puts specific tokens above the
   * regular ones, which leads to worse DX. If true this setting removes the
   * specific token from types for the defined categories.
   *
   * If set to "except-special", specific tokens will autocomplete only if they
   * don't normally use one of the special token groups: space, size, radius,
   * zIndex, color.
   *
   * @default except-special
   */
  autocompleteSpecificTokens?: AutocompleteSpecificTokensSetting

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
   * On Web, this allows changing the behavior of container groups which by
   * default uses `container-type: inline-size`.
   */
  webContainerType?:
    | 'normal'
    | 'size'
    | 'inline-size'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'revert-layer'

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
export type AnimationsConfig = AnimationDriver<any> | AnimationsConfigObject

export type AnimationsConfigObject = {
  default: AnimationDriver<any>
  [key: string]: AnimationDriver<any>
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

  settings?: Partial<GenericTamaguiSettings>

  /**
   * Web-only: define text-selection CSS
   */
  selectionStyles?: (theme: Record<string, string>) => null | {
    backgroundColor?: any
    color?: any
  }

  defaultProps?: Record<string, any> & {
    Text?: TextProps
    View?: StackNonStyleProps & StackStyle
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
> = Omit<CreateTamaguiProps, keyof GenericTamaguiConfig> &
  Omit<CreateTamaguiConfig<A, B, C, D, E, F, G>, 'tokens'> & {
    // TODO need to make it this but this breaks types, revisit
    // animations: E //AnimationDriver<E>
    // with $ prefixes for fast lookups (one time cost at startup vs every render)
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
    specificTokens: Record<string, Variable>
    settings: Omit<GenericTamaguiSettings, keyof G> & G
    defaultFont?: string
    defaultFontToken: `${string}`
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
export type MediaPropKeys = `$${MediaQueryKey}`
export type MediaQueryState = { [key in MediaQueryKey]: boolean }

export type ThemeMediaKeys<TK extends keyof Themes = keyof Themes> =
  `$theme-${TK extends `${string}_${string}` ? never : TK}`

export type PlatformMediaKeys = `$platform-${AllPlatforms}`

export interface TypeOverride {
  groupNames(): 1
  animationDrivers(): 1
}

export type GroupNames =
  ReturnType<TypeOverride['groupNames']> extends 1
    ? never
    : ReturnType<TypeOverride['groupNames']>

type ParentMediaStates = 'hover' | 'press' | 'focus' | 'focusVisible' | 'focusWithin'

export type GroupMediaKeys =
  | `$group-${GroupNames}`
  | `$group-${GroupNames}-${ParentMediaStates}`
  | `$group-${GroupNames}-${MediaQueryKey}`
  | `$group-${GroupNames}-${MediaQueryKey}-${ParentMediaStates}`
  | `$group-${ParentMediaStates}`
  | `$group-${MediaQueryKey}`
  | `$group-${MediaQueryKey}-${ParentMediaStates}`

export type WithMediaProps<A> = {
  [Key in
    | MediaPropKeys
    | GroupMediaKeys
    | ThemeMediaKeys
    | PlatformMediaKeys]?: Key extends MediaPropKeys
    ? A & {
        // TODO we can support $theme- inside media queries here if we change to ThemeMediaKeys | PlatformMediaKeys
        [Key in PlatformMediaKeys]?: AddWebOnlyStyleProps<A>
      }
    : Key extends `$platform-web`
      ? AddWebOnlyStyleProps<A>
      : A
}

type AddWebOnlyStyleProps<A> = {
  [SubKey in keyof A | keyof CSSProperties]?: SubKey extends keyof CSSProperties
    ? CSSProperties[SubKey]
    : SubKey extends keyof A
      ? A[SubKey]
      : SubKey extends keyof WebOnlyValidStyleValues
        ? WebOnlyValidStyleValues[SubKey]
        : never
}

export type WebOnlyValidStyleValues = {
  position: '-webkit-sticky'
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

export type TransitionProp =
  | TransitionKeys
  | ({
      default?: TransitionKeys
      enter?: TransitionKeys
      exit?: TransitionKeys
      delay?: number
    } & TransitionSpringConfig & {
        [key: string]:
          | TransitionKeys
          | {
              type: TransitionKeys
              [key: string]: any
            }
          | number
          | boolean
          | undefined
      })
  | [
      TransitionKeys,
      {
        delay?: number
        enter?: TransitionKeys
        exit?: TransitionKeys
      } & TransitionSpringConfig & {
          [key: string]:
            | TransitionKeys
            | {
                type?: TransitionKeys
                [key: string]: any
              }
            | number
            | boolean
            | undefined
        },
    ]

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

export type GetTokenString<A> = A extends `$${string}`
  ? A
  : A extends string | number
    ? `$${A}`
    : `$${string}`

export type SpecificTokens<
  Record = Tokens,
  RK extends keyof Record = keyof Record,
> = RK extends string
  ? `$${RK}.${keyof Record[RK] extends string | number
      ? // remove any $ prefix so instead of $size.$sm its $size.sm
        keyof Record[RK] extends `$${infer X}`
        ? X
        : keyof Record[RK]
      : never}`
  : never

// defaults to except-special
export type SpecificTokensSpecial = TamaguiSettings extends {
  autocompleteSpecificTokens: infer Val
}
  ? Val extends 'except-special' | undefined
    ? never
    : SpecificTokens
  : SpecificTokens

export type SizeTokens =
  | SpecificTokensSpecial
  | ThemeValueFallbackSize
  | GetTokenString<keyof Tokens['size']>

export type SpaceTokens =
  | SpecificTokensSpecial
  | GetTokenString<keyof Tokens['space']>
  | ThemeValueFallbackSpace

export type ColorTokens =
  | SpecificTokensSpecial
  | GetTokenString<keyof Tokens['color']>
  | GetTokenString<keyof ThemeParsed>
  | CSSColorNames

export type ZIndexTokens =
  | SpecificTokensSpecial
  | GetTokenString<keyof Tokens['zIndex']>
  | number

export type RadiusTokens =
  | SpecificTokensSpecial
  | GetTokenString<keyof Tokens['radius']>
  | number
  | RemString

export type NonSpecificTokens =
  | GetTokenString<keyof Tokens['radius']>
  | GetTokenString<keyof Tokens['zIndex']>
  | GetTokenString<keyof Tokens['color']>
  | GetTokenString<keyof Tokens['space']>
  | GetTokenString<keyof Tokens['size']>

export type Token =
  | NonSpecificTokens
  | (TamaguiSettings extends { autocompleteSpecificTokens: false }
      ? never
      : SpecificTokens)

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
export type FontFamilyTokens = GetTokenString<GetTokenFontKeysFor<'family'>>
export type FontSizeTokens =
  | GetTokenString<GetTokenFontKeysFor<'size'>>
  | number
  | RemString
export type FontLineHeightTokens =
  | `$${GetTokenFontKeysFor<'lineHeight'>}`
  | number
  | RemString
export type FontWeightValues =
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00`
  | 'bold'
  | 'normal'
export type FontWeightTokens = `$${GetTokenFontKeysFor<'weight'>}` | FontWeightValues
export type FontColorTokens = `$${GetTokenFontKeysFor<'color'>}` | number
export type FontLetterSpacingTokens =
  | `$${GetTokenFontKeysFor<'letterSpacing'>}`
  | number
  | RemString
export type FontStyleTokens =
  | `$${GetTokenFontKeysFor<'style'>}`
  | RNTextStyle['fontStyle']
export type FontTransformTokens =
  | `$${GetTokenFontKeysFor<'transform'>}`
  | RNTextStyle['textTransform']

export type ParseFont<A extends GenericFont> = {
  size: TokenPrefixed<A['size']>
  lineHeight: TokenPrefixedIfExists<A['lineHeight']>
  letterSpacing: TokenPrefixedIfExists<A['letterSpacing']>
  weight: TokenPrefixedIfExists<A['weight']>
  family: TokenPrefixedIfExists<A['family']>
  style: TokenPrefixedIfExists<A['style']>
  transform: TokenPrefixedIfExists<A['transform']>
  color: TokenPrefixedIfExists<A['color']>
  face: TokenPrefixedIfExists<A['face']>
}

export type TokenPrefixedIfExists<A> =
  A extends Record<string, any> ? TokenPrefixed<A> : {}

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
    ? SizeTokens | ThemeValueFallbackSize
    : K extends FontKeys
      ? FontTokens
      : K extends FontSizeKeys
        ? FontSizeTokens
        : K extends `${`border${string | ''}Radius`}`
          ? RadiusTokens | ThemeValueFallbackRadius
          : K extends SpaceKeys
            ? K extends 'shadowOffset'
              ? { width: SpaceTokens; height: SpaceTokens }
              : SpaceTokens | ThemeValueFallbackSpace
            : K extends ColorKeys
              ? ColorTokens | ThemeValueFallbackColor
              : K extends ZIndexKeys
                ? ZIndexTokens | ThemeValueFallbackZIndex
                : K extends LineHeightKeys
                  ? FontLineHeightTokens
                  : K extends FontWeightKeys
                    ? FontWeightTokens
                    : K extends FontLetterSpacingKeys
                      ? FontLetterSpacingTokens
                      : K extends OpacityKeys
                        ? SpecificTokens | ThemeValueFallback
                        : never

export type GetThemeValueForKey<K extends string | symbol | number> =
  | ThemeValueGet<K>
  | ThemeValueFallback
  | (TamaguiSettings extends { autocompleteSpecificTokens: infer Val }
      ? Val extends true | undefined
        ? SpecificTokens
        : never
      : never)

export type WithThemeValues<T extends object> = {
  [K in keyof T]: ThemeValueGet<K> extends never
    ? K extends keyof ExtraBaseProps
      ? T[K]
      : T[K] | 'unset'
    : GetThemeValueForKey<K> | Exclude<T[K], string> | 'unset'
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

// adds pseudo props
// PseudoStyleWithTransition allows transition inside pseudo-style props for enter/exit timing
export type PseudoStyleWithTransition<A> = A & { transition?: TransitionProp | null }

export type WithPseudoProps<A> = {
  hoverStyle?: PseudoStyleWithTransition<A> | null
  pressStyle?: PseudoStyleWithTransition<A> | null
  focusStyle?: PseudoStyleWithTransition<A> | null
  focusWithinStyle?: PseudoStyleWithTransition<A> | null
  focusVisibleStyle?: PseudoStyleWithTransition<A> | null
  disabledStyle?: PseudoStyleWithTransition<A> | null
  exitStyle?: PseudoStyleWithTransition<A> | null
  enterStyle?: PseudoStyleWithTransition<A> | null
}

// type for transitions extracted from pseudo-style props (e.g., hoverStyle.transition)
// includes $group-*-hover, $group-*-press, $group-*-focus patterns
export type PseudoTransitions = Partial<
  Record<keyof WithPseudoProps<any>, TransitionProp | null>
> & {
  // allow $group-{name}-{pseudo} keys dynamically
  [key: `$group-${string}-${'hover' | 'press' | 'focus'}`]:
    | TransitionProp
    | null
    | undefined
}

export type PseudoPropKeys = keyof WithPseudoProps<any>

export type PseudoStyles = {
  hoverStyle?: ViewStyle
  pressStyle?: ViewStyle
  focusStyle?: ViewStyle
  focusWithinStyle?: ViewStyle
  focusVisibleStyle?: ViewStyle
  disabledStyle?: ViewStyle
  enterStyle?: ViewStyle
  exitStyle?: ViewStyle
}

export type AllPlatforms = 'web' | 'native' | 'android' | 'ios'

// MUST EXPORT ALL IN BETWEEN or else it expands declarations like crazy

//
// add both theme and shorthands
//
type MaybeOmitLonghands<A> = OnlyShorthandStyleProps extends true
  ? Omit<A, ShorthandLonghandProps>
  : A

export type WithThemeAndShorthands<
  A extends object,
  Variants = {},
> = OnlyAllowShorthands extends true
  ? WithThemeValues<MaybeOmitLonghands<Omit<A, Longhands>>> &
      Variants &
      WithShorthands<WithThemeValues<A>>
  : WithThemeValues<MaybeOmitLonghands<A>> & Variants & WithShorthands<WithThemeValues<A>>

//
// combines all of theme, shorthands, pseudos...
//
export type WithThemeShorthandsAndPseudos<
  A extends object,
  Variants = {},
> = WithThemeAndShorthands<A, Variants> &
  WithPseudoProps<WithThemeAndShorthands<A, Variants>>

//
// ... media queries and animations
//
export type WithThemeShorthandsPseudosMedia<
  A extends object,
  Variants = {},
> = WithThemeShorthandsAndPseudos<A, Variants> &
  WithMediaProps<WithThemeShorthandsAndPseudos<A, Variants>>

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
  | '0 1px 2px $shadowColor' // offset + blur + color token
  | '0 1px 3px 0 $shadowColor' // offset + blur + spread + color token
  | '0 4px 6px -1px $shadowColor' // negative spread
  | 'inset 0 2px 4px $shadowColor' // inset
  | 'none'

// Box Shadow - CSS string format (e.g. "0 4px 8px $shadowColor")
// Supports embedded $tokens that get resolved at runtime
export type BoxShadowValue = BoxShadowPreset | (string & {})

// filter presets - one example per function for autocomplete hints
type FilterPreset =
  | 'blur(4px)'
  | 'brightness(1.2)'
  | 'contrast(1.2)'
  | 'drop-shadow(0 4px 8px $shadowColor)'
  | 'grayscale(1)'
  | 'hue-rotate(90deg)'
  | 'invert(1)'
  | 'opacity(0.5)'
  | 'saturate(1.5)'
  | 'sepia(1)'
  | 'none'

// Filter - CSS string format (e.g. "blur(10px) brightness(1.2)")
// Supports embedded $tokens that get resolved at runtime
export type FilterValue = FilterPreset | (string & {})

// border shorthand presets - examples for autocomplete hints
type BorderPreset =
  | '1px solid' // width + style
  | '1px solid $borderColor' // width + style + color token
  | '2px dashed $borderColor' // width + style + color
  | '1px dotted red' // width + style + color
  | 'none'

// Border - CSS shorthand string format (e.g. "1px solid $borderColor")
// Expands to borderWidth, borderStyle, borderColor on web and native
// Note: on native, only supports a single border (all sides)
export type BorderValue = BorderPreset | (string & {})

// outline shorthand presets - examples for autocomplete hints
type OutlinePreset =
  | '1px solid' // width + style
  | '1px solid $outlineColor' // width + style + color token
  | '2px dashed $outlineColor' // width + style + color
  | '1px dotted red' // width + style + color
  | 'none'

// Outline - CSS shorthand string format (e.g. "2px solid $outlineColor")
// Expands to outlineWidth, outlineStyle, outlineColor on native
export type OutlineValue = OutlinePreset | (string & {})

interface ExtraStyleProps {
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
   * CSS outline shorthand string. Supports tokens: "2px solid $outlineColor"
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
   * Web-only style property. Will be omitted on native.
   */
  background?: Properties['background']
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
   * CSS box-shadow string. Supports tokens: "0 4px 8px $shadowColor"
   * Works on web and native (RN 0.76+).
   */
  boxShadow?: BoxShadowValue
  /**
   * CSS border shorthand string. Supports tokens: "1px solid $borderColor"
   * Expands to borderWidth, borderStyle, borderColor.
   * Works on web and native. On native, applies to all sides.
   */
  border?: BorderValue
  /**
   * Web-only style property. Will be omitted on native.
   */
  overflowX?: Properties['overflowX']
  /**
   * Web-only style property. Will be omitted on native.
   */
  overflowY?: Properties['overflowY']

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
  content?: Properties['content']
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
  textDecorationDistance?: number
  textOverflow?: Properties['textOverflow']
  whiteSpace?: Properties['whiteSpace']
  wordWrap?: Properties['wordWrap']
  /**
   * CSS text-shadow string. Supports tokens: "2px 2px 4px $shadowColor"
   * On native, only a single shadow is supported.
   */
  textShadow?: string
}

//
// Stack
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
// - focusable → tabIndex
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

export type StackStyle = WithThemeShorthandsPseudosMedia<StackStyleBase>

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
    >,
    ExtendBaseTextProps,
    TamaguiComponentPropsBase {
  // we allow either RN or web style props, of course only web css props only works on web
  style?: StyleProp<LooseCombinedObjects<React.CSSProperties, RNTextStyle>>
}

export type TextStyle = WithThemeShorthandsPseudosMedia<TextStylePropsBase>

export type TextProps = TextNonStyleProps & TextStyle

export interface ThemeableProps {
  theme?: ThemeName | null
  themeReset?: boolean
  componentName?: string
  debug?: DebugProp
}

export type StyleableOptions = {
  disableTheme?: boolean
  staticConfig?: Partial<StaticConfig>
}

export type Styleable<
  Props,
  Ref,
  NonStyledProps,
  BaseStyles extends object,
  VariantProps,
  ParentStaticProperties,
> = <
  CustomProps extends object | void = void,
  MergedProps = CustomProps extends void
    ? Props
    : Omit<Props, keyof CustomProps> & CustomProps,
  FunctionDef extends ForwardRefRenderFunction<Ref, MergedProps> =
    ForwardRefRenderFunction<Ref, MergedProps>,
>(
  a: FunctionDef,
  options?: StyleableOptions
) => TamaguiComponent<
  MergedProps,
  Ref,
  NonStyledProps & CustomProps,
  BaseStyles,
  VariantProps,
  ParentStaticProperties
>

export type GetFinalProps<NonStyleProps, StylePropsBase, Variants> = Omit<
  NonStyleProps,
  keyof StylePropsBase | keyof Variants
> &
  (StylePropsBase extends object
    ? WithThemeShorthandsPseudosMedia<StylePropsBase, Variants>
    : {})

export type TamaguiComponent<
  Props = any,
  Ref = any,
  NonStyledProps = {},
  BaseStyles extends object = {},
  Variants = {},
  ParentStaticProperties = {},
> = ForwardRefExoticComponent<
  (Props extends TamaDefer
    ? GetFinalProps<NonStyledProps, BaseStyles, Variants>
    : Props) &
    RefAttributes<Ref>
> &
  StaticComponentObject<
    Props,
    Ref,
    NonStyledProps,
    BaseStyles,
    Variants,
    ParentStaticProperties
  > &
  Omit<ParentStaticProperties, 'staticConfig' | 'styleable'> & {
    __tama: [Props, Ref, NonStyledProps, BaseStyles, Variants, ParentStaticProperties]
  }

export type InferGenericComponentProps<A> =
  A extends ComponentType<infer Props>
    ? Props
    : A extends ForwardRefExoticComponent<infer P>
      ? P
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
> = WithThemeShorthandsPseudosMedia<GetBaseStyles<A, B>, {}>

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
  ? C
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

  /*
   * If you want your HOC of a styled() component to also be able to be styled(), you need this to wrap it.
   */
  styleable: Styleable<
    Props extends TamaDefer
      ? GetFinalProps<NonStyledProps, BaseStyles, VariantProps>
      : Props,
    Ref,
    NonStyledProps,
    BaseStyles,
    VariantProps,
    ParentStaticProperties
  >
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

export type PropMappedValue = [string, any][] | undefined

export type GetStyleState = {
  style: TextStyle | null
  usedKeys: Record<string, number>
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
  flatTransforms?: Record<string, any>
  // Track style values that override context props (for issues #3670, #3676)
  overriddenContextProps?: Record<string, any>
  // Track original token values (like '$8') before they get resolved to CSS vars
  // This is used to preserve token strings in overriddenContextProps
  originalContextPropValues?: Record<string, any>
  // Transitions extracted from pseudo-style props (e.g., hoverStyle.transition)
  pseudoTransitions?: PseudoTransitions | null
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
  map: (key: string, val: any, originalVal?: any) => void
) => void

export type GenericVariantDefinitions = {
  [key: string]: {
    [key: string]:
      | ((a: any, b: any) => any)
      | {
          [key: string]: any
        }
  }
}

export type StaticConfigPublic = {
  defaultProps?: Record<string, any>

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
   * (compiler) If not flattening, leave this prop as original value.
   * Only applies to style attributes
   */
  inlineWhenUnflattened?: Set<string>

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
}

type StaticConfigBase = StaticConfigPublic & {
  Component?: FunctionComponent<any> & StaticComponentObject<any, any, any, any, any, any>

  variants?: GenericVariantDefinitions

  context?: StyledContext

  /**
   * Used for applying sub theme style
   */
  componentName?: string

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

  // insanity, for styled(styled(styleable(styled())))
  isStyledHOC?: boolean
}

export type StaticConfig = StaticConfigBase & {
  parentStaticConfig?: StaticConfigBase
}

export type ViewStyleWithPseudos =
  | TextStyle
  | (TextStyle & {
      hoverStyle?: TextStyle
      pressStyle?: TextStyle
      focusStyle?: TextStyle
      focusWithinStyle?: TextStyle
      focusVisibleStyle?: TextStyle
      disabledStyle?: TextStyle
    })

/**
 * --------------------------------------------
 *   variants
 * --------------------------------------------
 */

export type StylableComponent =
  | TamaguiComponent
  | ComponentType<any>
  | ForwardRefExoticComponent<any>
  | ReactComponentWithRef<any, any>
  | (new (props: any) => any)

export type SpreadKeys =
  | '...fontSize'
  | '...fontStyle'
  | '...fontTransform'
  | '...lineHeight'
  | '...letterSpacing'
  | '...size'
  | '...space'
  | '...color'
  | '...zIndex'
  | '...theme'
  | '...radius'

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
  : WithThemeShorthandsPseudosMedia<
      IsText extends true ? TextStylePropsBase : StackStyleBase
    >

export type VariantDefinitionFromProps<MyProps, Val> = MyProps extends object
  ? {
      [propName: string]:
        | VariantSpreadFunction<MyProps, Val>
        | ({
            [Key in SpreadKeys]?: Key extends '...fontSize'
              ? FontSizeVariantSpreadFunction<MyProps>
              : Key extends '...size'
                ? SizeVariantSpreadFunction<MyProps>
                : Key extends '...space'
                  ? SpaceVariantSpreadFunction<MyProps>
                  : Key extends '...color'
                    ? ColorVariantSpreadFunction<MyProps>
                    : Key extends '...lineHeight'
                      ? FontLineHeightVariantSpreadFunction<MyProps>
                      : Key extends '...fontTransform'
                        ? FontTransformVariantSpreadFunction<MyProps>
                        : Key extends '...fontStyle'
                          ? FontStyleVariantSpreadFunction<MyProps>
                          : Key extends '...letterSpacing'
                            ? FontLetterSpacingVariantSpreadFunction<MyProps>
                            : Key extends '...zIndex'
                              ? ZIndexVariantSpreadFunction<MyProps>
                              : Key extends '...radius'
                                ? RadiusVariantSpreadFunction<MyProps>
                                : Key extends '...theme'
                                  ? ThemeVariantSpreadFunction<MyProps>
                                  : never
          } & {
            [Key in string | number | 'true' | 'false']?:
              | MyProps
              | VariantSpreadFunction<MyProps, Val>
          } & {
            [Key in VariantTypeKeys]?: Key extends ':number'
              ? VariantSpreadFunction<MyProps, number>
              : Key extends ':boolean'
                ? VariantSpreadFunction<MyProps, boolean>
                : Key extends ':string'
                  ? VariantSpreadFunction<MyProps, string>
                  : never
          })
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

export type VariantTypeKeys = ':string' | ':boolean' | ':number'

export type GetVariantValues<Key> = Key extends `...${infer VariantSpread}`
  ? ThemeValueByCategory<VariantSpread>
  : Key extends 'true' | 'false'
    ? boolean
    : Key extends ':string'
      ? string
      : Key extends ':boolean'
        ? boolean
        : Key extends ':number'
          ? number
          : Key

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
  styledContext?: Record<string, any>
  mediaState?: Record<string, boolean>
  noClass?: boolean
  noExpand?: boolean
  noNormalize?: boolean | 'values'
  noSkip?: boolean
  noMergeStyle?: boolean
  resolveValues?: ResolveVariableAs
  disableExpandShorthands?: boolean
  fallbackProps?: Record<string, any>
  hasTextAncestor?: boolean
  // for animations
  willBeAnimated?: boolean // we need to track media queries even before animation
  isAnimated: boolean
  isExiting?: boolean
  exitVariant?: string
  enterVariant?: string
}

// Presence

export interface PresenceContextProps {
  id: string
  isPresent: boolean
  register: (id: string) => () => void
  onExitComplete?: (id: string) => void
  initial?: false | string | string[]
  custom?: any
  exitVariant?: string | null
  enterVariant?: string | null
  enterExitVariant?: string | null
}

type SafeToRemoveCallback = () => void
type AlwaysPresent = [true, null, null]
type Present = [true, undefined, PresenceContextProps]
type NotPresent = [false, SafeToRemoveCallback, PresenceContextProps]

export type UsePresenceResult = AlwaysPresent | Present | NotPresent

// Animations:

type AnimationConfig = {
  [key: string]: any
}

// includes a very limited adapter between various impls for number => style
// this is useful only in limited scenarios like `Sheet`, but necessary in those cases
// TODO: make css driver compatible with this?

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

export type UseAnimatedNumber<
  N extends UniversalAnimatedNumber<any> = UniversalAnimatedNumber<any>,
> = (initial: number) => N

export type AnimationDriver<A extends AnimationConfig = AnimationConfig> = {
  isReactNative?: boolean
  /** What style format the driver expects as input: 'css' (CSS variables) or 'value' (resolved values) */
  inputStyle?: 'css' | 'value'
  /** How the driver outputs styles: 'css' (className-based) or 'inline' (style object) */
  outputStyle?: 'css' | 'inline'
  needsCustomComponent?: boolean
  avoidReRenders?: boolean
  onMount?: () => void
  /** When true, this is a stub driver with no real animation support */
  isStub?: boolean
  useAnimations: UseAnimationHook
  usePresence: () => UsePresenceResult
  ResetPresence: (props: {
    children?: React.ReactNode
    disabled?: boolean
  }) => React.ReactNode
  useAnimatedNumber: UseAnimatedNumber
  useAnimatedNumberStyle: UseAnimatedNumberStyle
  useAnimatedNumberReaction: UseAnimatedNumberReaction
  animations: A
  View?: any
  Text?: any
}

export type UseAnimationProps = TamaguiComponentPropsBase & Record<string, any>

type UseStyleListener = (
  nextStyle: Record<string, unknown>,
  effectiveTransition?: TransitionProp | null
) => void
export type UseStyleEmitter = (cb: UseStyleListener) => void

export type UseAnimationHook = (props: {
  style: Record<string, any>
  props: Record<string, any>
  presence?: UsePresenceResult | null
  staticConfig: StaticConfig
  styleProps: SplitStyleProps
  componentState: TamaguiComponentState
  useStyleEmitter?: UseStyleEmitter
  theme: ThemeParsed
  themeName: string
  pseudos: WithPseudoProps<ViewStyle> | null
  stateRef: { current: TamaguiComponentStateRef }
  onDidAnimate?: any
  delay?: number
}) => null | {
  style?: StackStyleBase | StackStyleBase[]
  className?: string
  ref?: any
}

export type GestureReponderEvent =
  Exclude<View['props']['onResponderMove'], void> extends (event: infer Event) => void
    ? Event
    : never

export type RulesToInsert = Record<string, StyleObject>

export type GetStyleResult = {
  pseudos?: PseudoStyles | null
  style: ViewStyle | null
  classNames: ClassNamesObject
  rulesToInsert: RulesToInsert
  viewProps: (StackNonStyleProps & StackStyle) & Record<string, any>
  fontFamily: string | undefined
  space?: any // SpaceTokens?
  hasMedia: boolean | Set<string>
  dynamicThemeAccess?: boolean
  pseudoGroups?: Set<string>
  mediaGroups?: Set<string>
  // Style values that override context props (for issues #3670, #3676)
  overriddenContextProps?: Record<string, any>
  // Transitions extracted from pseudo-style props (e.g., hoverStyle.transition)
  pseudoTransitions?: PseudoTransitions | null
  // Effective transition to use (accounts for entering pseudo states)
  effectiveTransition?: TransitionProp | null
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
