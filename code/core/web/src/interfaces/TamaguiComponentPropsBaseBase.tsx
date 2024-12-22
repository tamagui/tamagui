import type { Role } from './Role'
import type { DebugProp, ThemeName, GroupNames } from '../types'

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

  themeInverse?: boolean

  /**
   * Same as the web id property for setting a uid on an element
   */
  id?: string

  /**
   * Controls the output tag on web
   * {@see https://developer.mozilla.org/en-US/docs/Web/HTML/Element}
   */
  tag?:
    | (string & {})
    | 'address'
    | 'article'
    | 'aside'
    | 'footer'
    | 'header'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'main'
    | 'nav'
    | 'section'
    | 'search'
    | 'blockquote'
    | 'dd'
    | 'div'
    | 'dl'
    | 'dt'
    | 'figcaption'
    | 'figure'
    | 'hr'
    | 'li'
    | 'ol'
    | 'ul'
    | 'p'
    | 'pre'
    | 'a'
    | 'abbr'
    | 'p'
    | 'b'
    | 'abbr'
    | 'bdi'
    | 'bdo'
    | 'br'
    | 'cite'
    | 'code'
    | 'data'
    | 'dfn'
    | 'em'
    | 'i'
    | 'kbd'
    | 'mark'
    | 'q'
    | 'rp'
    | 'rt'
    | 'rtc'
    | 'ruby'
    | 's'
    | 'samp'
    | 'small'
    | 'span'
    | 'strong'
    | 'sub'
    | 'sup'
    | 'time'
    | 'u'
    | 'var'
    | 'wbr'
    | 'area'
    | 'audio'
    | 'img'
    | 'map'
    | 'track'
    | 'video'
    | 'embed'
    | 'object'
    | 'param'
    | 'picture'
    | 'source'
    | 'canvas'
    | 'noscript'
    | 'script'
    | 'del'
    | 'ins'
    | 'caption'
    | 'col'
    | 'colgroup'
    | 'table'
    | 'thead'
    | 'tbody'
    | 'td'
    | 'th'
    | 'tr'
    | 'button'
    | 'datalist'
    | 'fieldset'
    | 'form'
    | 'input'
    | 'label'
    | 'legend'
    | 'meter'
    | 'optgroup'
    | 'option'
    | 'output'
    | 'progress'
    | 'select'
    | 'textarea'
    | 'details'
    | 'dialog'
    | 'menu'
    | 'summary'
    | 'template'

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
}

export interface Insets {
  top?: number
  left?: number
  bottom?: number
  right?: number
}
