import type { SizeTokens } from 'tamagui'
import {
  ThemeableStack,
  createStyledContext,
  styled,
  withStaticProperties,
} from 'tamagui'

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
  cellWidth: '$8',
  cellHeight: '$8',
  alignHeaderCells: { x: 'start', y: 'center' },
  alignCells: { x: 'center', y: 'center' },
  borderColor: '$borderColor',
})

/** Table Components */
const Row = styled(ThemeableStack, {
  tag: 'tr',
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

const Cell = styled(ThemeableStack, {
  tag: 'td',
  flexDirection: 'row',
  context: TableContext,
  flexGrow: 0,
  flexShrink: 1,
  variants: {
    cellWidth: {
      '...size': (name, { tokens }) => {
        return {
          width: tokens.size[name],
        }
      },
    },
    cellHeight: {
      '...size': (name, { tokens }) => {
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

const HeaderCell = styled(ThemeableStack, {
  tag: 'th',
  flexDirection: 'row',
  context: TableContext,
  flexGrow: 0,
  flexShrink: 1,
  paddingVertical: '$3',

  variants: {
    cellWidth: {
      '...size': (name, { tokens }) => {
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

const TableBody = styled(ThemeableStack, {
  tag: 'tbody',
  flexDirection: 'column',
  context: TableContext,
  flexShrink: 1,
})

const TableHead = styled(ThemeableStack, {
  tag: 'thead',
  flexDirection: 'column',
  context: TableContext,
  flexShrink: 1,
})

const TableFoot = styled(ThemeableStack, {
  tag: 'tfoot',
  flexDirection: 'column',
  context: TableContext,
  flexShrink: 1,
})

const TableComp = styled(ThemeableStack, {
  tag: 'table',
  context: TableContext,
  borderWidth: 1,
  backgrounded: true,
  variants: {
    /** just added these empty variants to avoid ts erros on Table */
    cellWidth: {
      '...size': () => {
        return {}
      },
    },
    cellHeight: {
      '...size': () => {
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
