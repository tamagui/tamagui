import type { SizeTokens } from 'tamagui'
import { YStack, createStyledContext, styled, withStaticProperties } from 'tamagui'

type Align = 'center' | 'start' | 'end'

type AlignCells = {
  y: Align
  x: Align
}

const TableContext = createStyledContext<{
  cellWidth: SizeTokens | number
  cellHeight: SizeTokens | number
  alignHeaderCells: AlignCells
  alignCells: AlignCells
  borderColor: string
}>({
  cellWidth: 128,
  cellHeight: 32,
  alignHeaderCells: { x: 'start', y: 'center' },
  alignCells: { x: 'center', y: 'center' },
  borderColor: 'border-color',
})

const flexAlign = (val: Align) => (val === 'center' ? 'center' : (`flex-${val}` as const))

const alignStyle = styled.dynamic<AlignCells>((val) => ({
  alignItems: flexAlign(val.y),
  justifyContent: flexAlign(val.x),
}))

/** Table Components */
const Row = styled(YStack, {
  render: 'tr',
  flexDirection: 'row',
  context: TableContext,
  variants: {
    rowLocation: {
      first: { borderBottomWidth: 0.5 },
      middle: { borderBottomWidth: 0.5 },
      last: { borderBottomWidth: 0 },
    },
  } as const,
})

const Cell = styled(YStack, {
  render: 'td',
  flexDirection: 'row',
  context: TableContext,
  grow: 0,
  shrink: 1,
  variants: {
    cellWidth: styled.dynamic<SizeTokens | number>((val) => ({ width: val })),
    cellHeight: styled.dynamic<SizeTokens | number>((val) => ({ minHeight: val })),
    alignCells: alignStyle,
    cellLocation: {
      first: {},
      middle: { borderLeftWidth: 0.5 },
      last: { borderLeftWidth: 0.5 },
    },
  } as const,
})

const HeaderCell = styled(YStack, {
  render: 'th',
  flexDirection: 'row',
  grow: 0,
  shrink: 1,
  py: '3',
  context: TableContext,
  variants: {
    cellWidth: styled.dynamic<SizeTokens | number>((val) => ({ width: val })),
    alignHeaderCells: alignStyle,
    cellLocation: {
      first: {},
      middle: { borderLeftWidth: 1 },
      last: { borderLeftWidth: 1 },
    },
  } as const,
})

const TableBody = styled(YStack, {
  render: 'tbody',
  flexDirection: 'column',
  context: TableContext,
  shrink: 1,
})

const TableHead = styled(YStack, {
  render: 'thead',
  flexDirection: 'column',
  context: TableContext,
  shrink: 1,
})

const TableFoot = styled(YStack, {
  render: 'tfoot',
  flexDirection: 'column',
  context: TableContext,
  shrink: 1,
})

const TableComp = styled(YStack, {
  render: 'table',
  context: TableContext,
  borderWidth: 1,
  bg: 'background',
  // the table only provides these to its cells through context
  variants: {
    cellWidth: styled.dynamic<SizeTokens | number>(),
    cellHeight: styled.dynamic<SizeTokens | number>(),
    alignHeaderCells: styled.dynamic<AlignCells>(),
    alignCells: styled.dynamic<AlignCells>(),
  } as const,
})

export const Table = withStaticProperties(TableComp, {
  Head: TableHead,
  Body: TableBody,
  Row,
  Cell,
  HeaderCell,
  Foot: TableFoot,
})
