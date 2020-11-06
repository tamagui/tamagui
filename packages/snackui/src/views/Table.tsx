import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { HStack, StackProps, VStack } from './Stacks'
import { Text, TextProps } from './Text'

export type TableProps = StackProps

export const Table = (props: StackProps) => <VStack {...props} />

if (process.env.IS_STATIC) {
  Table.staticConfig = extendStaticConfig(VStack, {})
}

const tableRowDefaultProps: StackProps = {
  alignSelf: 'stretch',
  flex: 1,
}

export type TableRowProps = StackProps

export const TableRow = (props: TableRowProps) => (
  <HStack {...tableRowDefaultProps} {...props} />
)

if (process.env.IS_STATIC) {
  TableRow.staticConfig = extendStaticConfig(HStack, {
    defaultProps: tableRowDefaultProps,
  })
}

export type TableCellProps = StackProps & TextProps

export function TableCell({
  color,
  fontSize,
  fontWeight,
  fontStyle,
  fontFamily,
  textAlign,
  fontVariant,
  selectable,
  ellipse,
  children,
  lineHeight,
  ...props
}: TableCellProps) {
  return (
    <HStack
      padding={4}
      flex={1}
      alignSelf="stretch"
      alignItems="center"
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          color={color}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          fontFamily={fontFamily}
          fontVariant={fontVariant}
          textAlign={textAlign}
          selectable={selectable}
          ellipse={ellipse}
          lineHeight={lineHeight}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </HStack>
  )
}

const tableHeadRowDefaultProps: StackProps = {
  alignSelf: 'stretch',
  flex: 1,
  borderBottomColor: '#eee',
  borderBottomWidth: 2,
}

export type TableHeadRowProps = StackProps

export const TableHeadRow = (props: TableHeadRowProps) => (
  <HStack {...tableHeadRowDefaultProps} {...props} />
)

if (process.env.IS_STATIC) {
  TableHeadRow.staticConfig = extendStaticConfig(HStack, {
    defaultProps: tableHeadRowDefaultProps,
  })
}

const tableHeadTextDefaultProps: TextProps = {
  backgroundColor: 'rgba(0,0,0,0.05)',
  padding: 2,
  paddingHorizontal: 8,
  marginLeft: -8,
  borderRadius: 10,
  maxWidth: '100%',
  ellipse: true,
  fontSize: 12,
}

export type TableHeadTextProps = TextProps

export const TableHeadText = (props: TableHeadTextProps) => (
  <Text {...tableHeadTextDefaultProps} {...props} />
)

if (process.env.IS_STATIC) {
  TableHeadText.staticConfig = extendStaticConfig(Text, {
    defaultProps: tableHeadTextDefaultProps,
  })
}
