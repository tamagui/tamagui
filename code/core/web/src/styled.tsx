import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { createComponent } from './createComponent'
import {
  componentDisplayName,
  setComponentDisplayName,
} from './helpers/componentDisplayName'
import { mergeVariants } from './helpers/mergeVariants'
import type { FrontendComponent, StyleFrontend } from './helpers/styleFrontend'
import { warnOnce } from './helpers/warnOnce'
import type { GetRef } from './interfaces/GetRef'
import { getReactNativeConfig } from './setupReactNative'
import type {
  CompoundVariantDefinition,
  GetBaseStyles,
  GetNonStyledProps,
  GetProps,
  GetStaticConfig,
  GetStyledVariants,
  InferStyleProps,
  InferStyledProps,
  StackStyle,
  StackStyleBase,
  StaticConfig,
  StaticConfigPublic,
  StylableComponent,
  StyledContext,
  TamaDefer,
  TamaguiComponent,
  TamaguiComponentPropsBase,
  TextStyle,
  TextStylePropsBase,
  ThemeValueByCategory,
  ThemeValueGet,
  VariantDefinitions,
  VariantResolverKey,
  VariantResolverValue,
  VariantSpreadFunction,
} from './types'
import type { Text } from './views/Text'

export { createVariantResolver } from './types'

type AreVariantsUndefined<Variants> =
  // because we pass in the Generic variants which for some reason has this :)
  Required<Variants> extends { _isEmpty: 1 } ? true : false

// these stay strict (exact branch keys): defaultVariants, options roots,
// compound matchers, and the stored component variants all use them, so typos
// there remain type errors. the conditional flat forms (clause strings and
// objects) widen only at the final public props, in WithThemeAndShorthands
type GetVariantAcceptedValues<V> = V extends object
  ? {
      [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val>
        ? Val
        : GetVariantAcceptedValue<keyof V[Key]>
    }
  : undefined

type GetVariantAcceptedValue<Key> = Key extends 'true' | 'false'
  ? boolean
  : Key extends string
    ? VariantResolverKey<Key> extends never
      ? Key
      : VariantResolverValue<Key>
    : Key

type NoInferLocal<T> = [T][T extends any ? 0 : never]
type IsAny<T> = 0 extends 1 & T ? true : false

type GetStyledOptionsAcceptedProps<
  ParentComponent extends StylableComponent,
  StyledConfig extends StaticConfigPublic,
  Variants extends VariantDefinitions<ParentComponent, StyledConfig>,
  Context,
  ContextPropKeys extends string,
> = Partial<InferStyledProps<ParentComponent, StyledConfig>> &
  (AreVariantsUndefined<Variants> extends true
    ? {}
    : Partial<GetVariantAcceptedValues<Variants>>) &
  GetStyledContextProps<Context, ContextPropKeys>

export type StyledOptions<
  ParentComponent extends StylableComponent,
  StyledConfig extends StaticConfigPublic,
  Variants extends VariantDefinitions<ParentComponent, StyledConfig>,
  Context extends StyledContext<any> | undefined = undefined,
  ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>,
> = GetStyledOptionsAcceptedProps<
  ParentComponent,
  StyledConfig,
  Variants,
  Context,
  ContextPropKeys
> & {
  displayName?: string
  variants?: Variants | undefined
  defaultVariants?: NoInferLocal<GetVariantAcceptedValues<NonNullable<Variants>>>
  context?: Context
  contextProps?: readonly Extract<
    ContextPropKeys,
    keyof GetStyledContextAllProps<Context> & string
  >[]
  compoundVariants?: readonly CompoundVariantDefinition<
    NoInferLocal<
      GetCompoundVariantMatchProps<
        ParentComponent,
        StyledConfig,
        Variants,
        Context,
        ContextPropKeys
      >
    >,
    Partial<InferStyleProps<ParentComponent, StyledConfig>>
  >[]
  render?: string | React.ReactElement
}

type GetStyledContextAllProps<Context> =
  Context extends StyledContext<infer Props>
    ? IsAny<Props> extends true
      ? {}
      : Partial<Props>
    : {}

type GetStyledContextDefaultKeys<Context> =
  Context extends StyledContext<infer Props, infer Keys>
    ? IsAny<Props> extends true
      ? never
      : Extract<Keys, keyof Props & string>
    : never

type GetStyledContextProps<
  Context,
  Keys extends string = GetStyledContextDefaultKeys<Context>,
> =
  Context extends StyledContext<infer Props>
    ? IsAny<Props> extends true
      ? {}
      : Partial<Pick<Props, Extract<Keys, keyof Props & string>>>
    : {}

type GetStyledContextVariantProps<
  ParentComponent extends StylableComponent,
  Context,
  Keys extends string,
> = Omit<GetStyledContextProps<Context, Keys>, keyof GetProps<ParentComponent>>

type GetCompoundVariantMatchProps<
  ParentComponent extends StylableComponent,
  StyledConfig extends StaticConfigPublic,
  Variants extends VariantDefinitions<ParentComponent, StyledConfig>,
  Context,
  ContextPropKeys extends string,
> = Omit<StyledMergedVariants<ParentComponent, StyledConfig, Variants>, '_isEmpty'> &
  GetStyledContextProps<Context, ContextPropKeys>

type StyledCustomTokenProps<
  ParentComponent extends StylableComponent,
  StyledConfig extends StaticConfigPublic,
  ParentStylesBase extends object,
  Accepted = StyledConfig['accept'],
> =
  Accepted extends Record<string, any>
    ? {
        [Key in keyof Accepted]?:
          | (Key extends keyof ParentStylesBase ? ParentStylesBase[Key] : never)
          | (Accepted[Key] extends 'style'
              ? Partial<InferStyleProps<ParentComponent, StyledConfig>>
              : Accepted[Key] extends 'textStyle'
                ? Partial<InferStyleProps<typeof Text, StyledConfig>>
                : ThemeValueByCategory<Accepted[Key]>)
      }
    : {}

type StyledMergedVariants<
  ParentComponent extends StylableComponent,
  StyledConfig extends StaticConfigPublic,
  Variants extends VariantDefinitions<ParentComponent, StyledConfig>,
  ParentVariants = GetStyledVariants<ParentComponent>,
  OurVariantProps = GetVariantAcceptedValues<Variants>,
> =
  AreVariantsUndefined<Variants> extends true
    ? ParentVariants
    : AreVariantsUndefined<ParentVariants> extends true
      ? Omit<OurVariantProps, '_isEmpty'>
      : {
          [Key in Exclude<keyof ParentVariants | keyof OurVariantProps, '_isEmpty'>]?:
            | (Key extends keyof ParentVariants ? ParentVariants[Key] : undefined)
            | (Key extends keyof OurVariantProps ? OurVariantProps[Key] : undefined)
        }

type StyledVariantsWithContext<Variants, ContextProps> = keyof ContextProps extends never
  ? Variants
  : {
      [Key in keyof Variants | keyof ContextProps]?:
        | (Key extends keyof Variants ? Variants[Key] : never)
        | (Key extends keyof ContextProps ? ContextProps[Key] : never)
    }

type StyledComponentResult<
  ParentComponent extends StylableComponent,
  StyledConfig extends StaticConfigPublic,
  Variants extends VariantDefinitions<ParentComponent, StyledConfig>,
  Context extends StyledContext<any> | undefined = undefined,
  ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>,
  ParentStylesBase extends object = GetBaseStyles<ParentComponent, StyledConfig>,
> = TamaguiComponent<
  TamaDefer,
  GetRef<ParentComponent>,
  GetNonStyledProps<ParentComponent>,
  StyledConfig['accept'] extends Record<string, any>
    ? ParentStylesBase &
        StyledCustomTokenProps<
          ParentComponent,
          StyledConfig,
          ParentStylesBase,
          StyledConfig['accept']
        >
    : ParentStylesBase,
  StyledVariantsWithContext<
    StyledMergedVariants<ParentComponent, StyledConfig, Variants>,
    GetStyledContextVariantProps<ParentComponent, Context, ContextPropKeys>
  >,
  GetStaticConfig<ParentComponent, StyledConfig>
>

// ---- HTML element support for styledHtml('tagName') ----

// text-like elements use TextStylePropsBase
type TextLikeElements =
  | 'a'
  | 'abbr'
  | 'b'
  | 'bdi'
  | 'bdo'
  | 'cite'
  | 'code'
  | 'data'
  | 'del'
  | 'dfn'
  | 'em'
  | 'i'
  | 'ins'
  | 'kbd'
  | 'label'
  | 'mark'
  | 'q'
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

// props that conflict with tamagui style props
type ConflictingHTMLProps =
  | 'color'
  | 'display'
  | 'height'
  | 'width'
  | 'size'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'translate'
  | 'content'

// map HTML tag to its specific attributes
type HTMLElementSpecificProps<T extends keyof HTMLElementTagNameMap> = T extends 'a'
  ? Omit<AnchorHTMLAttributes<HTMLAnchorElement>, ConflictingHTMLProps>
  : T extends 'button'
    ? Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHTMLProps>
    : T extends 'input'
      ? Omit<InputHTMLAttributes<HTMLInputElement>, ConflictingHTMLProps>
      : T extends 'select'
        ? Omit<SelectHTMLAttributes<HTMLSelectElement>, ConflictingHTMLProps>
        : T extends 'textarea'
          ? Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, ConflictingHTMLProps>
          : T extends 'form'
            ? Omit<FormHTMLAttributes<HTMLFormElement>, ConflictingHTMLProps>
            : T extends 'label'
              ? Omit<LabelHTMLAttributes<HTMLLabelElement>, ConflictingHTMLProps>
              : Omit<HTMLAttributes<HTMLElement>, ConflictingHTMLProps>

// base style props based on element type. the BASE type feeds TamaguiComponent,
// whose GetFinalProps applies WithThemeAndShorthands itself — passing the
// already-wrapped TextStyle/StackStyle there wraps twice, which the flat object
// value form turns into a type-explosion. authored options still use the
// wrapped form so tokens and clauses typecheck in the definition
type HTMLElementStyleBase<T extends keyof HTMLElementTagNameMap> =
  T extends TextLikeElements ? TextStylePropsBase : StackStyleBase
type HTMLElementStyle<T extends keyof HTMLElementTagNameMap> = T extends TextLikeElements
  ? TextStyle
  : StackStyle

// runtime check for text-like elements
const textLikeElements = new Set<string>([
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'em',
  'i',
  'ins',
  'kbd',
  'label',
  'mark',
  'q',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
])

/**
 * styledHtml() for HTML element tags like 'a', 'button', 'div', etc.
 * Automatically provides element-specific props (href for anchors, type for buttons, etc.)
 *
 * @example
 * const StyledAnchor = styledHtml('a', {
 *   color: 'blue10',
 *   textDecorationLine: 'underline',
 * })
 * // StyledAnchor now accepts `href` prop with proper typing
 * <StyledAnchor href="/path">Link</StyledAnchor>
 */
export function styledHtml<
  Tag extends keyof HTMLElementTagNameMap,
  Variants extends VariantDefinitions<any, any> | undefined = undefined,
>(
  tag: Tag,
  options?: Partial<HTMLElementStyle<Tag>> & {
    displayName?: string
    variants?: Variants
    defaultVariants?: GetVariantAcceptedValues<NonNullable<Variants>>
    context?: StyledContext
  }
) {
  type StyleBase = HTMLElementStyleBase<Tag>
  type HTMLProps = HTMLElementSpecificProps<Tag>
  type VariantProps = Variants extends undefined
    ? {}
    : AreVariantsUndefined<NonNullable<Variants>> extends true
      ? {}
      : GetVariantAcceptedValues<NonNullable<Variants>>

  const isText = textLikeElements.has(tag)
  const { variants, displayName, defaultVariants, context, ...defaultProps } =
    options || {}

  const conf: Partial<StaticConfig> = {
    Component: tag as any,
    variants: variants as any,
    defaultProps: defaultProps as any,
    defaultVariants,
    isText,
    acceptsClassName: true,
    context,
  }

  if (defaultProps['children'] || context) {
    conf.neverFlatten = true
  }

  const component = setComponentDisplayName(createComponent(conf), displayName)

  return component as any as TamaguiComponent<
    TamaDefer,
    HTMLElementTagNameMap[Tag],
    TamaguiComponentPropsBase & HTMLProps,
    StyleBase,
    VariantProps,
    {}
  >
}

/**
 * styled() for creating Tamagui components from other components.
 *
 * Core's public overload is object-only. The class-string form belongs to
 * `@tamagui/tailwind`, which reaches this implementation through
 * `createFrontendStyled`.
 */
function styled<
  ParentComponent extends StylableComponent,
  StyledConfig extends StaticConfigPublic,
  Variants extends VariantDefinitions<ParentComponent, StyledConfig>,
  Context extends StyledContext<any> | undefined = undefined,
  ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>,
>(
  ComponentIn: ParentComponent,
  options?: StyledOptions<
    ParentComponent,
    StyledConfig,
    Variants,
    Context,
    ContextPropKeys
  >,
  config?: StyledConfig
): StyledComponentResult<
  ParentComponent,
  StyledConfig,
  Variants,
  Context,
  ContextPropKeys
>
function styled(...args: any[]) {
  return (styledImpl as any)(undefined, ...args)
}

/**
 * Builds a `styled()` bound to one frontend descriptor. Components it creates carry
 * that descriptor immutably, so behavior follows import provenance instead of any
 * global setting.
 */
export function createFrontendStyled(
  frontend: StyleFrontend
): (
  ComponentIn: any,
  optionsOrBaseClassName?: any,
  configOrOptions?: any,
  maybeConfig?: any
) => FrontendComponent {
  return (ComponentIn, optionsOrBaseClassName, configOrOptions, maybeConfig) =>
    styledImpl(
      frontend,
      ComponentIn,
      optionsOrBaseClassName,
      configOrOptions,
      maybeConfig
    ) as any
}

function styledImpl<
  ParentComponent extends StylableComponent,
  StyledConfig extends StaticConfigPublic,
  Variants extends VariantDefinitions<ParentComponent, StyledConfig>,
  Context extends StyledContext<any> | undefined,
  ContextPropKeys extends string,
>(
  // undefined keeps whatever the parent static config already carries, so a
  // styled() chain never switches frontends halfway
  frontend: StyleFrontend | undefined,
  ComponentIn: ParentComponent,
  // this should be Partial<GetProps<ParentComponent>> but causes excessively deep type issues
  optionsOrBaseClassName?:
    | StyledOptions<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>
    | string,
  configOrOptions?:
    | StyledOptions<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>
    | StyledConfig,
  maybeConfig?: StyledConfig
) {
  const hasBaseClassName = typeof optionsOrBaseClassName === 'string'
  const baseClassName = hasBaseClassName ? optionsOrBaseClassName : undefined
  const optionsIn = (hasBaseClassName ? configOrOptions : optionsOrBaseClassName) as
    | StyledOptions<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>
    | undefined
  const config = (hasBaseClassName ? maybeConfig : configOrOptions) as
    | StyledConfig
    | undefined
  const options = optionsIn
  const displayName = options?.displayName

  // do type stuff at top for easier readability

  // get parent props without pseudos and medias so we can rebuild both with new variants
  type ParentNonStyledProps = GetNonStyledProps<ParentComponent>
  type ParentStylesBase = GetBaseStyles<ParentComponent, StyledConfig>
  type ParentVariants = GetStyledVariants<ParentComponent>

  type OurVariantProps =
    AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>
  type MergedVariants =
    AreVariantsUndefined<Variants> extends true
      ? ParentVariants
      : AreVariantsUndefined<ParentVariants> extends true
        ? Omit<OurVariantProps, '_isEmpty'>
        : {
            // exclude _isEmpty as it no longer is empty
            [Key in Exclude<keyof ParentVariants | keyof OurVariantProps, '_isEmpty'>]?:
              | (Key extends keyof ParentVariants ? ParentVariants[Key] : undefined)
              | (Key extends keyof OurVariantProps ? OurVariantProps[Key] : undefined)
          }

  type Accepted = StyledConfig['accept']
  type CustomTokenProps =
    Accepted extends Record<string, any>
      ? {
          [Key in keyof Accepted]?:
            | (Key extends keyof ParentStylesBase ? ParentStylesBase[Key] : never)
            | (Accepted[Key] extends 'style'
                ? Partial<InferStyleProps<ParentComponent, StyledConfig>>
                : Accepted[Key] extends 'textStyle'
                  ? Partial<InferStyleProps<typeof Text, StyledConfig>>
                  : ThemeValueByCategory<Accepted[Key]>)
        }
      : {}

  /**
   * de-opting a bit of type niceness because were hitting depth issues too soon
   * before we had:
   *
   * type OurPropsBase = OurStylesBase & PseudoProps<Partial<OurStylesBase>>
   * and then below in type Props you would remove the PseudoProps line
   * that would give you nicely merged pseudo sub-styles but its just too much for TS
   * so now pseudos wont be nicely typed inside media queries, but at least we can nest
   */

  type StyledComponent = TamaguiComponent<
    TamaDefer,
    GetRef<ParentComponent>,
    ParentNonStyledProps,
    Accepted extends Record<string, any>
      ? ParentStylesBase & CustomTokenProps
      : ParentStylesBase,
    StyledVariantsWithContext<
      MergedVariants,
      GetStyledContextVariantProps<ParentComponent, Context, ContextPropKeys>
    >,
    GetStaticConfig<ParentComponent, StyledConfig>
  >

  // validate not using a variant over an existing valid style
  if (process.env.NODE_ENV !== 'production') {
    if (!ComponentIn) {
      throw new Error(`No component given to styled()`)
    }
  }

  const parentStaticConfig = ComponentIn['staticConfig'] as StaticConfig | undefined

  const requestedReactNativeInterop = Boolean(
    config?.isReactNative || parentStaticConfig?.isReactNative
  )

  if (
    process.env.TAMAGUI_TARGET !== 'native' &&
    process.env.NODE_ENV === 'development' &&
    requestedReactNativeInterop
  ) {
    warnOnce(
      'isReactNative-web-removed',
      'The isReactNative styled-component option is native-only in Tamagui v3. React Native Web hosts on web are no longer adapted; use a component that accepts className, data-* attributes, and DOM events.'
    )
  }

  const isReactNative =
    process.env.TAMAGUI_TARGET === 'native' &&
    Boolean(config?.isReactNative || parentStaticConfig?.isReactNative)

  const isPlainStyledComponent =
    !!parentStaticConfig && !(isReactNative || parentStaticConfig.isHOC)

  const isNonStyledHOC = parentStaticConfig?.isHOC && !parentStaticConfig?.isStyledHOC

  let Component: any =
    isNonStyledHOC || isPlainStyledComponent
      ? ComponentIn
      : parentStaticConfig?.Component || ComponentIn

  const reactNativeConfig =
    process.env.TAMAGUI_TARGET === 'native' && !parentStaticConfig
      ? getReactNativeConfig(Component)
      : undefined

  const resolvedIsReactNative = Boolean(reactNativeConfig || isReactNative)

  const staticConfigProps = (() => {
    let {
      variants,
      displayName: _displayName,
      defaultVariants,
      context,
      contextProps,
      compoundVariants,
      ...defaultProps
    } = (options || {}) as Record<string, any>

    let parentDefaultVariants
    let parentDefaultProps
    let parentCompoundVariants
    const mergedBaseClassName =
      parentStaticConfig?.baseClassName && baseClassName
        ? `${parentStaticConfig.baseClassName} ${baseClassName}`
        : baseClassName || parentStaticConfig?.baseClassName

    if (parentStaticConfig) {
      const avoid = parentStaticConfig.isHOC && !parentStaticConfig.isStyledHOC
      if (!avoid) {
        const pdp = parentStaticConfig.defaultProps

        // apply parent props only if not already defined, they are lesser specificity
        for (const key in pdp) {
          const val = pdp[key]
          if (parentStaticConfig.defaultVariants) {
            if (key in parentStaticConfig.defaultVariants) {
              // ensure we don't add it if its also in our default variants so we keep the order!
              if (!defaultVariants || !(key in defaultVariants)) {
                parentDefaultVariants ||= {}
                parentDefaultVariants[key] = val
              }
            }
          }
          if (!(key in defaultProps) && (!defaultVariants || !(key in defaultVariants))) {
            parentDefaultProps ||= {}
            parentDefaultProps[key] = pdp[key]
          }
        }
        if (parentStaticConfig.variants) {
          variants = mergeVariants(parentStaticConfig.variants, variants)
        }
        parentCompoundVariants = parentStaticConfig.compoundVariants
      }
    }

    const mergedCompoundVariants =
      parentCompoundVariants || compoundVariants
        ? [...(parentCompoundVariants || []), ...(compoundVariants || [])]
        : undefined
    const mergedContext = context || parentStaticConfig?.context
    const mergedContextProps = context
      ? contextProps
      : contextProps || parentStaticConfig?.contextProps

    // applies everything in the right order! order is important
    if (parentDefaultProps || defaultVariants || parentDefaultVariants) {
      defaultProps = {
        ...parentDefaultProps,
        ...parentDefaultVariants,
        ...defaultProps,
        ...defaultVariants,
      }
    }

    const isText = Boolean(config?.isText || parentStaticConfig?.isText)

    const acceptsClassName =
      config?.acceptsClassName ??
      (isPlainStyledComponent ||
        resolvedIsReactNative ||
        (parentStaticConfig?.isHOC && parentStaticConfig?.acceptsClassName))

    const conf: Partial<StaticConfig> = {
      ...parentStaticConfig,
      ...config,
      ...(!isPlainStyledComponent && {
        Component,
      }),
      variants,
      compoundVariants: mergedCompoundVariants,
      baseClassName: mergedBaseClassName,
      defaultProps,
      defaultVariants,
      ...(process.env.TAMAGUI_TARGET === 'native' && {
        isReactNative: resolvedIsReactNative,
      }),
      isText,
      acceptsClassName,
      context: mergedContext,
      contextProps: mergedContextProps,
      ...reactNativeConfig,
      isStyledHOC: Boolean(parentStaticConfig?.isHOC),
      parentStaticConfig,
      // only an explicitly bound frontend overrides the one inherited from the parent
      ...(frontend && { styleFrontend: frontend }),
    }

    if (process.env.TAMAGUI_TARGET !== 'native') {
      delete conf.isReactNative
    }

    // bail on non className views as well
    if (defaultProps['children'] || !acceptsClassName || mergedContext) {
      conf.neverFlatten = true
    }

    return conf
  })()

  const component = setComponentDisplayName(
    createComponent(staticConfigProps || {}),
    displayName || (ComponentIn as any)[componentDisplayName]
  )

  for (const key in ComponentIn) {
    // dont inherit propTypes
    if (key === 'propTypes') continue
    if (key in component) continue
    // @ts-expect-error assigning static properties over
    component[key] = ComponentIn[key]
  }

  return component as any as StyledComponent
}

// ---- styled.a, styled.div, styled.button, etc. API ----

type StyledHtmlFactory<Tag extends keyof HTMLElementTagNameMap> = <
  Variants extends VariantDefinitions<any, any> | undefined = undefined,
>(
  options?: Partial<HTMLElementStyle<Tag>> & {
    displayName?: string
    variants?: Variants
    defaultVariants?: GetVariantAcceptedValues<NonNullable<Variants>>
    context?: StyledContext
  }
) => TamaguiComponent<
  TamaDefer,
  HTMLElementTagNameMap[Tag],
  TamaguiComponentPropsBase & HTMLElementSpecificProps<Tag>,
  HTMLElementStyleBase<Tag>,
  Variants extends undefined
    ? {}
    : AreVariantsUndefined<NonNullable<Variants>> extends true
      ? {}
      : GetVariantAcceptedValues<NonNullable<Variants>>,
  {}
>

type StyledHtmlFactories = {
  [K in keyof HTMLElementTagNameMap]: StyledHtmlFactory<K>
}

// use a proxy to make styled.a(), styled.div() etc work
const styledExport = new Proxy(styled as typeof styled & StyledHtmlFactories, {
  get(target, prop: string) {
    if (prop in target) {
      return (target as any)[prop]
    }
    // return factory for HTML elements
    return (options: any) => styledHtml(prop as keyof HTMLElementTagNameMap, options)
  },
})

export { styledExport as styled }
