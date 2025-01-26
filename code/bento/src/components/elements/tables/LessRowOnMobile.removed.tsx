// This component is ignored for now
//
//   REMOVED FROM BENTO
//
//
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import * as React from 'react'
import { Avatar, H4, Separator, Text, View } from 'tamagui'
import { Table } from './common/tableParts'

type Person = {
  fullName: string
  username: string
  age: number
  visits: number
  status: string
  role: string
  avatar?: string
}

const defaultData: Person[] = [
  {
    fullName: 'Hary potter',
    username: '@harry',
    age: 24,
    visits: 100,
    status: 'Offline',
    role: 'Admin',
  },
  {
    fullName: 'Andy loren',
    username: '@andy_dev',
    age: 40,
    visits: 40,
    status: 'Active',
    role: 'Member',
  },
  {
    fullName: 'Massoud epsum',
    username: '@massouddd',
    age: 45,
    visits: 20,
    status: 'Active',
    role: 'Admin',
  },
  {
    fullName: 'John Doe',
    username: '@john',
    age: 24,
    visits: 100,
    status: 'Active',
    role: 'Admin',
  },
  {
    fullName: 'Andy Doe',
    username: '@andy',
    age: 40,
    visits: 40,
    status: 'Offline',
    role: 'Member',
  },
  {
    fullName: 'Massoud Doe',
    username: '@massoud',
    age: 45,
    visits: 20,
    status: 'Active',
    role: 'Member',
  },
  {
    fullName: 'John Doe',
    username: '@john',
    age: 24,
    visits: 100,
    status: 'Active',
    role: 'Admin',
  },
  {
    fullName: 'Andy Doe',
    username: '@andy',
    age: 40,
    visits: 40,
    status: 'Offline',
    role: 'Admin',
  },
  {
    fullName: 'Massoud Doe',
    username: '@massoud',
    age: 45,
    visits: 20,
    status: 'Offline',
    role: 'Member',
  },
  {
    fullName: 'John Doe',
    username: '@john',
    age: 24,
    visits: 100,
    status: 'Active',
    role: 'Member',
  },
  {
    fullName: 'Nate birdman',
    username: '@foobully',
    age: 40,
    visits: 40,
    status: 'Offline',
    role: 'Member',
  },
  {
    fullName: 'Ali',
    username: '@cerpinn',
    age: 45,
    visits: 20,
    status: 'Active',
    role: 'Admin',
  },
  {
    fullName: 'Ehsan Sarshar',
    username: '@TheEhsanSarshar',
    age: 40,
    visits: 40,
    status: 'Offline',
    role: 'Admin',
  },
].map(
  (row, index) =>
    ({
      ...row,
      avatar: `/avatars/300 (1).jpeg`,
    }) as Person
)

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor(
    (row) => ({
      fullName: row.fullName,
      userName: row.username,
      image: row.avatar,
    }),
    {
      cell: (info) => {
        const { fullName, userName, image } = info.getValue()
        return (
          <View flexDirection="row" alignItems="center" gap="$3">
            <Avatar circular size="$5">
              <Avatar.Image accessibilityLabel="Profile image" src={image} />
              <Avatar.Fallback backgroundColor="$gray6" />
            </Avatar>
            <View flexDirection="column">
              <Text>{fullName}</Text>
              <Text theme="alt1">{userName}</Text>
            </View>
          </View>
        )
      },
      header: () => 'Name',
      id: 'user_base',
    }
  ),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
    cell: (info) => {
      const val = info.renderValue()
      return (
        <Text
          col="$color9"
          padding="$1"
          backgroundColor="$color6"
          theme={val?.toLocaleLowerCase() === 'active' ? 'green' : 'orange'}
          borderRadius={1000_000_000}
          paddingHorizontal="$3"
          paddingVertical="$2"
        >
          {info.renderValue()}
        </Text>
      )
    },
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    footer: (info) => info.column.id,
  }),
]

/** ------ EXAMPLE ------ */
export function LessRowOnMobile() {
  const [data, setData] = React.useState(() => [...defaultData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const headerGroups = table.getHeaderGroups()
  const tableRows = table.getRowModel().rows
  const footerGroups = table.getFooterGroups()

  const allRowsLenght = tableRows.length + headerGroups.length + footerGroups.length
  const rowCounter = React.useRef(-1)
  rowCounter.current = -1

  const { sm } = useGroupMedia('window')

  if (sm) {
    // TODO put in flashlist
    return defaultData.map((row, i) => {
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
          <H4>{row.fullName}</H4>
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
    <Table
      alignCells={{ x: 'center', y: 'center' }}
      alignHeaderCells={{ y: 'center', x: 'center' }}
      cellWidth={'$18'}
      cellHeight="$7"
      borderWidth={0}
      padding="$4"
      maxWidth={'100%'}
    >
      <Table.Head>
        {headerGroups.map((headerGroup) => {
          rowCounter.current++
          return (
            <Table.Row
              backgrounded
              rowLocation={
                rowCounter.current === 0
                  ? 'first'
                  : rowCounter.current === allRowsLenght - 1
                    ? 'last'
                    : 'middle'
              }
              key={headerGroup.id}
              justifyContent="flex-start"
            >
              {headerGroup.headers.map((header) => (
                <Table.HeaderCell
                  cellLocation={
                    header.id === 'fullName'
                      ? 'first'
                      : header.id === 'role'
                        ? 'last'
                        : 'middle'
                  }
                  key={header.id}
                  borderWidth={0}
                  justifyContent="flex-start"
                  {...(header.column.id === 'user_base'
                    ? {
                        flexShrink: 1,
                      }
                    : {
                        flexShrink: 3,
                      })}
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
                    cell.column.id === 'fullName'
                      ? 'first'
                      : cell.column.id === 'role'
                        ? 'last'
                        : 'middle'
                  }
                  key={cell.id}
                  borderWidth={0}
                  justifyContent="flex-start"
                  {...(cell.column.id === 'user_base'
                    ? {
                        flexShrink: 1,
                      }
                    : {
                        flexShrink: 3,
                      })}
                >
                  {cell.column.id === 'user_base' ? (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  ) : (
                    <Text theme="alt2">
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
  )
}

LessRowOnMobile.fileName = 'LessRowOnMobile'
