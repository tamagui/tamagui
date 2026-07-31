declare module 'tamagui' {
  type TamaguiComponent<Props> = ((props: Props) => unknown) & {
    staticConfig: object
  }

  type ViewProps = {
    bg?: string
    display?: 'flex'
    padding?: string
  }

  type TextProps = ViewProps & {
    color?: string
    fontSize?: string
  }

  export const View: TamaguiComponent<ViewProps>
  export const Text: TamaguiComponent<TextProps>
  export function styled<T>(component: T, config: ViewProps): T
}

declare module '@tamagui/logo' {
  export function LogoIcon(props: { color?: string }): unknown
}

declare module '@tamagui/tailwind' {
  export function styled<T>(
    component: T,
    config: {
      variants?: {
        roomy?: {
          padding?: string
        }
      }
    }
  ): T
}
