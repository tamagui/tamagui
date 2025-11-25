import { isWeb } from '@tamagui/web'

type CombinedProps<C, N> = C extends React.ComponentType<infer CP>
  ? N extends React.ComponentType<infer NP>
    ? CP & NP
    : CP
  : N extends React.ComponentType<infer NP>
    ? NP
    : {}

export function withNativeMenu<
  C extends React.ComponentType<any>,
  N extends React.ComponentType<any>,
>({
  Component,
  NativeComponent,
}: {
  Component: C
  NativeComponent: N
  scope?: string
  isRoot?: boolean
}): React.FC<CombinedProps<C, N>> {
  type Props = CombinedProps<C, N>

  if (isWeb) {
    return Component as React.FC<Props>
  }

  // On native platform, always use native component
  const Menu: React.FC<Props> = (props) => {
    return <NativeComponent {...(props as React.ComponentProps<N>)} />
  }

  // displayName is required for Portal flattening (checks displayName.includes('Portal'))
  Menu.displayName = NativeComponent.displayName || Component.displayName

  return Menu
}
