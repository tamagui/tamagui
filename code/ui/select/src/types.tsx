import type { ContextData, FloatingContext, ReferenceType } from '@floating-ui/react'
import type { NativePlatform, NativeValue, SizeTokens } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import type { ThemeableStackProps, YStackProps } from '@tamagui/stacks'
import type { DispatchWithoutAction, HTMLProps, MutableRefObject, ReactNode } from 'react'

export type SelectDirection = 'ltr' | 'rtl'

export type SelectScopedProps<P> = P & { __scopeSelect?: Scope }

export type SelectImplProps = SelectScopedProps<SelectProps> & {
  activeIndexRef: any
  selectedIndexRef: any
  listContentRef: any
}

export interface SelectProps {
  id?: string
  children?: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?(value: string): void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  dir?: SelectDirection
  name?: string
  autoComplete?: string
  size?: SizeTokens
  /**
   * If passed, will render a native component instead of the custom one. Currently only `web` is supported.
   */
  native?: NativeValue<'web'>

  /**
   * When true, avoids removing the scrollbar from the body when open
   */
  disablePreventBodyScroll?: boolean

  /**
   * Called when an item is hovered by mouse or navigated to by keyboard.
   */
  onActiveChange?(value: string, index: number): void
}

type DisposeFn = () => void
export type EmitterSubscriber<Val> = (cb: (val: Val) => void) => DisposeFn

export interface SelectItemParentContextValue {
  id?: string
  initialValue?: any
  setSelectedIndex: (index: number) => void
  listRef?: MutableRefObject<Array<HTMLElement | null>>
  setOpen: (open: boolean) => void
  onChange: (value: string) => void
  onActiveChange: (value: string, index: number) => void
  activeIndexSubscribe: EmitterSubscriber<number>
  valueSubscribe: EmitterSubscriber<any>
  allowSelectRef?: MutableRefObject<boolean>
  allowMouseUpRef?: MutableRefObject<boolean>
  setValueAtIndex: (index: number, value: string) => void
  selectTimeoutRef?: MutableRefObject<any>
  dataRef?: MutableRefObject<ContextData>
  interactions?: {
    getReferenceProps: (userProps?: HTMLProps<Element> | undefined) => any
    getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any
    getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any
  }
  shouldRenderWebNative?: boolean
  size?: SizeTokens
}

export interface SelectContextValue {
  dir?: SelectDirection
  scopeKey: string
  value: any
  selectedItem: ReactNode
  setSelectedItem: (item: ReactNode) => void
  selectedIndex: number
  activeIndex: number | null
  setActiveIndex: (index: number | null) => void
  open: boolean
  valueNode: Element | null
  onValueNodeChange(node: HTMLElement): void
  forceUpdate: DispatchWithoutAction
  // SheetImpl only:
  isInSheet?: boolean
  // InlineImpl only:
  fallback: boolean
  blockSelection: boolean
  upArrowRef?: MutableRefObject<HTMLDivElement | null>
  downArrowRef?: MutableRefObject<HTMLDivElement | null>
  setScrollTop?: Function
  setInnerOffset?: Function
  controlledScrolling?: boolean
  canScrollUp?: boolean
  canScrollDown?: boolean
  floatingContext?: FloatingContext<ReferenceType>
  native?: NativeValue
  disablePreventBodyScroll?: boolean
  /** update floating-ui to recalculate */
  update?: () => void
}

export interface SelectViewportExtraProps {
  size?: SizeTokens
  disableScroll?: boolean
  unstyled?: boolean
}

export type SelectViewportProps = ThemeableStackProps & SelectViewportExtraProps

export type SelectContentProps = SelectScopedProps<{
  children?: React.ReactNode
  zIndex?: number
}>

export interface SelectScrollButtonImplProps extends YStackProps {
  dir: 'up' | 'down'
  componentName: string
}

export interface SelectScrollButtonProps
  extends Omit<SelectScrollButtonImplProps, 'dir' | 'componentName'> {}
