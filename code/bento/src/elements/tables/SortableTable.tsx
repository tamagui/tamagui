import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
} from '../../icons'
import type { GroupingState } from '@tanstack/react-table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'
import {
  Button,
  Input,
  ScrollView,
  Button as TButton,
  Text,
  View,
  isWeb,
  useWindowDimensions,
  Avatar,
  XGroup,
} from 'tamagui'
import { useGroupMedia } from '../../hooks/useGroupMedia'

import { ProgressCell, StatusBadge } from './common/cells'
import { Table } from './common/tableParts'
import { makeData } from './utils/makeData'

type Person = {
  avatar: string
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('avatar', {
    cell: (info) => (
      <Avatar circular size="3">
        <Avatar.Image aria-label="Profile image" src={info.getValue()} />
        <Avatar.Fallback bg="color-6" />
      </Avatar>
    ),
    header: () => 'Avatar',
  }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    header: () => 'First Name',
  }),
  columnHelper.accessor('lastName', {
    cell: (info) => <Text>{info.getValue()}</Text>,
    header: () => 'Last Name',
  }),
  columnHelper.accessor('age', {
    cell: (info) => <Text>{info.renderValue()}</Text>,
    header: () => 'Age',
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('progress', {
    header: 'Progress',
    cell: (info) => <ProgressCell value={info.getValue()} />,
  }),
]

const FooterContainer = ({
  children,
  Footer,
}: {
  children: React.ReactNode
  Footer: React.ComponentType
}) => {
  if (!isWeb) {
    return (
      <>
        {children}
        <Footer />
      </>
    )
  }
  return children
}

const Footer = ({
  table,
  screenWidth,
  tableWidth: TABLE_WIDTH,
}: {
  table: any
  screenWidth: number
  tableWidth: number
}) => {
  const minW = (screenWidth - 64) / 4
  return (
    <View
      b="3"
      flexDirection="column-reverse @sm/window:row"
      items="center"
      position="@sm/window:relative"
      maxW={`@sm/window:${TABLE_WIDTH}px`}
      px="4"
      justify="space-between"
    >
      <XGroup>
        <XGroup.Item>
          <Button
            minW={isWeb ? undefined : minW}
            onPress={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <TButton.Icon>
              <ChevronFirst />
            </TButton.Icon>
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button
            minW={isWeb ? undefined : minW}
            onPress={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <TButton.Icon>
              <ChevronLeft />
            </TButton.Icon>
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button
            minW={isWeb ? undefined : minW}
            onPress={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <TButton.Icon>
              <ChevronRight />
            </TButton.Icon>
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button
            minW={isWeb ? undefined : minW}
            onPress={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <TButton.Icon>
              <ChevronLast />
            </TButton.Icon>
          </Button>
        </XGroup.Item>
      </XGroup>

      <View
        flexDirection="row"
        rounded={1000_000_000}
        paddingTop="2"
        paddingBottom="2"
        px="6"
        bg="background"
        gap="3"
        display="native:none"
        theme="accent"
      >
        <Text fontWeight="500" lineHeight="5" fontSize="5">
          Page
        </Text>
        <Text fontWeight="500" lineHeight="5" fontSize="5">
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </Text>
      </View>

      <View
        display="native:none"
        flexDirection="row"
        gap="4"
        items="center"
        className="flex items-center gap-1"
      >
        <Text fontSize="5" fontWeight="500" lineHeight="5">
          Go to page
        </Text>
        <Input
          inputMode="numeric"
          type="number"
          defaultValue={String(table.getState().pagination.pageIndex + 1)}
          onChange={(e: any) => {
            const text = e.target?.value ?? e.nativeEvent?.text ?? ''
            const page = text ? Number(text) - 1 : 0
            table.setPageIndex(page)
          }}
          p={0}
          textAlign="center"
          maxW={45}
          minW={45}
          className="border p-1 rounded"
        />
      </View>
    </View>
  )
}
/** ------ EXAMPLE ------ */
export function SortableTable() {
  const [data, setData] = React.useState<Person[]>([])
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const { width: windowWidth } = useWindowDimensions()

  React.useEffect(() => {
    setData(makeData(10000))
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
      /** uncomment to set specific page size
       * you can also use `table.getState().pagination.pageSize` to get current page size
       * and `table.setPageSize(Number(e.target.value))` to set page size
       * for more info refet to tanstack/table documentation
       */
      //   pagination: {
      //     pageSize: 10,
      //     pageIndex: 1,
      //   },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const headerGroups = table.getHeaderGroups()
  const tableRows = table.getRowModel().rows
  const footerGroups = table.getFooterGroups()

  const allRowsLenght = tableRows.length + headerGroups.length + footerGroups.length
  const rowCounter = React.useRef(-1)
  rowCounter.current = -1

  const CELL_WIDTH = 204
  const TABLE_WIDTH = CELL_WIDTH * columns.length

  const { 'max-md': compact } = isWeb ? useGroupMedia('window') : { 'max-md': true }

  const screenWidth = windowWidth - 15

  return (
    <FooterContainer
      Footer={() => (
        <Footer screenWidth={screenWidth} tableWidth={TABLE_WIDTH} table={table} />
      )}
    >
      <ScrollView horizontal maxW="100%">
        <View
          flex={1}
          flexDirection="column"
          gap="6"
          minW={TABLE_WIDTH}
          width="100%"
          px="4"
          py="6"
        >
          <Table
            alignCells={{ x: 'center', y: 'center' }}
            alignHeaderCells={{ y: 'center', x: 'center' }}
            cellWidth={CELL_WIDTH}
            cellHeight={52}
            borderWidth={0.5}
            maxW={TABLE_WIDTH}
            borderTopRightRadius="4"
            borderTopLeftRadius="4"
            borderBottomLeftRadius="2"
            borderBottomRightRadius="2"
            mb="10 @sm/window:inherit"
          >
            <Table.Head position="absolute" z={1} maxW={TABLE_WIDTH}>
              {headerGroups.map((headerGroup) => {
                rowCounter.current++
                return (
                  <Table.Row
                    bg="color-2"
                    borderTopRightRadius="4"
                    borderTopLeftRadius="4"
                    borderBottomLeftRadius="0"
                    borderBottomRightRadius="0"
                    rowLocation={
                      rowCounter.current === 0
                        ? 'first'
                        : rowCounter.current === allRowsLenght - 1
                          ? 'last'
                          : 'middle'
                    }
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => {
                      const isSortableHeader =
                        header.id === 'firstName' || header.id === 'age'
                      return (
                        <Table.HeaderCell
                          cellLocation={
                            header.id === 'avatar'
                              ? 'first'
                              : header.id === 'progress'
                                ? 'last'
                                : 'middle'
                          }
                          key={header.id}
                        >
                          <View
                            flexDirection="row"
                            cursor={header.column.getCanSort() ? 'pointer' : 'none'}
                            gap="2"
                            items="center"
                            onPress={
                              isSortableHeader
                                ? header.column.getToggleSortingHandler()
                                : undefined
                            }
                          >
                            <Text
                              fontSize="3"
                              fontWeight="600"
                              color="color-11"
                              select="none"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </Text>
                            {{
                              asc: <ChevronUp size="1" color="color-9" />,
                              desc: <ChevronDown size="1" color="color-9" />,
                              noSort: isSortableHeader ? (
                                <ChevronsUpDown size="1" color="color-9" />
                              ) : null,
                            }[header.column.getIsSorted() || 'noSort'] ?? null}
                          </View>
                        </Table.HeaderCell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Head>
            <Table.Body mt="8">
              {tableRows.map((row, index) => {
                rowCounter.current++
                return (
                  <Table.Row
                    minW={TABLE_WIDTH}
                    bg={`${index % 2 === 1 ? 'color-1' : 'transparent'} hover:color-3`}
                    rowLocation={
                      rowCounter.current === 0
                        ? 'first'
                        : rowCounter.current === allRowsLenght - 1
                          ? 'last'
                          : 'middle'
                    }
                    key={`${row.id}-${index}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell
                        cellLocation={
                          cell.column.id === 'avatar'
                            ? 'first'
                            : cell.column.id === 'progress'
                              ? 'last'
                              : 'middle'
                        }
                        key={cell.id}
                      >
                        {cell.column.id === 'avatar' ||
                        cell.column.id === 'status' ||
                        cell.column.id === 'progress' ? (
                          <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                        ) : (
                          <Text fontSize="4" color="color-10">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Text>
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          {!compact && (
            <Footer screenWidth={screenWidth} tableWidth={TABLE_WIDTH} table={table} />
          )}
        </View>
      </ScrollView>
    </FooterContainer>
  )
}
