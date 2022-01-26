import { Stack, StackProps, Text, TextProps, isWeb, styled } from '@tamagui/core'

export const Table = styled(Stack, {
  tag: 'table',
})

export const TableRow = styled(Stack, {
  tag: 'tr',
  alignSelf: 'stretch', // minWidth: 100%
  flex: 1,
})

export const TableHead = styled(Stack, {
  tag: 'thead',
  flexDirection: 'row',
  alignSelf: 'stretch',
  flex: 1,
  borderBottomColor: '#eee',
  borderBottomWidth: 1,
})

export const TableHeadCell = styled(Stack, {
  tag: 'th',
  display: isWeb ? 'table-head' : 'flex',
  flexDirection: 'row',
})

export const TableHeadText = styled(Text, {
  backgroundColor: 'rgba(0,0,0,0.05)',
  padding: 2,
  paddingHorizontal: 8,
  marginLeft: -8,
  borderRadius: 10,
  maxWidth: '100%',
  ellipse: true,
  fontSize: 12,
})

export type TableCellProps = StackProps & TextProps

export const TableCell = styled(Stack, {
  flex: 1,
  alignSelf: 'stretch',
  alignItems: 'center',
  tag: 'td',
  display: isWeb ? 'table-cell' : 'flex',
  // borderBottomWidth: 1,
  // borderBottomColor: '$borderColor',
  paddingVertical: '$3',
  paddingHorizontal: '$2',
})
