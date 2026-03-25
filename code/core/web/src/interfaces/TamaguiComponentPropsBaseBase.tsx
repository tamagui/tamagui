import type {
  DebugProp,
  ThemeName,
  GroupNames,
  Role,
  TamaguiComponentState,
} from '../types'

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
   * Marks this component as a group for use in styling children based on parents named group.
   * See: https://tamagui.dev/docs/intro/props
   *
   * Note: on web this applies `container-type: inline-size` to the element (CSS Container
   * Queries). That property suppresses content-based inline sizing, so a grouped element
   * inside a horizontal flex container (e.g. XStack/HStack) that relies on its children to
   * determine its width will collapse to 0 px and cause text to wrap on every character.
   * Fix: give the grouped element an explicit inline size — e.g. `flex={1}`, `width="100%"`,
   * or a fixed `width` value.
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
}

export interface Insets {
  top?: number
  left?: number
  bottom?: number
  right?: number
}
