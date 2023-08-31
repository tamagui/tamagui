import { Tables } from '@my/supabase/helpers'
import { FlatList } from 'react-native'
import {
  Avatar,
  Card,
  H2,
  H3,
  H5,
  Paragraph,
  Spacer,
  Theme,
  ThemeName,
  XStack,
  YStack,
} from '@my/ui'
import { api } from 'app/utils/api'
import { format } from 'date-fns'

import { useUser, User } from 'app/utils/useUser'

const displayName = {
  top_rope: 'Top Rope',
  lead_rope: 'Lead Rope',
  boulder: 'Boulder',
} as const
function Climb({
  climb,
  profile,
  user,
}: {
  climb: Tables<'climbs'>
  profile: Tables<'profiles'> | undefined
  user: User
}) {
  let color: ThemeName
  switch (climb.type) {
    case 'lead_rope': {
      color = 'orange'
      break
    }
    case 'top_rope': {
      color = 'blue'
      break
    }
    case 'boulder': {
      color = 'purple'
      break
    }
    default: {
      throw Error(':(')
    }
  }
  return (
    <Theme name={color}>
      <Card
        position="relative"
        height={200}
        width="100%"
        onPress={() => {
          // setOpen()
          // onJoin(climb)
        }}
      >
        <YStack
          position="absolute"
          right={0}
          p="$3"
          bg="$backgroundPress"
          borderTopRightRadius="$3"
          borderBottomLeftRadius="$3"
          top={0}
        >
          <Paragraph size="$2" fontWeight="300">
            {displayName[climb.type]}
          </Paragraph>
        </YStack>
        <Card.Header>
          <H2 size="$5" ellipse textTransform="capitalize">
            {profile?.first_name}
          </H2>
        </Card.Header>
        {/* <Avatar
          borderColor="$backgroundPress"
          borderWidth={1}
          borderStyle="solid"
          circular
          size="$8"
        >
          {user.avatarUrl && <Avatar.Image src={user.avatarUrl} bg="$background" />}
          <Avatar.Fallback jc="center" ai="center" bc="$background"></Avatar.Fallback>
        </Avatar>
        <H3 size="$12" fontWeight="200">
          +
        </H3>
        <Spacer size="$2" />
        <Avatar
          borderColor="$backgroundPress"
          borderWidth={1}
          borderStyle="solid"
          circular
          size="$8"
        >
          {profile?.avatar_url && <Avatar.Image src={profile?.avatar_url ?? ''} bg="$background" />}
          <Avatar.Fallback jc="center" ai="center" bc="$background">
            <H2 fontWeight="400">
              {profile?.first_name}
              {profile?.last_name[0]}
            </H2>
          </Avatar.Fallback>
        </Avatar> */}
        <Paragraph size="$1" fontWeight="300">
          {climb.name}
        </Paragraph>
        <Spacer size="$1" />
        <Card.Footer
          position="absolute"
          bottom={0}
          right={0}
          bg="$backgroundFocus"
          padding="$2"
          paddingHorizontal="$3"
          borderTopLeftRadius="$3"
          borderBottomRightRadius="$3"
        >
          <Paragraph color="$backgroundTransparent" fontWeight="300">
            {format(new Date(climb.start), 'EEEE')} @ {format(new Date(climb.start), 'h:mmaaa')}
          </Paragraph>
        </Card.Footer>
      </Card>
    </Theme>
  )
}
export function MyClimbsTab() {
  // TODO: Get Climbs
  const climbsQuery = api.me.climbs.useQuery()
  const user = useUser()
  console.log(climbsQuery.data)
  return (
    <YStack>
      <YStack gap="$5">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={climbsQuery.data}
          renderItem={({ item }) => <Climb climb={item.climb} profile={item.profile} user={user} />}
          keyExtractor={(item) => `${item.id}`}
          ItemSeparatorComponent={() => <Spacer size="$10" />}
        />
      </YStack>
    </YStack>
  )
}
