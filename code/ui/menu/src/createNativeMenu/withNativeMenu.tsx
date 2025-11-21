import { isWeb } from '@tamagui/core'

export function withNativeMenu<
  C extends React.ComponentType<any>,
  N extends React.ComponentType<any>
>({
  Component,
  NativeComponent,
  useNativeProp,
  useNativePropScope,
  isRoot = false,
}: {
  Component: C
  NativeComponent: N
  useNativeProp: (scope: string) => { native: boolean }
  useNativePropScope: string
  isRoot: boolean
}) {
  if (isWeb) return Component
  const Menu = (
    props: React.ComponentProps<C> & React.ComponentProps<N> & { native?: boolean }
  ) => {
    let isNative = true
    if (isRoot) {
      isNative = props.native
    } else {
      isNative = useNativeProp(useNativePropScope).native
    }
    if (isNative) {
      return <NativeComponent {...(props as React.ComponentProps<N>)} />
    }

    return <Component {...(props as React.ComponentProps<C>)} />
  }

  Menu.displayName = `${Component.displayName}Wrapper`

  return Menu
}
