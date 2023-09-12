import { Tables } from '@my/supabase/helpers'
import { FlatList } from 'react-native'
import { Avatar, Card, H3, Paragraph, Spacer, Theme, ThemeName, YStack } from '@my/ui'
import { api } from 'app/utils/api'
import { format } from 'date-fns'

import { LinearGradient } from '@tamagui/linear-gradient'
import { useUser, User } from 'app/utils/useUser'
import { User as UserIcon, HelpCircle, ShieldQuestion } from '@tamagui/lucide-icons'

const displayName = {
  top_rope: 'Top Rope',
  lead_rope: 'Lead Rope',
  boulder: 'Boulder',
} as const

function MyClimb({
  profileClimb,
}: {
  profileClimb: Tables<'profile_climbs'> & {
    climb: Tables<'climbs'>
    profile: Tables<'profiles'> | undefined
  }
  user: User
}) {
  let color: ThemeName
  switch (profileClimb.climb.type) {
    case 'lead_rope': {
      color = 'orange'
      break
    }
    case 'top_rope': {
      color = 'blue'
      break
    }
    case 'boulder': {
      color = 'light_purple'
      break
    }
    default: {
      throw Error(':(')
    }
  }

  return (
    <Theme name={color}>
      <Card
        overflow="visible"
        height={220}
        minWidth={320}
        padding="$4"
        elevation="$1"
        shadowRadius={6}
        shadowOpacity={0.1}
        marginHorizontal="$3"
        br={10}
      >
        <YStack
          position="absolute"
          right={0}
          top={0}
          p="$3"
          bg="$backgroundPress"
          borderStyle="solid"
          borderWidth={3}
          borderTopWidth={0}
          borderRightWidth={0}
          borderColor="$background"
          borderTopRightRadius="$3"
          borderBottomLeftRadius="$3"
        >
          <Paragraph size="$2" fontWeight="300">
            {displayName[profileClimb.climb.type]}
          </Paragraph>
        </YStack>
        <Card.Header f={1}>
          <YStack>
            <YStack pos="relative" mt="$4" ml="$3">
              <Avatar circular pos={'absolute'} top={-18} left={-25} size="$5">
                {/* {user.avatarUrl && user.user?.id !== profileClimb.profile?.id && ( */}
                <Avatar.Image src={undefined} />
                {/* )} */}
                <Avatar.Fallback>
                  <YStack jc="center" ai="center">
                    <ShieldQuestion size={24} />
                  </YStack>
                </Avatar.Fallback>
              </Avatar>
              {/* <Avatar circular pos={'absolute'} size="$5">
                {profileClimb.profile?.avatar_url && (
                  <Avatar.Image src={profileClimb.profile?.avatar_url} />
                )} */}
              <Avatar circular size="$5">
                {profileClimb.profile?.avatar_url && (
                  <Avatar.Image src={profileClimb.profile.avatar_url} />
                )}
              </Avatar>
            </YStack>
          </YStack>
        </Card.Header>
        <YStack f={1}>
          <H3 textTransform="uppercase" size="$5">
            {profileClimb.profile?.first_name ?? 'unknown climber'}
          </H3>
          <Paragraph size="$1" fontWeight="400" ellipse>
            {profileClimb.climb.name}
          </Paragraph>
        </YStack>

        <Card.Footer ai="baseline">
          <Paragraph theme="alt2" size="$1" fontWeight="400">
            {format(new Date(profileClimb.climb.start), 'MMM d')} @{' '}
            {format(new Date(profileClimb.climb.start), 'h:mmaaa')}
          </Paragraph>
          <Spacer flex />
        </Card.Footer>
        <Card.Background>
          <LinearGradient
            width="100%"
            height="100%"
            borderRadius="$3"
            zIndex={-1}
            colors={['$red10', '$yellow10']}
            opacity={0.15}
            start={[1, 1]}
            end={[0, 0]}
          />
        </Card.Background>
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
    <YStack overflow="visible" gap="$5">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={climbsQuery.data}
        renderItem={({ item }) => <MyClimb profileClimb={item} user={user} />}
        keyExtractor={(item) => `${item.id}`}
        ItemSeparatorComponent={() => <Spacer size="$5" />}
      />
    </YStack>
  )
}
