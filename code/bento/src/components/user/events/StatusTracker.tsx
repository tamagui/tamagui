import { getFontSized } from '@tamagui/get-font-sized'
import { Clock4, Laptop2, MinusCircle } from '@tamagui/lucide-icons'
import { Avatar, Button, Circle, Separator, Text, Theme, View, styled } from 'tamagui'

const data = {
  absent: [
    {
      name: 'Rousi belli',
      replacedBy: 'Replaced by John bo',
      min: '',
      job: 'Developer',
      id: '1',
      avatar: '/avatars/300 (5).jpeg',
    },
  ],
  away: [
    {
      name: 'Jack nick',
      job: 'Developer',
      min: '30m',
      replacedBy: '',
      id: '2m',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Alexa perry',
      job: 'Designer',
      min: '15m',
      replacedBy: '',
      id: '3',
      avatar: '/avatars/300 (3).jpeg',
    },
    {
      name: 'Eva sam',
      job: 'Developer',
      min: '45m',
      replacedBy: '',
      id: '4',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
  ],
}

const SizableText = styled(Text, {
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

/** ------ EXAMPLE ------ */
export function StatusTracker() {
  return (
    <View
      flexDirection="column"
      borderRadius={20}
      padding="$3"
      $group-window-sm={{
        paddingHorizontal: '$4',
        marginVertical: '$6',
      }}
      // minWidth="100%"
      $group-window-gtSm={{
        minWidth: 400,
      }}
      maxWidth="100%"
      gap="$3"
      borderColor="$color5"
      borderWidth={1}
    >
      <View flexDirection="row" alignItems="center" justifyContent="space-between">
        <View alignItems="center" flexDirection="row" theme="alt1" gap="$3">
          <Laptop2 size={16} />
          <SizableText size="$4">Status Tracker</SizableText>
        </View>
        <Button chromeless size="$2" bordered borderRadius="$3">
          <Button.Text>See All</Button.Text>
        </Button>
      </View>
      <Separator />
      <View flexDirection="column" gap="$2" paddingBottom={'$2'}>
        <SizableText size="$3" theme="alt1" fontWeight="200">
          Absent
        </SizableText>
        {data.absent.map((user, index) => (
          <User type="absent" user={user} key={user.id} />
        ))}
      </View>
      <Separator />
      <View flexDirection="column" gap="$2">
        <SizableText size="$3" theme="alt1" fontWeight="200">
          Away
        </SizableText>
        <View flexDirection="column" gap="$3">
          {data.away.map((user, index) => (
            <User type="away" user={user} key={user.id} />
          ))}
        </View>
      </View>
    </View>
  )
}

StatusTracker.fileName = 'StatusTracker'

function User({
  user,
  type,
}: { type: keyof typeof data; user: (typeof data)['absent'][0] }) {
  const { name, replacedBy, avatar, job, min } = user
  return (
    <View flexDirection="row" alignItems="center" gap="$3">
      <View>
        <Avatar borderRadius="$2" size="$3" circular>
          <Avatar.Image accessibilityLabel="Cam" src={avatar} />
          <Avatar.Fallback backgroundColor="$background" />
        </Avatar>
        <Circle
          width={10}
          height={10}
          position="absolute"
          bottom="$1.5"
          right="$-1"
          borderWidth="$1"
          borderColor="$color1"
          zIndex={10}
          backgroundColor="$orange8"
        />
      </View>
      <View flexDirection="column">
        <SizableText size="$4" y={2}>
          {name}
        </SizableText>
        <SizableText color="$color9" size="$2" y={-2}>
          {replacedBy ? replacedBy : job}
        </SizableText>
      </View>
      <View
        backgroundColor="$color5"
        borderRadius={100}
        paddingHorizontal="$2"
        paddingVertical={6}
        paddingRight={10}
        flexDirection="row"
        marginLeft="auto"
        justifyContent="center"
        alignItems="center"
        gap="$1.5"
        theme={type === 'absent' ? 'gray' : 'orange'}
      >
        <Theme name="alt2">
          {type === 'absent' ? (
            <>
              <MinusCircle size={14} />
              <SizableText size="$1" lineHeight={0}>
                Absent
              </SizableText>
            </>
          ) : (
            <>
              <Clock4 size={14} />
              <SizableText size="$1" lineHeight={0}>
                {min}
              </SizableText>
            </>
          )}
        </Theme>
      </View>
    </View>
  )
}
