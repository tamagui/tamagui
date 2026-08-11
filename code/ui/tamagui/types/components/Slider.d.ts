import { type TamaguiElement, type ThemeProps } from '@tamagui/ui'
import type * as React from 'react'
export declare const SliderTrackFrame: React.FunctionComponent<
  Omit<
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/web').GetFinalProps<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/web').StackStyleBase,
          {
            elevation?: number | import('@tamagui/web').Size | undefined
          }
        >,
        'elevation'
      > &
      import('@tamagui/ui').StackVariants & {
        size?: import('@tamagui/ui').SizeTokens | true
      } & {
        __scopeSlider?: string
      },
    'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
  > &
    import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    } & import('@tamagui/web').WithShorthands<
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
    > & {
      ref?:
        | React.Ref<
            | import('react-native').View
            | (HTMLElement & import('@tamagui/web').TamaguiElementMethods)
          >
        | undefined
    }
> &
  import('@tamagui/web').StaticComponentObject<
    import('@tamagui/web').TamaDefer,
    | import('react-native').View
    | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/web').GetFinalProps<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/web').StackStyleBase,
          {
            elevation?: number | import('@tamagui/web').Size | undefined
          }
        >,
        'elevation'
      > &
      import('@tamagui/ui').StackVariants & {
        size?: import('@tamagui/ui').SizeTokens | true
      } & {
        __scopeSlider?: string
      },
    import('@tamagui/web').StackStyleBase,
    {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    },
    import('@tamagui/web').StaticConfigPublic
  > &
  Omit<import('@tamagui/web').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/web').TamaDefer,
      (
        | import('react-native').View
        | (HTMLElement & import('@tamagui/web').TamaguiElementMethods)
      ),
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/web').GetFinalProps<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            import('@tamagui/web').StackStyleBase,
            {
              elevation?: number | import('@tamagui/web').Size | undefined
            }
          >,
          'elevation'
        > &
        import('@tamagui/ui').StackVariants & {
          size?: import('@tamagui/ui').SizeTokens | true
        } & {
          __scopeSlider?: string
        },
      import('@tamagui/web').StackStyleBase,
      {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      },
      import('@tamagui/web').StaticConfigPublic,
    ]
  }
export declare const SliderTrack: import('@tamagui/ui').TamaguiComponent<
  Omit<
    import('@tamagui/web').GetFinalProps<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/web').GetFinalProps<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            import('@tamagui/web').StackStyleBase,
            {
              elevation?: number | import('@tamagui/web').Size | undefined
            }
          >,
          'elevation'
        > &
        import('@tamagui/ui').StackVariants & {
          size?: import('@tamagui/ui').SizeTokens | true
        } & {
          __scopeSlider?: string
        },
      import('@tamagui/web').StackStyleBase,
      {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      }
    >,
    | '__scopeSlider'
    | 'elevation'
    | 'orientation'
    | 'size'
    | keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
    | keyof import('@tamagui/web').StackStyleBase
  > &
    Omit<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/web').GetFinalProps<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            import('@tamagui/web').StackStyleBase,
            {
              elevation?: number | import('@tamagui/web').Size | undefined
            }
          >,
          'elevation'
        > &
        import('@tamagui/ui').StackVariants & {
          size?: import('@tamagui/ui').SizeTokens | true
        } & {
          __scopeSlider?: string
        },
      'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
    > &
    import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    } & import('@tamagui/web').WithShorthands<
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
    > & {
      theme?: ThemeProps['name']
    },
  | import('react-native').View
  | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
  import('@tamagui/core').RNTamaguiViewNonStyleProps &
    Omit<
      import('@tamagui/web').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        import('@tamagui/web').StackStyleBase,
        {
          elevation?: number | import('@tamagui/web').Size | undefined
        }
      >,
      'elevation'
    > &
    import('@tamagui/ui').StackVariants & {
      size?: import('@tamagui/ui').SizeTokens | true
    } & {
      __scopeSlider?: string
    } & Omit<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/web').GetFinalProps<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            import('@tamagui/web').StackStyleBase,
            {
              elevation?: number | import('@tamagui/web').Size | undefined
            }
          >,
          'elevation'
        > &
        import('@tamagui/ui').StackVariants & {
          size?: import('@tamagui/ui').SizeTokens | true
        } & {
          __scopeSlider?: string
        },
      'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
    > &
    import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    } & import('@tamagui/web').WithShorthands<
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
    > & {
      theme?: ThemeProps['name']
    },
  import('@tamagui/web').StackStyleBase,
  {
    elevation?: number | import('@tamagui/web').Size | undefined
    orientation?: 'horizontal' | 'vertical' | undefined
    size?: any
  },
  import('@tamagui/web').StaticConfigPublic
>
export declare const SliderActiveFrame: React.FunctionComponent<
  Omit<
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > & {
        __scopeSlider?: string
      },
    'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
  > &
    import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    } & import('@tamagui/web').WithShorthands<
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
    > & {
      ref?:
        | React.Ref<
            | import('react-native').View
            | (HTMLElement & import('@tamagui/web').TamaguiElementMethods)
          >
        | undefined
    }
> &
  import('@tamagui/web').StaticComponentObject<
    import('@tamagui/web').TamaDefer,
    | import('react-native').View
    | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > & {
        __scopeSlider?: string
      },
    import('@tamagui/web').StackStyleBase,
    {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    },
    import('@tamagui/web').StaticConfigPublic
  > &
  Omit<import('@tamagui/web').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/web').TamaDefer,
      (
        | import('react-native').View
        | (HTMLElement & import('@tamagui/web').TamaguiElementMethods)
      ),
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          | 'elevation'
          | 'orientation'
          | 'size'
          | keyof import('@tamagui/web').StackStyleBase
        > &
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
          elevation?: number | import('@tamagui/web').Size | undefined
          orientation?: 'horizontal' | 'vertical' | undefined
          size?: any
        } & import('@tamagui/web').WithShorthands<
          import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
        > & {
          __scopeSlider?: string
        },
      import('@tamagui/web').StackStyleBase,
      {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      },
      import('@tamagui/web').StaticConfigPublic,
    ]
  }
export declare const SliderActive: import('@tamagui/ui').TamaguiComponent<
  Omit<
    import('@tamagui/web').GetFinalProps<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          | 'elevation'
          | 'orientation'
          | 'size'
          | keyof import('@tamagui/web').StackStyleBase
        > &
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
          elevation?: number | import('@tamagui/web').Size | undefined
          orientation?: 'horizontal' | 'vertical' | undefined
          size?: any
        } & import('@tamagui/web').WithShorthands<
          import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
        > & {
          __scopeSlider?: string
        },
      import('@tamagui/web').StackStyleBase,
      {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      }
    >,
    | '__scopeSlider'
    | 'elevation'
    | 'orientation'
    | 'size'
    | keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
    | keyof import('@tamagui/web').StackStyleBase
  > &
    Omit<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          | 'elevation'
          | 'orientation'
          | 'size'
          | keyof import('@tamagui/web').StackStyleBase
        > &
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
          elevation?: number | import('@tamagui/web').Size | undefined
          orientation?: 'horizontal' | 'vertical' | undefined
          size?: any
        } & import('@tamagui/web').WithShorthands<
          import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
        > & {
          __scopeSlider?: string
        },
      'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
    > &
    import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    } & import('@tamagui/web').WithShorthands<
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
    > & {
      theme?: ThemeProps['name']
    },
  | import('react-native').View
  | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
  import('@tamagui/core').RNTamaguiViewNonStyleProps &
    Omit<
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
    > &
    import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    } & import('@tamagui/web').WithShorthands<
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
    > & {
      __scopeSlider?: string
    } & Omit<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          | 'elevation'
          | 'orientation'
          | 'size'
          | keyof import('@tamagui/web').StackStyleBase
        > &
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
          elevation?: number | import('@tamagui/web').Size | undefined
          orientation?: 'horizontal' | 'vertical' | undefined
          size?: any
        } & import('@tamagui/web').WithShorthands<
          import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
        > & {
          __scopeSlider?: string
        },
      'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
    > & {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    } & {
      theme?: ThemeProps['name']
    },
  import('@tamagui/web').StackStyleBase,
  {
    elevation?: number | import('@tamagui/web').Size | undefined
    orientation?: 'horizontal' | 'vertical' | undefined
    size?: any
  },
  import('@tamagui/web').StaticConfigPublic
>
export declare const SliderThumbFrame: React.FunctionComponent<
  Omit<
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        | 'circular'
        | 'elevate'
        | 'elevation'
        | 'size'
        | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        circular?: boolean | undefined
        elevate?: boolean | undefined
        elevation?: number | import('@tamagui/web').Size | undefined
        size?: number | import('@tamagui/web').Size | undefined
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > &
      import('@tamagui/ui').SliderThumbExtraProps & {
        __scopeSlider?: string
      },
    | 'circular'
    | 'elevate'
    | 'elevation'
    | 'size'
    | keyof import('@tamagui/web').StackStyleBase
  > &
    import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
      circular?: boolean | undefined
      elevate?: boolean | undefined
      elevation?: number | import('@tamagui/web').Size | undefined
      size?: number | import('@tamagui/web').Size | undefined
    } & import('@tamagui/web').WithShorthands<
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
    > & {
      ref?:
        | React.Ref<
            | import('react-native').View
            | (HTMLElement & import('@tamagui/web').TamaguiElementMethods)
          >
        | undefined
    }
> &
  import('@tamagui/web').StaticComponentObject<
    import('@tamagui/web').TamaDefer,
    | import('react-native').View
    | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        | 'circular'
        | 'elevate'
        | 'elevation'
        | 'size'
        | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        circular?: boolean | undefined
        elevate?: boolean | undefined
        elevation?: number | import('@tamagui/web').Size | undefined
        size?: number | import('@tamagui/web').Size | undefined
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > &
      import('@tamagui/ui').SliderThumbExtraProps & {
        __scopeSlider?: string
      },
    import('@tamagui/web').StackStyleBase,
    {
      circular?: boolean | undefined
      elevate?: boolean | undefined
      elevation?: number | import('@tamagui/web').Size | undefined
      size?: number | import('@tamagui/web').Size | undefined
    },
    import('@tamagui/web').StaticConfigPublic
  > &
  Omit<import('@tamagui/web').StaticConfigPublic, 'staticConfig'> & {
    __tama: [
      import('@tamagui/web').TamaDefer,
      (
        | import('react-native').View
        | (HTMLElement & import('@tamagui/web').TamaguiElementMethods)
      ),
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          | 'circular'
          | 'elevate'
          | 'elevation'
          | 'size'
          | keyof import('@tamagui/web').StackStyleBase
        > &
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
          circular?: boolean | undefined
          elevate?: boolean | undefined
          elevation?: number | import('@tamagui/web').Size | undefined
          size?: number | import('@tamagui/web').Size | undefined
        } & import('@tamagui/web').WithShorthands<
          import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
        > &
        import('@tamagui/ui').SliderThumbExtraProps & {
          __scopeSlider?: string
        },
      import('@tamagui/web').StackStyleBase,
      {
        circular?: boolean | undefined
        elevate?: boolean | undefined
        elevation?: number | import('@tamagui/web').Size | undefined
        size?: number | import('@tamagui/web').Size | undefined
      },
      import('@tamagui/web').StaticConfigPublic,
    ]
  }
export declare const SliderThumb: import('@tamagui/ui').TamaguiComponent<
  Omit<
    import('@tamagui/web').GetFinalProps<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          | 'circular'
          | 'elevate'
          | 'elevation'
          | 'size'
          | keyof import('@tamagui/web').StackStyleBase
        > &
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
          circular?: boolean | undefined
          elevate?: boolean | undefined
          elevation?: number | import('@tamagui/web').Size | undefined
          size?: number | import('@tamagui/web').Size | undefined
        } & import('@tamagui/web').WithShorthands<
          import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
        > &
        import('@tamagui/ui').SliderThumbExtraProps & {
          __scopeSlider?: string
        },
      import('@tamagui/web').StackStyleBase,
      {
        circular?: boolean | undefined
        elevate?: boolean | undefined
        elevation?: number | import('@tamagui/web').Size | undefined
        size?: number | import('@tamagui/web').Size | undefined
      }
    >,
    | '__scopeSlider'
    | 'circular'
    | 'elevate'
    | 'elevation'
    | 'index'
    | 'size'
    | keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
    | keyof import('@tamagui/web').StackStyleBase
  > &
    Omit<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          | 'circular'
          | 'elevate'
          | 'elevation'
          | 'size'
          | keyof import('@tamagui/web').StackStyleBase
        > &
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
          circular?: boolean | undefined
          elevate?: boolean | undefined
          elevation?: number | import('@tamagui/web').Size | undefined
          size?: number | import('@tamagui/web').Size | undefined
        } & import('@tamagui/web').WithShorthands<
          import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
        > &
        import('@tamagui/ui').SliderThumbExtraProps & {
          __scopeSlider?: string
        },
      | 'circular'
      | 'elevate'
      | 'elevation'
      | 'size'
      | keyof import('@tamagui/web').StackStyleBase
    > &
    import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
      circular?: boolean | undefined
      elevate?: boolean | undefined
      elevation?: number | import('@tamagui/web').Size | undefined
      size?: number | import('@tamagui/web').Size | undefined
    } & import('@tamagui/web').WithShorthands<
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
    > & {
      theme?: ThemeProps['name']
    },
  | import('react-native').View
  | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
  import('@tamagui/core').RNTamaguiViewNonStyleProps &
    Omit<
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      | 'circular'
      | 'elevate'
      | 'elevation'
      | 'size'
      | keyof import('@tamagui/web').StackStyleBase
    > &
    import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
      circular?: boolean | undefined
      elevate?: boolean | undefined
      elevation?: number | import('@tamagui/web').Size | undefined
      size?: number | import('@tamagui/web').Size | undefined
    } & import('@tamagui/web').WithShorthands<
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
    > &
    import('@tamagui/ui').SliderThumbExtraProps & {
      __scopeSlider?: string
    } & Omit<
      import('@tamagui/core').RNTamaguiViewNonStyleProps &
        Omit<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          | 'circular'
          | 'elevate'
          | 'elevation'
          | 'size'
          | keyof import('@tamagui/web').StackStyleBase
        > &
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
          circular?: boolean | undefined
          elevate?: boolean | undefined
          elevation?: number | import('@tamagui/web').Size | undefined
          size?: number | import('@tamagui/web').Size | undefined
        } & import('@tamagui/web').WithShorthands<
          import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
        > &
        import('@tamagui/ui').SliderThumbExtraProps & {
          __scopeSlider?: string
        },
      | 'circular'
      | 'elevate'
      | 'elevation'
      | 'size'
      | keyof import('@tamagui/web').StackStyleBase
    > & {
      circular?: boolean | undefined
      elevate?: boolean | undefined
      elevation?: number | import('@tamagui/web').Size | undefined
      size?: number | import('@tamagui/web').Size | undefined
    } & {
      theme?: ThemeProps['name']
    },
  import('@tamagui/web').StackStyleBase,
  {
    circular?: boolean | undefined
    elevate?: boolean | undefined
    elevation?: number | import('@tamagui/web').Size | undefined
    size?: number | import('@tamagui/web').Size | undefined
  },
  import('@tamagui/web').StaticConfigPublic
>
export declare const Slider: ((
  props: import('@tamagui/ui').SliderProps & {
    __scopeSlider?: string
  } & import('@tamagui/ui').RefProp<unknown> &
    import('@tamagui/ui').RefProp<TamaguiElement>
) => React.ReactNode) & {
  displayName?: string
  propTypes?: any
} & {
  Track: import('@tamagui/ui').TamaguiComponent<
    Omit<
      import('@tamagui/web').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<
            import('@tamagui/web').GetFinalProps<
              import('@tamagui/core').RNTamaguiViewNonStyleProps,
              import('@tamagui/web').StackStyleBase,
              {
                elevation?: number | import('@tamagui/web').Size | undefined
              }
            >,
            'elevation'
          > &
          import('@tamagui/ui').StackVariants & {
            size?: import('@tamagui/ui').SizeTokens | true
          } & {
            __scopeSlider?: string
          },
        import('@tamagui/web').StackStyleBase,
        {
          elevation?: number | import('@tamagui/web').Size | undefined
          orientation?: 'horizontal' | 'vertical' | undefined
          size?: any
        }
      >,
      | '__scopeSlider'
      | 'elevation'
      | 'orientation'
      | 'size'
      | keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
      | keyof import('@tamagui/web').StackStyleBase
    > &
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<
            import('@tamagui/web').GetFinalProps<
              import('@tamagui/core').RNTamaguiViewNonStyleProps,
              import('@tamagui/web').StackStyleBase,
              {
                elevation?: number | import('@tamagui/web').Size | undefined
              }
            >,
            'elevation'
          > &
          import('@tamagui/ui').StackVariants & {
            size?: import('@tamagui/ui').SizeTokens | true
          } & {
            __scopeSlider?: string
          },
        'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > & {
        theme?: ThemeProps['name']
      },
    | import('react-native').View
    | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/web').GetFinalProps<
          import('@tamagui/core').RNTamaguiViewNonStyleProps,
          import('@tamagui/web').StackStyleBase,
          {
            elevation?: number | import('@tamagui/web').Size | undefined
          }
        >,
        'elevation'
      > &
      import('@tamagui/ui').StackVariants & {
        size?: import('@tamagui/ui').SizeTokens | true
      } & {
        __scopeSlider?: string
      } & Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<
            import('@tamagui/web').GetFinalProps<
              import('@tamagui/core').RNTamaguiViewNonStyleProps,
              import('@tamagui/web').StackStyleBase,
              {
                elevation?: number | import('@tamagui/web').Size | undefined
              }
            >,
            'elevation'
          > &
          import('@tamagui/ui').StackVariants & {
            size?: import('@tamagui/ui').SizeTokens | true
          } & {
            __scopeSlider?: string
          },
        'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > & {
        theme?: ThemeProps['name']
      },
    import('@tamagui/web').StackStyleBase,
    {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    },
    import('@tamagui/web').StaticConfigPublic
  >
  TrackActive: import('@tamagui/ui').TamaguiComponent<
    Omit<
      import('@tamagui/web').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            | 'elevation'
            | 'orientation'
            | 'size'
            | keyof import('@tamagui/web').StackStyleBase
          > &
          import('@tamagui/web').WithThemeValues<
            import('@tamagui/web').StackStyleBase
          > & {
            elevation?: number | import('@tamagui/web').Size | undefined
            orientation?: 'horizontal' | 'vertical' | undefined
            size?: any
          } & import('@tamagui/web').WithShorthands<
            import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
          > & {
            __scopeSlider?: string
          },
        import('@tamagui/web').StackStyleBase,
        {
          elevation?: number | import('@tamagui/web').Size | undefined
          orientation?: 'horizontal' | 'vertical' | undefined
          size?: any
        }
      >,
      | '__scopeSlider'
      | 'elevation'
      | 'orientation'
      | 'size'
      | keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
      | keyof import('@tamagui/web').StackStyleBase
    > &
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            | 'elevation'
            | 'orientation'
            | 'size'
            | keyof import('@tamagui/web').StackStyleBase
          > &
          import('@tamagui/web').WithThemeValues<
            import('@tamagui/web').StackStyleBase
          > & {
            elevation?: number | import('@tamagui/web').Size | undefined
            orientation?: 'horizontal' | 'vertical' | undefined
            size?: any
          } & import('@tamagui/web').WithShorthands<
            import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
          > & {
            __scopeSlider?: string
          },
        'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > & {
        theme?: ThemeProps['name']
      },
    | import('react-native').View
    | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > & {
        __scopeSlider?: string
      } & Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            | 'elevation'
            | 'orientation'
            | 'size'
            | keyof import('@tamagui/web').StackStyleBase
          > &
          import('@tamagui/web').WithThemeValues<
            import('@tamagui/web').StackStyleBase
          > & {
            elevation?: number | import('@tamagui/web').Size | undefined
            orientation?: 'horizontal' | 'vertical' | undefined
            size?: any
          } & import('@tamagui/web').WithShorthands<
            import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
          > & {
            __scopeSlider?: string
          },
        'elevation' | 'orientation' | 'size' | keyof import('@tamagui/web').StackStyleBase
      > & {
        elevation?: number | import('@tamagui/web').Size | undefined
        orientation?: 'horizontal' | 'vertical' | undefined
        size?: any
      } & {
        theme?: ThemeProps['name']
      },
    import('@tamagui/web').StackStyleBase,
    {
      elevation?: number | import('@tamagui/web').Size | undefined
      orientation?: 'horizontal' | 'vertical' | undefined
      size?: any
    },
    import('@tamagui/web').StaticConfigPublic
  >
  Thumb: import('@tamagui/ui').TamaguiComponent<
    Omit<
      import('@tamagui/web').GetFinalProps<
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            | 'circular'
            | 'elevate'
            | 'elevation'
            | 'size'
            | keyof import('@tamagui/web').StackStyleBase
          > &
          import('@tamagui/web').WithThemeValues<
            import('@tamagui/web').StackStyleBase
          > & {
            circular?: boolean | undefined
            elevate?: boolean | undefined
            elevation?: number | import('@tamagui/web').Size | undefined
            size?: number | import('@tamagui/web').Size | undefined
          } & import('@tamagui/web').WithShorthands<
            import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
          > &
          import('@tamagui/ui').SliderThumbExtraProps & {
            __scopeSlider?: string
          },
        import('@tamagui/web').StackStyleBase,
        {
          circular?: boolean | undefined
          elevate?: boolean | undefined
          elevation?: number | import('@tamagui/web').Size | undefined
          size?: number | import('@tamagui/web').Size | undefined
        }
      >,
      | '__scopeSlider'
      | 'circular'
      | 'elevate'
      | 'elevation'
      | 'index'
      | 'size'
      | keyof import('@tamagui/core').RNTamaguiViewNonStyleProps
      | keyof import('@tamagui/web').StackStyleBase
    > &
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            | 'circular'
            | 'elevate'
            | 'elevation'
            | 'size'
            | keyof import('@tamagui/web').StackStyleBase
          > &
          import('@tamagui/web').WithThemeValues<
            import('@tamagui/web').StackStyleBase
          > & {
            circular?: boolean | undefined
            elevate?: boolean | undefined
            elevation?: number | import('@tamagui/web').Size | undefined
            size?: number | import('@tamagui/web').Size | undefined
          } & import('@tamagui/web').WithShorthands<
            import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
          > &
          import('@tamagui/ui').SliderThumbExtraProps & {
            __scopeSlider?: string
          },
        | 'circular'
        | 'elevate'
        | 'elevation'
        | 'size'
        | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        circular?: boolean | undefined
        elevate?: boolean | undefined
        elevation?: number | import('@tamagui/web').Size | undefined
        size?: number | import('@tamagui/web').Size | undefined
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > & {
        theme?: ThemeProps['name']
      },
    | import('react-native').View
    | (HTMLElement & import('@tamagui/web').TamaguiElementMethods),
    import('@tamagui/core').RNTamaguiViewNonStyleProps &
      Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps,
        | 'circular'
        | 'elevate'
        | 'elevation'
        | 'size'
        | keyof import('@tamagui/web').StackStyleBase
      > &
      import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase> & {
        circular?: boolean | undefined
        elevate?: boolean | undefined
        elevation?: number | import('@tamagui/web').Size | undefined
        size?: number | import('@tamagui/web').Size | undefined
      } & import('@tamagui/web').WithShorthands<
        import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
      > &
      import('@tamagui/ui').SliderThumbExtraProps & {
        __scopeSlider?: string
      } & Omit<
        import('@tamagui/core').RNTamaguiViewNonStyleProps &
          Omit<
            import('@tamagui/core').RNTamaguiViewNonStyleProps,
            | 'circular'
            | 'elevate'
            | 'elevation'
            | 'size'
            | keyof import('@tamagui/web').StackStyleBase
          > &
          import('@tamagui/web').WithThemeValues<
            import('@tamagui/web').StackStyleBase
          > & {
            circular?: boolean | undefined
            elevate?: boolean | undefined
            elevation?: number | import('@tamagui/web').Size | undefined
            size?: number | import('@tamagui/web').Size | undefined
          } & import('@tamagui/web').WithShorthands<
            import('@tamagui/web').WithThemeValues<import('@tamagui/web').StackStyleBase>
          > &
          import('@tamagui/ui').SliderThumbExtraProps & {
            __scopeSlider?: string
          },
        | 'circular'
        | 'elevate'
        | 'elevation'
        | 'size'
        | keyof import('@tamagui/web').StackStyleBase
      > & {
        circular?: boolean | undefined
        elevate?: boolean | undefined
        elevation?: number | import('@tamagui/web').Size | undefined
        size?: number | import('@tamagui/web').Size | undefined
      } & {
        theme?: ThemeProps['name']
      },
    import('@tamagui/web').StackStyleBase,
    {
      circular?: boolean | undefined
      elevate?: boolean | undefined
      elevation?: number | import('@tamagui/web').Size | undefined
      size?: number | import('@tamagui/web').Size | undefined
    },
    import('@tamagui/web').StaticConfigPublic
  >
}
//# sourceMappingURL=Slider.d.ts.map
