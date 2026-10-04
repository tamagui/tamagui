import { Avatar } from '../../BentoSkins'
import { randAvatar, randFullName, randUuid } from '@ngneat/falso'
import { Phone } from '../../icons'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import type { ColorTokens } from 'tamagui'
import { Button, Circle, H5, Separator, Text, View } from 'tamagui'

// Define more descriptive status options
const statusOptions = [
  {
    status: 'Available',
    color: 'green-600',
  },
  {
    status: 'Offline',
    color: 'gray-600',
  },
  {
    status: 'In a Meeting',
    color: 'orange-600',
  },
  {
    status: 'On Vacation',
    color: 'pink-600',
  },
  {
    status: 'Do Not Disturb',
    color: 'red-600',
  },
  {
    status: 'Working Remotely',
    color: 'purple-600',
  },
  {
    status: 'Out for Lunch',
    color: 'blue-600',
  },
  {
    status: 'Away from Desk',
    color: 'gray-600',
  },
  {
    status: 'On a Call',
    color: 'blue-600',
  },
  {
    status: 'Taking a Break',
    color: 'yellow-600',
  },
] satisfies { status: string; color: ColorTokens }[]

// Function to generate a person with a random descriptive status
const getPersonList = () => {
  const personsList = Array.from({ length: 10 }, () => ({
    id: randUuid(),
    name: randFullName(),
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    image: `${randAvatar()}?id=${randUuid()}`,
  }))
  return personsList
}

type PersonList = ReturnType<typeof getPersonList>

export function List() {
  const [personsList, setPersonsList] = useState<PersonList>([])

  useEffect(() => {
    setPersonsList(getPersonList())
  }, [])

  const renderItem = ({ item: person }: { item: PersonList[number] }) => (
    <Item person={person} />
  )

  return (
    <View width="100%" flex={1} maxH="gtMd:800px" px="gtMd:4">
      <FlatList
        data={personsList}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Separator pt={16} />}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

List.fileName = 'List'

function Item({ person }: { person: PersonList[number] }) {
  return (
    <View
      flexDirection="row"
      py="2"
      gap="4 @gtXs/window:4"
      p="@gtXs/window:4"
      bg="color-1"
      items="center"
    >
      <View position="relative">
        <Avatar circular size="4">
          <Avatar.Image objectFit="cover" src={person.image} />
          <Avatar.Fallback bg="background" />
        </Avatar>
        <Circle
          borderWidth={1}
          borderColor="border-color"
          r="3%"
          b="3%"
          z={1}
          position="absolute"
          bg={person.status.color}
          size={12}
        />
      </View>
      <View flex={1} flexDirection="column" shrink={1} justify="center">
        <H5>{person.name}</H5>
        <Text fontWeight="2" theme="level2">
          {person.status.status}
        </Text>
      </View>
      <Button circular size="md" scaleIcon={1.5}>
        <Button.Icon>
          <Phone color="green-600" />
        </Button.Icon>
      </Button>
    </View>
  )
}
