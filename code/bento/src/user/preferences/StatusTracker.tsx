import { Clock4, Laptop2, MinusCircle } from '../../icons'
import {
  Button,
  Circle,
  Separator,
  Text,
  Theme,
  View,
  styled,
  Avatar,
  SizableText,
} from 'tamagui'

const data = {
  absent: [
    {
      name: 'Rousi belli',
      replacedBy: 'Replaced by John bo',
      min: '',
      job: 'Developer',
      id: '1',
      avatar: 'https://i.pravatar.cc/150?img=5',
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
      avatar: 'https://i.pravatar.cc/150?img=3',
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


/** ------ EXAMPLE ------ */
export function StatusTracker() {
  return (
    <View
      flexDirection="column"
      rounded={20}
      p="3"
      px="@max-md/window:4"
      my="@max-md/window:6"
      minW="@md/window:400px"
      maxW="100%"
      gap="3"
      borderColor="color-5"
      borderWidth={1}
    >
      <View flexDirection="row" items="center" justify="space-between">
        <View flexDirection="row" items="center" gap="3" theme="accent">
          <Laptop2 size={16} />
          <SizableText size="4">Status Tracker</SizableText>
        </View>
        <Button variant="quiet" size="xs" rounded="3">
          <Button.Text>See All</Button.Text>
        </Button>
      </View>
      <Separator />
      <View flexDirection="column" gap="2" pb="2">
        <SizableText size="3" theme="accent" fontWeight="200">
          Absent
        </SizableText>
        {data.absent.map((user) => (
          <User type="absent" user={user} key={user.id} />
        ))}
      </View>
      <Separator />
      <View flexDirection="column" gap="2">
        <SizableText size="3" theme="accent" fontWeight="200">
          Away
        </SizableText>
        <View flexDirection="column" gap="3">
          {data.away.map((user) => (
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
}: {
  type: keyof typeof data
  user: (typeof data)['absent'][0]
}) {
  const { name, replacedBy, avatar, job, min } = user
  return (
    <View flexDirection="row" items="center" gap="3">
      <View position="relative">
        <Avatar rounded="2" size="3" circular>
          <Avatar.Image aria-label={`${name} avatar`} src={avatar} />
          <Avatar.Fallback bg="background" />
        </Avatar>
        <Circle
          width={10}
          height={10}
          position="absolute"
          b="1"
          r="-1"
          borderWidth="1"
          borderColor="color-1"
          z={10}
          bg="orange-9"
        />
      </View>
      <View flexDirection="column">
        <SizableText size="4" y={2}>
          {name}
        </SizableText>
        <SizableText color="color-8" y={-2} size="2">
          {replacedBy ? replacedBy : job}
        </SizableText>
      </View>
      <View
        bg="color-5"
        rounded={100}
        px="2"
        py={6}
        pr={10}
        flexDirection="row"
        ml="auto"
        justify="center"
        items="center"
        gap="1"
        theme={type === 'absent' ? 'gray' : 'orange'}
      >
        <Theme name="accent">
          {type === 'absent' ? (
            <>
              <MinusCircle size={14} />
              <SizableText size="1" lineHeight={0}>
                Absent
              </SizableText>
            </>
          ) : (
            <>
              <Clock4 size={14} />
              <SizableText size="1" lineHeight={0}>
                {min}
              </SizableText>
            </>
          )}
        </Theme>
      </View>
    </View>
  )
}
