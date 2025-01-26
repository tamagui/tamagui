import { LinearGradient } from '@tamagui/linear-gradient'
import type { SizeTokens, ThemeName } from 'tamagui'
import { Avatar, Button, View, styled, Text, Circle } from 'tamagui'
import { ChevronDown, MapPin, User2 } from '@tamagui/lucide-icons'
import { getFontSized } from '@tamagui/get-font-sized'

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    size: {
      '...fontSize': getFontSized,
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})

const data = [
  {
    title: 'Metting with Jack smith',
    date: '8:00 - 8:45 AM (UTC)',
    type: 'in-person',
    label: 'On Google Meet',
    department: 'Marketing',
    participants: null,
    theme: 'purple' as ThemeName,
  },
  {
    title: 'Tamagui 4th year conference',
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
export function Example() {
  return (
    <View
      flexDirection="row"
      gap="$3"
      flexWrap="wrap"
      maxWidth="100%"
      paddingHorizontal="$4"
      paddingVertical="$6"
    >
      {data.map((item, index) => (
        <Meeting key={item.title} item={item} />
      ))}
    </View>
  )
}

Example.fileName = 'Meeting'

function Meeting({ item }: { item: (typeof data)[0] }) {
  return (
    <View
      flexDirection="column"
      flexShrink={1}
      theme={item.theme}
      gap="$3"
      padding="$3"
      justifyContent="center"
      alignSelf="stretch"
      width="100%"
      borderRadius={10}
      overflow="hidden"
    >
      <LinearGradient
        colors={['color3', '$color7']}
        start={[1, 1]}
        end={[1, 0]}
        fullscreen
      />
      <View flexDirection="column">
        <View flexDirection="row" justifyContent="space-between" alignItems="center">
          <SizableText>{item.title}</SizableText>
          <Button circular size="$2">
            <Button.Icon>
              <ChevronDown />
            </Button.Icon>
          </Button>
        </View>
        <SizableText color="$color11" size="$3">
          {item.date}
        </SizableText>
      </View>
      {item.type === 'in-person' ? (
        <Users />
      ) : (
        <View flexDirection="row" gap="$2" alignItems="center">
          <Circle size="$2" backgroundColor="$background02">
            <MapPin size={14} />
          </Circle>
          <SizableText>{item.whereIs}</SizableText>
        </View>
      )}
      <View flexDirection="row" justifyContent="space-between" alignItems="center">
        <SizableText color="$color11" size="$1">
          {item.label}
        </SizableText>
        {item.participants ? (
          <View flexDirection="row" gap="$1">
            <User2 size={14} y={3} />
            <SizableText color="$color11" size="$2">
              {item.participants}
            </SizableText>
          </View>
        ) : (
          <SizableText
            paddingHorizontal="$2"
            borderRadius={1000}
            borderWidth={1}
            borderColor="$color10"
            size="$1"
            color="$color11"
          >
            Marketing
          </SizableText>
        )}
      </View>
    </View>
  )
}

const users = [1, 2, 3]
export function Users() {
  return (
    <View
      flexDirection="row"
      borderRadius={1000}
      borderColor="$color1"
      flexShrink={1}
      alignSelf="center"
      marginRight="auto"
      justifyContent="center"
      alignItems="center"
    >
      {users.map((item, index) => (
        <View zIndex={index} marginLeft={index !== 0 ? '$-2' : undefined} key={item}>
          <User size="$2" imageUrl={`/avatars/300 (1).jpeg`} />
        </View>
      ))}
      <SizableText size="$2" fontWeight="200" marginHorizontal="$1" marginRight="$2.5">
        +2
      </SizableText>
    </View>
  )
}

function User({ size, imageUrl }: { size: SizeTokens; imageUrl?: string }) {
  return (
    <Avatar borderWidth="$1" borderColor="$color1" circular size={size}>
      <Avatar.Image accessibilityLabel="Cam" src={imageUrl} />
      <Avatar.Fallback backgroundColor="$background" />
    </Avatar>
  )
}
