import { isWeb } from '@tamagui/web'
import { useNativeProp as useNativePropHook } from '../createBaseMenu'

export function withNativeMenu<
  C extends React.ComponentType<any>,
  N extends React.ComponentType<any>,
>({
  Component,
  NativeComponent,
  scope,
  isRoot = false,
}: {
  Component: C
  NativeComponent: N
  scope: string
  isRoot: boolean
}) {
  if (isWeb) {
    return Component
  }

  const Menu = (
    props: React.ComponentProps<C> & React.ComponentProps<N> & { native?: boolean }
  ) => {
    // Always call hook unconditionally (Rules of Hooks)
    const contextNative = useNativePropHook(scope).native

    // Determine if we should use native rendering
    const isNative = isRoot
      ? props.native !== undefined
        ? props.native
        : true // Root uses prop with default true
      : contextNative // Children use context from root

    if (isNative) {
      return <NativeComponent {...(props as React.ComponentProps<N>)} />
    }

    return <Component {...(props as React.ComponentProps<C>)} />
  }

  // displayName is required for Portal flattening (checks displayName.includes('Portal'))
  Menu.displayName =
    NativeComponent.displayName || Component.displayName || 'MenuComponent'

  return Menu
}
