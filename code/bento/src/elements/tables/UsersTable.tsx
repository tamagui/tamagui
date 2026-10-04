import { Avatar } from '../../BentoSkins'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import { Separator, Text, View, XStack } from 'tamagui'
import { Table } from './common/tableParts'
import { Circle } from 'tamagui'

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
    fullName: 'Sara Smith',
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
    fullName: 'Bob marley',
    username: '@massouddd',
    age: 45,
    visits: 20,
    status: 'Active',
    role: 'Admin',
  },
  {
    fullName: 'Adam henry',
    username: '@john',
    age: 24,
    visits: 100,
    status: 'Active',
    role: 'Admin',
  },
  {
    fullName: 'Andy loren',
    username: '@andy',
    age: 40,
    visits: 40,
    status: 'Offline',
    role: 'Member',
  },
  {
    fullName: 'Massoud karimi',
    username: '@massoud',
    age: 45,
    visits: 20,
    status: 'Active',
    role: 'Member',
  },
  {
    fullName: 'John',
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
    fullName: 'Preston bennet',
    username: '@outworld',
    age: 45,
    visits: 20,
    status: 'Active',
    role: 'Admin',
  },
  {
    fullName: 'Jack anderson',
    username: '@j_anderson',
    age: 45,
    visits: 20,
    status: 'Offline',
    role: 'Member',
  },
  {
    fullName: 'John peterson',
    username: '@john',
    age: 24,
    visits: 100,
    status: 'Active',
    role: 'Member',
  },
  {
    fullName: 'Tommy resse',
    username: '@tommy',
    age: 40,
    visits: 40,
    status: 'Offline',
    role: 'Member',
  },
  {
    fullName: 'Manuel loren',
    username: '@manuel',
    age: 40,
    visits: 40,
    status: 'Offline',
    role: 'Admin',
  },
].map(
  (row, index) =>
    ({
      ...row,
      avatar: 'https://i.pravatar.cc/150?img=1',
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
          <View flexDirection="row" items="center" gap="3" ml="2">
            <Avatar circular size="4">
              <Avatar.Image aria-label="Profile image" src={image} />
              <Avatar.Fallback bg="color-6" />
            </Avatar>
            <View flexDirection="column">
              <Text>{fullName}</Text>
              <Text fontSize="2" lineHeight="2" fontWeight="2" theme="level3">
                {userName}
              </Text>
            </View>
          </View>
        )
      },
      header: () => 'User',
      id: 'user_base',
    }
  ),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const val = info.renderValue()
      return <StatusButton status={val?.toLocaleLowerCase() ?? ''} />
    },
  }),
  columnHelper.accessor('role', {
    header: 'Role',
  }),
]

const StatusButton = ({ status }: { status: string }) => {
  return (
    <View
      flexDirection="row"
      items="center"
      gap="2"
      bg="color-6"
      rounded={1000_000_000}
      px="2"
      py="1"
      theme={status?.toLocaleLowerCase() === 'active' ? 'green' : 'orange'}
    >
      <Circle size={10} bg="color-9" />
      <Text color="color-9" fontWeight="2">
        {status}
      </Text>
    </View>
  )
}

/** ------ EXAMPLE ------ */
export function UsersTable() {
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
  const { sm, xs } = useGroupMedia('window')

  if (sm) {
    return (
      <View width="100%" flexDirection="column" justify="center" gap="5" py="6">
        {defaultData.map((row, i) => {
          return (
            <View
              key={i}
              rounded="4"
              borderWidth="1"
              borderColor="border-color"
              flex={1}
              self="stretch"
              width="100%"
              gap="2"
              pt="2"
            >
              <XStack items="center" py="1" ml="3" gap="2">
                <Avatar circular size="3">
                  <Avatar.Image aria-label="Profile image" src={row.avatar} />
                  <Avatar.Fallback bg="color-6" />
                </Avatar>
                <View justify="space-between">
                  <Text>{row.fullName}</Text>
                  <Text fontSize="3" color="color-9">
                    {row.username}
                  </Text>
                </View>
                <View ml="auto" pr="3">
                  <StatusButton status={row.status} />
                </View>
              </XStack>

              <View height={2} bg="border-color" />

              <View gap="2">
                {Object.entries(row)
                  .filter(
                    ([name]) =>
                      !['avatar', 'fullName', 'username', 'status'].includes(name)
                  )
                  .map(([name, value], i) => {
                    return (
                      <View key={i}>
                        <View flexDirection="row" justify="space-between" mx="3" pb="2">
                          <Text>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
                          <Text color="color-9">{value}</Text>
                        </View>
                        {i !==
                          Object.entries(row).filter(
                            ([name]) =>
                              !['avatar', 'fullName', 'username', 'status'].includes(name)
                          ).length -
                            1 && <Separator />}
                      </View>
                    )
                  })}
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <Table
      alignCells={{ x: 'center', y: 'center' }}
      alignHeaderCells={{ y: 'center', x: 'center' }}
      cellWidth="18"
      cellHeight="7"
      borderWidth={0}
      p="4"
      maxW="100%"
      maxH={600}
      gap="5"
    >
      <Table.Head>
        {headerGroups.map((headerGroup) => {
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
              key={headerGroup.id}
              justify="flex-start"
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
                  justify="flex-start"
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
        {tableRows.map((row, bodyIndex) => {
          rowCounter.current++
          return (
            <Table.Row
              bg={`${bodyIndex % 2 === 1 ? 'color-1' : 'transparent'} hover:color-3`}
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
                  justify="flex-start"
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
                    <Text theme="level2">
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

UsersTable.fileName = 'UsersTable'
