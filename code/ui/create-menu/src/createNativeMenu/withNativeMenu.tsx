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

  // On native platform, always use native component
  // If NativeComponent is missing (zeego not set up), fall back to web Component
  if (!NativeComponent) {
    return Component as React.FC<Props>
  }

  const Menu: React.FC<Props> = (props) => {
    return <NativeComponent {...(props as any)} />
  }

  // displayName is required for Portal flattening (checks displayName.includes('Portal'))
  Menu.displayName = NativeComponent.displayName || Component?.displayName

  return Menu
}
