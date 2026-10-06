import { LinearGradient } from '@tamagui/linear-gradient'
import type { ThemeName } from 'tamagui'
import { useState } from 'react'
import { Button, View, Circle, Avatar, SizableText } from 'tamagui'
import { ChevronDown, ChevronUp, MapPin, User2 } from '../../icons'

const data = [
  {
    title: 'Meeting with Jack Smith',
    date: '8:00 - 8:45 AM (UTC)',
    type: 'in-person',
    label: 'On Google Meet',
    department: 'Marketing',
    participants: null,
    theme: 'blue' as ThemeName,
  },
  {
    title: 'Tamagui 4th Annual Conference',
    date: '7:00 - 8:00 PM (UTC)',
    type: 'hall',
    whereIs: '3415 7th Ave, New York',
    label: 'by Tamagui',
    participants: '12/15',
    theme: 'green' as ThemeName,
    department: null,
  },
]

/** ------ EXAMPLE ------ */
export function Meeting() {
  return (
    <View flexDirection="row" gap="3" flexWrap="wrap" maxW="100%" px="4" py="6">
      {data.map((item) => (
        <MeetingItem key={item.title} item={item} />
      ))}
    </View>
  )
}

function MeetingItem({ item }: { item: (typeof data)[0] }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <View
      flexDirection="column"
      shrink={1}
      gap="3"
      p="3"
      justify="center"
      self="stretch"
      width="100%"
      rounded={10}
      overflow="hidden"
      position="relative"
      theme={item.theme}
    >
      <LinearGradient
        colors={['color-3', 'color-6']}
        start={[1, 1]}
        end={[1, 0]}
        position="absolute"
        inset={0}
      />
      <View position="relative" flexDirection="column" z={1}>
        <View flexDirection="row" justify="space-between" items="center">
          <SizableText>{item.title}</SizableText>
          <Button
            circular
            size="xs"
            variant="outlined"
            onPress={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            <Button.Icon>{expanded ? <ChevronUp /> : <ChevronDown />}</Button.Icon>
          </Button>
        </View>
        <SizableText color="color-10" size="3">
          {item.date}
        </SizableText>
      </View>
      {expanded && (
        <>
          {item.type === 'in-person' ? (
            <Users />
          ) : (
            <View position="relative" flexDirection="row" gap="2" items="center">
              <Circle size="2" bg="background/20">
                <MapPin size={14} />
              </Circle>
              <SizableText>{item.whereIs}</SizableText>
            </View>
          )}
          <View
            position="relative"
            flexDirection="row"
            justify="space-between"
            items="center"
          >
            <SizableText color="color-10" size="1">
              {item.label}
            </SizableText>
            {item.participants ? (
              <View flexDirection="row" gap="1">
                <User2 size={14} y={3} />
                <SizableText color="color-10" size="2">
                  {item.participants}
                </SizableText>
              </View>
            ) : (
              <SizableText
                px="2"
                rounded={1000}
                borderWidth={1}
                borderColor="color-9"
                color="color-10"
                size="1"
              >
                Marketing
              </SizableText>
            )}
          </View>
        </>
      )}
    </View>
  )
}

const users = [1, 2, 3]
export function Users() {
  return (
    <View
      flexDirection="row"
      rounded={1000}
      borderColor="color-1"
      shrink={1}
      self="center"
      mr="auto"
      justify="center"
      items="center"
      position="relative"
    >
      {users.map((item, index) => (
        <View z={index} ml={index !== 0 ? '-2' : undefined} key={item}>
          <User size={24} imageUrl={`/bento/images/avatar_${item}.png`} />
        </View>
      ))}
      <SizableText size="2" fontWeight="200" mx="1" mr="2-5">
        +2
      </SizableText>
    </View>
  )
}

function User({ size, imageUrl }: { size: number; imageUrl?: string }) {
  return (
    <Avatar borderWidth="1" borderColor="color-1" circular size={size}>
      <Avatar.Image aria-label="Attendee avatar" src={imageUrl} />
      <Avatar.Fallback bg="background" />
    </Avatar>
  )
}
