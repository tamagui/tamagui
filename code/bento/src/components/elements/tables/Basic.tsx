import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import * as React from 'react'
import { Avatar, Progress, Separator, Text, View, YStack, getTokenValue } from 'tamagui'
import { Table } from './common/tableParts'

type Person = {
  avatar: string
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Person[] = [
  {
    avatar: `https://i.pravatar.cc/150?img=1`,
    firstName: 'Robert',
    lastName: 'Smith',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    avatar: `https://i.pravatar.cc/150?img=2`,
    firstName: 'Andy',
    lastName: 'Loren',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    avatar: `https://i.pravatar.cc/150?img=3`,
    firstName: 'Joe',
    lastName: 'Satriani',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

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

const CELL_WIDTH = '$15'

/** ------ EXAMPLE ------ */
export function BasicTable() {
  const [data, setData] = React.useState(() => [...defaultData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { sm } = useGroupMedia('window')

  const headerGroups = table.getHeaderGroups()
  const tableRows = table.getRowModel().rows
  const footerGroups = table.getFooterGroups()

  const allRowsLenght = tableRows.length + headerGroups.length + footerGroups.length
  const rowCounter = React.useRef(-1)
  rowCounter.current = -1

  if (sm) {
    return (
      <YStack gap="$5" width="100%" py="$6">
        {defaultData.map((row, i) => {
          return (
            <View
              key={i}
              borderRadius="$4"
              borderWidth="$1"
              borderColor="$borderColor"
              flex={1}
              alignSelf="stretch"
              gap="$3"
            >
              <View gap="$3" mx="$3" my="$3">
                {Object.entries(row).map(([name, value], i) => {
                  return (
                    <View key={i}>
                      <View fd="row" alignItems="center" justifyContent="space-between">
                        <Text>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
                        {name === 'avatar' ? (
                          <Avatar circular size="$3">
                            <Avatar.Image
                              accessibilityLabel="Profile image"
                              src={value as string}
                            />
                            <Avatar.Fallback backgroundColor="$gray6" />
                          </Avatar>
                        ) : (
                          <Text color="$gray10">{value}</Text>
                        )}
                      </View>
                      {i !== Object.entries(row).length - 1 && <Separator mt="$3" />}
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}
      </YStack>
    )
  }

  return (
    <Table
      alignCells={{ x: 'center', y: 'center' }}
      alignHeaderCells={{ y: 'center', x: 'center' }}
      cellWidth={CELL_WIDTH}
      cellHeight="$5"
      borderWidth={0.5}
      maxWidth={getTokenValue(CELL_WIDTH) * columns.length}
      marginVertical="$15"
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
                    header.id === 'avatar'
                      ? 'first'
                      : header.id === 'progress'
                        ? 'last'
                        : 'middle'
                  }
                  key={header.id}
                >
                  <Text fontSize="$4">
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
      <Table.Foot>
        {footerGroups.map((footerGroup) => {
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
              key={footerGroup.id}
            >
              {footerGroup.headers.map((header, index) => (
                <Table.HeaderCell
                  cellLocation={
                    index === 0
                      ? 'first'
                      : index === footerGroup.headers.length - 1
                        ? 'last'
                        : 'middle'
                  }
                  key={header.id}
                >
                  <Text fontSize="$3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.footer, header.getContext())}
                  </Text>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          )
        })}
      </Table.Foot>
    </Table>
  )
}

BasicTable.fileName = 'Basic'
