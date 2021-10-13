import { createComponent } from './createComponent'
import { extendStaticConfig } from './helpers/extendStaticConfig'
import { StaticComponent, TamaguiConfig, Themes, Tokens } from './types'

export type GetProps<A> = A extends StaticComponent<infer Props>
  ? Props
  : A extends React.Component<infer Props>
  ? Props
  : {}

export function styled<
  A extends StaticComponent | React.Component<any>,
  StyledVariants extends void | {
    [key: string]: {
      [key: string]:
        | Partial<GetProps<A>>
        | ((
            val: any,
            config: {
              tokens: TamaguiConfig['tokens']
              theme: Themes extends { [key: string]: infer B } ? B : unknown
            }
          ) => Partial<GetProps<A>>)
    }
  }
>(
  Component: A,
  options?: GetProps<A> & {
    variants?: StyledVariants
  }
) {
  const staticConfigProps = (() => {
    if (options) {
      const { variants, ...defaultProps } = options
      return { variants, defaultProps }
    }
    return {}
  })()
  const config = extendStaticConfig(Component, staticConfigProps)
  const component = createComponent(config!) // error is good here its on init

  type ParentVariants = A extends StaticComponent<any, infer Variants> ? Variants : {}

  type VariantProps = StyledVariants extends void //ParentVariants &
    ? {}
    : {
        // ensure variants actually defined
        [key in keyof StyledVariants]?: keyof StyledVariants[keyof StyledVariants] extends  //   : //   ? boolean // keyof Variants[keyof Variants] extends 'true'
        `...${infer VariantSpread}`
          ? VariantSpread extends keyof Tokens
            ? keyof Tokens[VariantSpread]
            : unknown
          : keyof StyledVariants[keyof StyledVariants] extends 'true'
          ? boolean
          : keyof StyledVariants[keyof StyledVariants]
      }

  return component as StaticComponent<
    GetProps<A> & VariantProps,
    VariantProps
    // typeof config,
    // ParentVariants
  >
}

// TODO get name
// const displayName = `styled(Component)`
// Object.defineProperty(component, 'name', {
//   value: displayName,
//   writable: false,
// })
