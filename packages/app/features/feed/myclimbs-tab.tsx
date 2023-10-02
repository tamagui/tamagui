import { Tables } from '@my/supabase/helpers'
import { Calendar } from '@tamagui/lucide-icons'
import qs from 'query-string'
import { FlatList } from 'react-native'
import { api } from 'app/utils/api'
import { Linking } from 'react-native'

import {
  Avatar,
  Card,
  H3,
  Paragraph,
  Spacer,
  Theme,
  YStack,
  useClimbColor,
  Button,
  XStack,
} from '@my/ui'
import { getQueryKey } from '@trpc/react-query'
import { format } from 'date-fns'

import { LinearGradient } from '@tamagui/linear-gradient'
import { useUser, User } from 'app/utils/useUser'
import { ShieldQuestion } from '@tamagui/lucide-icons'
import { useQueryClient } from '@tanstack/react-query'
import { getBaseUrl } from '../../utils/getBaseUrl'
const displayName = {
  top_rope: 'Top Rope',
  lead_rope: 'Lead Rope',
  boulder: 'Boulder',
} as const

type ProfileClimb = Tables<'profile_climbs'> & {
  climb: Tables<'climbs'>
  profile: Tables<'profiles'> | undefined
}

function MyClimb({
  profileClimb,
}: {
  profileClimb: ProfileClimb
  user: User['profile']
}) {
  const { color } = useClimbColor(profileClimb.climb.type)
  const leave = api.climb.leave.useMutation()

  const onPressUpdateSlug = (props: {
    name?: string
    location?: string
    startDate?: string
    endDate?: string
    startTime?: string
    endTime?: string
    timeZone?: string
  }) => {
    Linking.openURL(
      qs.stringifyUrl({
        url: `${getBaseUrl()}/test`,
        query: props,
      })
    )
  }
  const queryClient = useQueryClient()
  const profileClimbQueryKey = getQueryKey(api.me.climbs, undefined, 'query')
  const user = useUser()

  return (
    <Theme name={color}>
      <Card
        overflow="visible"
        height={250}
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
              <Avatar circular pos={'absolute'} top={-18} left={-30} size="$5">
                <Avatar.Image src={user.profile?.avatar_url ?? undefined} />
                <Avatar.Fallback>
                  <YStack jc="center" ai="center">
                    <ShieldQuestion size={24} />
                  </YStack>
                </Avatar.Fallback>
              </Avatar>
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
        <Card.Footer ai="center">
          <Paragraph theme="alt2" size="$1" fontWeight="400">
            {format(new Date(profileClimb.climb.start), 'MMM d')} @{' '}
            {format(new Date(profileClimb.climb.start), 'h:mmaaa')}
          </Paragraph>
          <Spacer flex />
          <XStack gap="$2" jc="flex-start">
            <Button
              onPress={() => {
                onPressUpdateSlug({
                  name: 'Big Climb',
                  location: 'World Wide Web',
                  startDate: '2023-09-21',
                  endDate: '2023-09-21',
                  startTime: '10:15',
                  endTime: '23:30',
                  timeZone: 'America/Los_Angeles',
                })
              }}
            >
              <Calendar />
            </Button>
            <Button
              onPress={() => {
                leave.mutate(
                  {
                    profile_climb_id: profileClimb.id,
                  },
                  {
                    onSuccess: () => {
                      console.log('success ttt', profileClimbQueryKey)
                      // queryClient.invalidateQueries()

                      queryClient.setQueryData<ProfileClimb[]>(
                        profileClimbQueryKey,
                        (old) => {
                          console.log('old', old)
                          return old?.filter((item) => {
                            console.log('item', item, profileClimb.id)
                            return item.id !== profileClimb.id
                          })
                        }
                      )
                    },
                  }
                )
                console.log('leave')
              }}
            >
              Leave
            </Button>
          </XStack>
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

  return (
    <YStack overflow="visible" gap="$5">
      <FlatList
        style={{
          paddingTop: 20,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
        data={climbsQuery.data}
        renderItem={({ item }) => (
          <MyClimb profileClimb={item} user={user.profile} />
        )}
        keyExtractor={(item) => `${item.id}`}
        ItemSeparatorComponent={() => <Spacer size="$5" />}
      />
    </YStack>
  )
}
