// This component is ignored for now
//
//   REMOVED FROM BENTO
//
//
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from '@tamagui/lucide-icons'
import type { GroupingState } from '@tanstack/react-table'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'
import { Platform } from 'react-native'
import {
  Button,
  Input,
  Button as TButton,
  Text,
  XGroup,
  View,
  getTokenValue,
  H4,
  Separator,
} from 'tamagui'

import { makeData } from './utils/makeData'
import { Table } from './common/tableParts'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('firstName', {
    /** you can return any react element inside cell function  */
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Vists',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Progress',
    footer: (info) => info.column.id,
  }),
]

/** ------ EXAMPLE ------ */
export function PaginatedTable() {
  const [data, setData] = React.useState<Person[]>([])
  const [grouping, setGrouping] = React.useState<GroupingState>([])

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
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  const { sm } = useGroupMedia('window')

  if (sm) {
    // TODO put in flashlist
    return data.map((row, i) => {
      return (
        <View
          key={i}
          padding="$4"
          margin="$2"
          borderRadius="$4"
          borderWidth="$1"
          borderColor="$borderColor"
          flex={1}
          alignSelf="stretch"
          gap="$2"
        >
          <H4>
            {row.firstName} {row.lastName}
          </H4>
          <Separator />
          <View gap="$1">
            {Object.entries(row).map(([name, value], i) => {
              return (
                <View key={i} fd="row">
                  <Text textAlign="right" px="$2" fontWeight="600" width="40%">
                    {name}
                  </Text>
                  <Text>{value}</Text>
                </View>
              )
            })}
          </View>
        </View>
      )
    })
  }

  return (
    <View flexDirection="column" gap="$4">
      <Table
        alignCells={{ x: 'center', y: 'center' }}
        alignHeaderCells={{ y: 'center', x: 'center' }}
        cellWidth={CELL_WIDTH}
        cellHeight="$5"
        borderWidth={0.5}
        maxWidth={TABLE_WIDTH}
      >
        <Table.Head>
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
              >
                {headerGroup.headers.map((header) => (
                  <Table.HeaderCell
                    cellLocation={
                      header.id === 'firstName'
                        ? 'first'
                        : header.id === 'progress'
                          ? 'last'
                          : 'middle'
                    }
                    key={header.id}
                  >
                    <Text>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Text>
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            )
          })}
        </Table.Head>
        <Table.Body>
          {tableRows.map((row) => {
            rowCounter.current++
            return (
              <Table.Row
                rowLocation={
                  rowCounter.current === 0
                    ? 'first'
                    : rowCounter.current === allRowsLenght - 1
                      ? 'last'
                      : 'middle'
                }
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    cellLocation={
                      cell.column.id === 'firstName'
                        ? 'first'
                        : cell.column.id === 'progress'
                          ? 'last'
                          : 'middle'
                    }
                    key={cell.id}
                  >
                    <Text color="$gray11">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Text>
                  </Table.Cell>
                ))}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      <View
        flexDirection="row"
        alignItems="center"
        width={TABLE_WIDTH}
        justifyContent="space-between"
      >
        <XGroup>
          <XGroup.Item>
            <Button
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
              onPress={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <TButton.Icon>
                <ChevronLeft />
              </TButton.Icon>
            </Button>
          </XGroup.Item>
          <XGroup.Item>
            <Button onPress={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <TButton.Icon>
                <ChevronRight />
              </TButton.Icon>
            </Button>
          </XGroup.Item>
          <XGroup.Item>
            <Button
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
        >
          <Text>Page</Text>
          <Text fontSize="$5" fontWeight="$5" lineHeight="$5">
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </Text>
        </View>
        <View
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
            {...(Platform.OS === 'web' && {
              type: 'number',
            })}
            defaultValue={String(table.getState().pagination.pageIndex + 1)}
            onChangeText={(text) => {
              const page = text ? Number(text) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </View>
      </View>
    </View>
  )
}

PaginatedTable.fileName = 'PaginatedTable'
