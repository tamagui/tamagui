import type { SizeTokens } from 'tamagui'
import { YStack, createStyledContext, styled, withStaticProperties } from 'tamagui'

type AlignCells = {
  y: 'center' | 'start' | 'end'
  x: 'center' | 'start' | 'end'
}

type AlignHeaderCells = AlignCells

const TableContext = createStyledContext<{
  cellWidth: SizeTokens | number
  cellHeight: SizeTokens | number
  alignHeaderCells: {
    y: 'center' | 'start' | 'end'
    x: 'center' | 'start' | 'end'
  }
  alignCells: {
    y: 'center' | 'start' | 'end'
    x: 'center' | 'start' | 'end'
  }
  borderColor: string
}>({
  cellWidth: '8',
  cellHeight: '8',
  alignHeaderCells: { x: 'start', y: 'center' },
  alignCells: { x: 'center', y: 'center' },
  borderColor: 'border-color',
})

/** Table Components */
const Row = styled(YStack, {
  render: 'tr',
  flexDirection: 'row',
  context: TableContext,
  variants: {
    rowLocation: {
      first: () => {
        return {
          borderBottomWidth: 0.5,
        }
      },
      last: () => {
        return {
          borderBottomWidth: 0,
        }
      },
      middle: () => {
        return {
          borderBottomWidth: 0.5,
        }
      },
    },
  },
})

const Cell = styled(YStack, {
  render: 'td',
  flexDirection: 'row',
  context: TableContext,
  grow: 0,
  shrink: 1,
  variants: {
    cellWidth: {
      Size: (name, { tokens }) => {
        return {
          width: tokens.size[name],
        }
      },
    },
    cellHeight: {
      Size: (name, { tokens }) => {
        return {
          minHeight: tokens.size[name],
        }
      },
    },
    alignCells: (val: AlignCells) => {
      return {
        alignItems: val.y === 'center' ? 'center' : `flex-${val.y}`,
        justifyContent: val.x === 'center' ? 'center' : `flex-${val.x}`,
      }
    },
    cellLocation: {
      first: () => {
        return {}
      },
      last: () => {
        return {
          borderLeftWidth: 0.5,
        }
      },
      middle: () => {
        return {
          borderLeftWidth: 0.5,
        }
      },
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
    cellWidth: {
      Size: (name, { tokens }) => {
        return {
          width: tokens.size[name],
        }
      },
    },

    alignHeaderCells: (val: AlignHeaderCells) => {
      return {
        alignItems: val.y === 'center' ? 'center' : `flex-${val.y}`,
        justifyContent: val.x === 'center' ? 'center' : `flex-${val.x}`,
      }
    },

    cellLocation: {
      first: () => {
        return {}
      },
      last: () => {
        return {
          borderLeftWidth: 1,
        }
      },
      middle: () => {
        return {
          borderLeftWidth: 1,
        }
      },
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
  variants: {
    /** just added these empty variants to avoid ts erros on Table */
    cellWidth: {
      Size: () => {
        return {}
      },
    },
    cellHeight: {
      Size: () => {
        return {}
      },
    },
    alignHeaderCells: (val) => ({}),
    alignCells: (val) => ({}),
  },
})

export const Table = withStaticProperties(TableComp, {
  Head: TableHead,
  Body: TableBody,
  Row,
  Cell,
  HeaderCell,
  Foot: TableFoot,
})
