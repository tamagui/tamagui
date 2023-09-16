import { Tables } from '@my/supabase/helpers'
import { FlatList } from 'react-native'
import {
  AddToCalendarButton,
  Avatar,
  Button,
  Card,
  H3,
  H5,
  Input,
  Paragraph,
  Sheet,
  Spacer,
  Theme,
  ThemeName,
  XStack,
  YStack,
  isWeb,
  styled,
  useToastController,
} from '@my/ui'
import { api } from 'app/utils/api'
import { add, format, intervalToDuration } from 'date-fns'

import { LinearGradient } from '@tamagui/linear-gradient'
import { useUser, User } from 'app/utils/useUser'
import { User as UserIcon, HelpCircle, ShieldQuestion } from '@tamagui/lucide-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
const TransparentInput = styled(Input, {
  borderColor: 'fuck',
  borderWidth: 0,
  outlineColor: 'transparent',
  hoverStyle: {
    borderColor: 'transparent',
    outlineColor: '$someColorThatDoesNotExist',
    borderWidth: '$890',
  },
  focusStyle: {
    borderColor: 'transparent',
    outlineColor: 'someColorThatDoesNotExist',
    borderWidth: 0,
  },
})
const displayName = {
  top_rope: 'Top Rope',
  lead_rope: 'Lead Rope',
  boulder: 'Boulder',
} as const

type ProfileClimb = Tables<'profile_climbs'> & {
  climb: Tables<'climbs'>
  profile: Tables<'profiles'> | undefined
}

function MyClimb({ profileClimb }: { profileClimb: ProfileClimb; user: User['profile'] }) {
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

  const [open, setOpen] = useState(false)
  const [selectedClimb, setSelectedClimb] = useState<ProfileClimb | undefined>(undefined)

  const onSelect = useCallback((climb: ProfileClimb) => {
    setSelectedClimb(climb)
    setOpen(true)
  }, [])

  return (
    <YStack overflow="visible" gap="$5">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={climbsQuery.data}
        renderItem={({ item }) => <MyClimb profileClimb={item} user={user.profile} />}
        keyExtractor={(item) => `${item.id}`}
        ItemSeparatorComponent={() => <Spacer size="$5" />}
      />
      {climbsQuery.data && <SheetDemo profileClimb={selectedClimb} open={open} setOpen={setOpen} />}
    </YStack>
  )
}
const SheetDemo = ({
  profileClimb,
  open,
  setOpen,
}: {
  open: boolean
  profileClimb: ProfileClimb | undefined
  setOpen: (state: boolean) => void
}) => {
  const [position, setPosition] = useState(0)
  const [modal, setModal] = useState(true)
  const joinMutation = api.climb.join.useMutation()
  const queryClient = useQueryClient()
  const { data: user } = api.me.profile.useQuery()
  const { climb, profile } = profileClimb ?? {}
  // const [innerOpen, setInnerOpen] = useState(false)

  let color: ThemeName = 'orange'
  switch (climb?.type) {
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
  }
  const toast = useToastController()
  const reminderConfig = {
    name: `Climb with ${profile?.first_name ?? 'unknown climber'}`,
    description: climb?.name ?? '',
    startDate: format(new Date(climb?.start ?? 0), 'yyyy-MM-dd'),
    startTime: format(new Date(climb?.start ?? 0), 'hh:mm'),
    endTime: format(
      add(new Date(climb?.start ?? 0), {
        minutes: intervalToDuration({
          start: new Date(climb?.start ?? 0),
          end: new Date(climb?.duration ?? 0),
        }).minutes,
      }),
      'hh:mm'
    ),
    options: ['Google', 'iCal'],
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
  return (
    <Theme name={color}>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[58]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="bouncy"
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame
          flex={1}
          padding="$4"
          bg="$backgroundPress"
          justifyContent="flex-start"
          alignItems="center"
          space="$5"
        >
          {/* <Button size="$6" circular icon={ChevronDown} onPress={() => setOpen(false)} /> */}
          {/* <Input width={200} /> */}

          {isWeb && <AddToCalendarButton {...reminderConfig} />}
          <YStack height={450}>
            {profile?.first_name && (
              <>
                <H3 fontSize="$8" pt="$0.5">
                  Climb with {profile.first_name}
                </H3>
                <Paragraph size="$2" fontWeight="400">
                  @{profile.username}
                </Paragraph>
              </>
            )}
            <Spacer size="$2" />
            {climb?.type && (
              <H5 fontSize="$4" theme="alt2">
                {displayName[climb.type]}
              </H5>
            )}
            <Spacer size="$4" />
            {profileClimb && <MyClimb profileClimb={profileClimb} user={user} />}
            <Spacer size="$6" />
            <XStack>
              <Button
                padded
                fontSize="$5"
                fontWeight={'700'}
                size="$6"
                theme={'alt2'}
                themeInverse
                borderRadius="$3"
                elevation="$1"
                shadowRadius={10}
                shadowOpacity={0.9}
                onPress={async () => {
                  setOpen(false)
                  if (!climb) return
                  await joinMutation.mutateAsync(
                    { climb_id: climb?.id ?? 0 },
                    {
                      onSuccess: () => {
                        // toast.show('You joined the climb!', {
                        //   message: `You are climbing with ${profileClimb..first_name}`,
                        // })
                        // queryClient.setQueryData(
                        //   [['climb', 'read'], { type: 'query' }],
                        //   (climbs: ListClimb[] | undefined) => {
                        //     return climbs?.filter((c) => c.id !== climb.id)
                        //   }
                        // )
                      },
                      onError: (error) => {
                        // TODO: create toast for error case
                        console.log(error)
                      },
                    }
                  )
                }}
              >
                {user?.id === profileClimb?.climb?.created_by ? 'Edit' : 'Join'}
              </Button>
              <Spacer flex />
              <Button
                theme="alt1"
                padded
                bg={4}
                fontSize="$5"
                fontWeight={'700'}
                size="$6"
                borderRadius="$3"
                elevation="$1"
                shadowRadius={6}
                shadowOpacity={0.1}
                onPress={() => setOpen(false)}
              >
                Cancel
              </Button>
            </XStack>
          </YStack>
          {/* {modal && (
            <>
              <InnerSheet open={innerOpen} onOpenChange={setInnerOpen} />
              <Button size="$6" circular icon={ChevronUp} onPress={() => setInnerOpen(true)} />
            </>
          )} */}
        </Sheet.Frame>
      </Sheet>
    </Theme>
  )
}
