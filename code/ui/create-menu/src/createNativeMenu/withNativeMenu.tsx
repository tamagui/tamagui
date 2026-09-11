import { getNativeMenuAdapter } from '@tamagui/native'
import { isWeb } from '@tamagui/web'

type GetProps<T> = T extends React.ComponentType<infer P> ? P : never

export function withNativeMenu<
  C extends React.ComponentType<any>,
  N extends React.ComponentType<any>,
  CP = GetProps<C>,
  NP = GetProps<N>,
>({
  Component,
  NativeComponent,
}: {
  Component: C
  NativeComponent: N
  scope?: string
  isRoot?: boolean
}): React.FC<CP & Partial<Omit<NP, keyof CP>>> {
  type Props = CP & Partial<Omit<NP, keyof CP>>

  if (isWeb) {
    return Component as React.FC<Props>
  }

  // use the native component when an adapter is registered
  if (!NativeComponent) {
    return Component as React.FC<Props>
  }

  const Menu: React.FC<Props> = (props) => {
    // adapters register during app setup, so read at render time. with none
    // installed every native component renders null, which silently erases the
    // whole menu: fall back to the cross-platform implementation instead
    if (!getNativeMenuAdapter()) {
      return <Component {...(props as any)} />
    }
    return <NativeComponent {...(props as any)} />
  }

  // displayName is required for Portal flattening (checks displayName.includes('Portal'))
  Menu.displayName = NativeComponent.displayName || Component?.displayName

  return Menu
}
