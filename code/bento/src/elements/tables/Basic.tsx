import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'
import { Separator, Text, View, XStack, YStack, Avatar } from 'tamagui'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import { Table } from './common/tableParts'
import { ProgressCell, StatusBadge } from './common/cells'

type Person = {
  avatar: string
  firstName: string
  lastName: string
  age: number
  visits: number
  status: 'active' | 'paused' | 'vacation'
  progress: number
}

const defaultData: Person[] = [
  {
    avatar: `https://i.pravatar.cc/150?img=1`,
    firstName: 'Robert',
    lastName: 'Smith',
    age: 24,
    visits: 100,
    status: 'active',
    progress: 50,
  },
  {
    avatar: `https://i.pravatar.cc/150?img=2`,
    firstName: 'Andy',
    lastName: 'Loren',
    age: 40,
    visits: 40,
    status: 'paused',
    progress: 80,
  },
  {
    avatar: `https://i.pravatar.cc/150?img=3`,
    firstName: 'Joe',
    lastName: 'Satriani',
    age: 45,
    visits: 20,
    status: 'vacation',
    progress: 10,
  },
  {
    avatar: `https://i.pravatar.cc/150?img=4`,
    firstName: 'Mia',
    lastName: 'Havertz',
    age: 31,
    visits: 214,
    status: 'active',
    progress: 92,
  },
]

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
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('status', {
    header: () => 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('progress', {
    header: () => 'Progress',
    cell: (info) => <ProgressCell value={info.getValue()} />,
  }),
]

const CELL_WIDTH = 144

// per-column widths: identity columns wide, numerics narrow, rich cells wider
const COLUMN_WIDTHS: Record<string, number> = {
  avatar: 80,
  firstName: 130,
  lastName: 130,
  age: 70,
  visits: 80,
  status: 120,
  progress: 160,
}
const TABLE_WIDTH = Object.values(COLUMN_WIDTHS).reduce((a, b) => a + b, 0)

/** ------ EXAMPLE ------ */
export function BasicTable() {
  const [data] = React.useState(() => [...defaultData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { 'max-md': compact } = useGroupMedia('window')

  const headerGroups = table.getHeaderGroups()
  const tableRows = table.getRowModel().rows

  if (compact) {
    return (
      <YStack gap="4" width="100%" py="4">
        {defaultData.map((row, i) => {
          return (
            <View
              key={i}
              rounded="5"
              borderWidth={1}
              borderColor="border-color"
              bg="color-1"
              self="stretch"
              p="4"
              gap="3"
            >
              <XStack items="center" gap="3">
                <Avatar circular size="4">
                  <Avatar.Image
                    aria-label={`${row.firstName} ${row.lastName}`}
                    src={row.avatar}
                  />
                  <Avatar.Fallback bg="color-6" />
                </Avatar>
                <YStack flex={1}>
                  <Text fontWeight="700" color="color-11">
                    {row.firstName} {row.lastName}
                  </Text>
                  <Text fontSize="2" color="color-9">
                    {row.age} yrs · {row.visits} visits
                  </Text>
                </YStack>
                <StatusBadge status={row.status} />
              </XStack>
              <Separator />
              <ProgressCell value={row.progress} />
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
      cellHeight={52}
      borderWidth={0.5}
      maxW={TABLE_WIDTH}
      my="4"
    >
      <Table.Head>
        {headerGroups.map((headerGroup) => (
          <Table.Row bg="color-2" rowLocation="first" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.HeaderCell
                width={COLUMN_WIDTHS[header.id]}
                cellLocation={
                  header.id === 'avatar'
                    ? 'first'
                    : header.id === 'progress'
                      ? 'last'
                      : 'middle'
                }
                key={header.id}
              >
                <Text fontSize="3" fontWeight="600" color="color-11">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </Text>
              </Table.HeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Head>
      <Table.Body>
        {tableRows.map((row, rowIndex) => (
          <Table.Row
            bg={`${rowIndex % 2 === 1 ? 'color-1' : 'transparent'} hover:color-3`}
            rowLocation={rowIndex === tableRows.length - 1 ? 'last' : 'middle'}
            key={row.id}
          >
            {row.getVisibleCells().map((cell) => (
              <Table.Cell
                width={COLUMN_WIDTHS[cell.column.id]}
                px="3"
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
        ))}
      </Table.Body>
    </Table>
  )
}
