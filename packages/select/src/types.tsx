import type {
  ContextData,
  FloatingContext,
  ReferenceType,
} from '@floating-ui/react-dom-interactions'
import type { SizeTokens } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import type { ThemeableStackProps, YStackProps } from '@tamagui/stacks'
import type { DispatchWithoutAction, HTMLProps, MutableRefObject, ReactNode } from 'react'

export type Direction = 'ltr' | 'rtl'

export type ScopedProps<P> = P & { __scopeSelect?: Scope }

export interface SelectProps {
  id?: string
  children?: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?(value: string): void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  dir?: Direction
  name?: string
  autoComplete?: string
  size?: SizeTokens
}

export interface SelectContextValue {
  dir?: Direction
  scopeKey: string
  sheetBreakpoint: any
  size?: SizeTokens
  value: any
  selectedItem: ReactNode
  setSelectedItem: (item: ReactNode) => void
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  activeIndex: number | null
  setActiveIndex: (index: number | null) => void
  setValueAtIndex: (index: number, value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  onChange: (value: string) => void
  valueNode: Element | null
  onValueNodeChange(node: HTMLElement): void
  valueNodeHasChildren: boolean
  onValueNodeHasChildrenChange(hasChildren: boolean): void
  forceUpdate: DispatchWithoutAction

  // SheetImpl only:
  isInSheet?: boolean

  // InlineImpl only:
  fallback: boolean
  blockSelection: boolean
  allowSelectRef?: MutableRefObject<boolean>
  allowMouseUpRef?: MutableRefObject<boolean>
  upArrowRef?: MutableRefObject<HTMLDivElement | null>
  downArrowRef?: MutableRefObject<HTMLDivElement | null>
  selectTimeoutRef?: MutableRefObject<any>
  setScrollTop?: Function
  setInnerOffset?: Function
  dataRef?: MutableRefObject<ContextData>
  controlledScrolling?: boolean
  listRef?: MutableRefObject<Array<HTMLElement | null>>
  floatingRef?: MutableRefObject<HTMLElement | null>
  canScrollUp?: boolean
  canScrollDown?: boolean
  floatingContext?: FloatingContext<ReferenceType>
  interactions?: {
    getReferenceProps: (userProps?: HTMLProps<Element> | undefined) => any
    getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any
    getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => any
  }
}

export type SelectViewportProps = ThemeableStackProps & {
  size?: SizeTokens
}

export type SelectContentProps = ScopedProps<{ children?: React.ReactNode; zIndex?: number }>

export interface SelectScrollButtonImplProps extends YStackProps {
  dir: 'up' | 'down'
  componentName: string
}

export interface SelectScrollButtonProps
  extends Omit<SelectScrollButtonImplProps, 'dir' | 'componentName'> {}
