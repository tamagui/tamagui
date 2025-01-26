import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
} from '@tamagui/lucide-icons'
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
  Avatar,
  Button,
  Input,
  ScrollView,
  Button as TButton,
  Text,
  View,
  XGroup,
  getTokenValue,
  isWeb,
  useWindowDimensions,
} from 'tamagui'
import { useGroupMedia } from '../../hooks/useGroupMedia'

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
      <Avatar circular size="$3">
        <Avatar.Image accessibilityLabel="Profile image" src={info.getValue()} />
        <Avatar.Fallback backgroundColor="$gray6" />
      </Avatar>
    ),
    header: () => 'Avatar',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    header: () => 'First Name',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('lastName', {
    cell: (info) => <Text>{info.getValue()}</Text>,
    header: () => 'Last Name',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('age', {
    cell: (info) => <Text>{info.renderValue()}</Text>,
    header: () => 'Age',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    // cell: (info) => (
    //   <Progress value={info.renderValue()} w="$6">
    //     <Progress.Indicator animation="bouncy" />
    //   </Progress>
    // ),
    header: 'Progress',
    footer: (info) => info.column.id,
  }),
]

const FooterContainer = ({
  children,
  Footer,
}: { children: React.ReactNode; Footer: React.ElementType }) => {
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
}: { table: any; screenWidth: number; tableWidth: number }) => {
  return (
    <View
      bottom="$3"
      flexDirection="column-reverse"
      alignItems="center"
      $group-window-gtXs={{
        position: 'relative',
        flexDirection: 'row',
        maxWidth: TABLE_WIDTH,
      }}
      px="$4"
      justifyContent="space-between"
    >
      <XGroup>
        <XGroup.Item>
          <Button
            $platform-native={{ minWidth: screenWidth / 4 }}
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
            $platform-native={{ minWidth: screenWidth / 4 }}
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
            $platform-native={{ minWidth: screenWidth / 4 }}
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
            $platform-native={{ minWidth: screenWidth / 4 }}
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
        borderRadius={1000_000_000}
        padding="$2"
        paddingHorizontal="$6"
        themeInverse
        backgroundColor="$background"
        gap="$3"
        $platform-native={{ display: 'none' }}
      >
        <Text fontWeight="$5" lineHeight="$5" fontSize="$5">
          Page
        </Text>
        <Text fontWeight="$5" lineHeight="$5" fontSize="$5">
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </Text>
      </View>
      <View
        $platform-native={{ display: 'none' }}
        flexDirection="row"
        gap="$4"
        alignItems="center"
        className="flex items-center gap-1"
      >
        <Text fontSize="$5" fontWeight="$5" lineHeight="$5">
          Go to page
        </Text>
        <Input
          keyboardType="numeric"
          {...(isWeb && {
            type: 'number',
          })}
          defaultValue={String(table.getState().pagination.pageIndex + 1)}
          onChangeText={(text) => {
            const page = text ? Number(text) - 1 : 0
            table.setPageIndex(page)
          }}
          padding={0}
          ta="center"
          maxWidth={45}
          minWidth={45}
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
    debugTable: true,
  })

  const headerGroups = table.getHeaderGroups()
  const tableRows = table.getRowModel().rows
  const footerGroups = table.getFooterGroups()

  const allRowsLenght = tableRows.length + headerGroups.length + footerGroups.length
  const rowCounter = React.useRef(-1)
  rowCounter.current = -1

  const CELL_WIDTH = '$15'
  const TABLE_WIDTH = getTokenValue(CELL_WIDTH) * columns.length

  const { sm } = isWeb ? useGroupMedia('window') : { sm: true }
  // const { sm } = { sm: true }

  const screenWidth = windowWidth - 15

  return (
    <FooterContainer
      Footer={() => (
        <Footer screenWidth={screenWidth} tableWidth={TABLE_WIDTH} table={table} />
      )}
    >
      <ScrollView horizontal maxWidth="100%">
        <View
          flex={1}
          flexDirection="column"
          gap="$6"
          minWidth={TABLE_WIDTH}
          w="100%"
          paddingHorizontal="$4"
          paddingVertical="$6"
        >
          <Table
            alignCells={{ x: 'center', y: 'center' }}
            alignHeaderCells={{ y: 'center', x: 'center' }}
            cellWidth={CELL_WIDTH}
            cellHeight="$5"
            borderWidth={0.5}
            maxWidth={TABLE_WIDTH}
            borderTopRightRadius="$4"
            borderTopLeftRadius="$4"
            borderBottomLeftRadius="$2"
            borderBottomRightRadius="$2"
            mb="$10"
            $group-window-gtXs={{
              mb: 'inherit',
            }}
          >
            <Table.Head position="absolute" zIndex="$1" maxWidth={TABLE_WIDTH}>
              {headerGroups.map((headerGroup) => {
                rowCounter.current++
                return (
                  <Table.Row
                    backgrounded
                    backgroundColor="$color2"
                    rowLocation={
                      rowCounter.current === 0
                        ? 'first'
                        : rowCounter.current === allRowsLenght - 1
                          ? 'last'
                          : 'middle'
                    }
                    key={headerGroup.id}
                    borderTopRightRadius="$4"
                    borderTopLeftRadius="$4"
                    borderBottomLeftRadius="$0"
                    borderBottomRightRadius="$0"
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
                            onPress={
                              isSortableHeader
                                ? header.column.getToggleSortingHandler()
                                : undefined
                            }
                            gap="$2"
                            alignItems="center"
                          >
                            <Text fontSize="$4" selectable={false}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </Text>
                            {{
                              asc: <ChevronUp size="$1" color="$gray10" />,
                              desc: <ChevronDown size="$1" color="$gray10" />,
                              noSort: isSortableHeader ? (
                                <ChevronsUpDown size="$1" color="$gray10" />
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
            <Table.Body mt="$8">
              {tableRows.map((row, index) => {
                rowCounter.current++
                return (
                  <Table.Row
                    minWidth={TABLE_WIDTH}
                    hoverStyle={{
                      backgroundColor: '$color2',
                    }}
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
                        {cell.column.id === 'avatar' ? (
                          <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                        ) : (
                          <Text fontSize="$4" color="$gray11">
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
          {!sm && (
            <Footer screenWidth={screenWidth} tableWidth={TABLE_WIDTH} table={table} />
          )}
        </View>
      </ScrollView>
    </FooterContainer>
  )
}

SortableTable.fileName = 'SortableTable'
