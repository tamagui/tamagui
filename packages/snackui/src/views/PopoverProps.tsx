// force this file to stick around for webpack...
export default {}

type AnchorEnum =
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT'
  | 'BOTTOM_CENTER'
  | 'TOP_LEFT'
  | 'TOP_RIGHT'
  | 'TOP_CENTER'
  | 'LEFT_BOTTOM'
  | 'LEFT_TOP'
  | 'LEFT_CENTER'
  | 'RIGHT_BOTTOM'
  | 'RIGHT_TOP'
  | 'RIGHT_CENTER'
  | 'CENTER'

export type PopoverProps = {
  inline?: boolean
  anchor?: AnchorEnum
  position?: 'top' | 'left' | 'right' | 'bottom'
  children: React.ReactElement | null
  contents:
    | React.ReactElement
    | ((isOpen: boolean) => React.ReactElement | null)
    | null
  isOpen?: boolean
  noArrow?: boolean
  overlay?: boolean
  overlayPointerEvents?: boolean
  onChangeOpen?: (next: boolean) => any
  style?: React.HTMLAttributes<HTMLDivElement>['style']
  mountImmediately?: boolean
}
