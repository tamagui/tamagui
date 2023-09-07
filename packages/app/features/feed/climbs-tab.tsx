import {
  Avatar,
  Card,
  Paragraph,
  ThemeName,
  Theme,
  YStack,
  Spacer,
  H2,
  H3,
  Button,
  XStack,
  Sheet,
  H5,
  isWeb,
  AddToCalendarButton,
} from '@my/ui'
import { api } from 'app/utils/api'
import { add, format, intervalToDuration } from 'date-fns'
import { Tables } from '@my/supabase/helpers'
import { FlatList } from 'react-native'
import { LinearGradient } from '@tamagui/linear-gradient'
import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
type ListClimb = Tables<'climbs'> & {
  climber: Tables<'profiles'>
}

const displayName = {
  top_rope: 'Top Rope',
  lead_rope: 'Lead Rope',
  boulder: 'Boulder',
} as const
function Climb({ climb, onSelect }: { climb: ListClimb; onSelect?: (climb: ListClimb) => void }) {
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
        removeClippedSubviews={true}
        minWidth={320}
        position="relative"
        height={220}
        padding="$4"
        elevation="$0.5"
        shadowRadius={7}
        shadowOpacity={0.2}
        jc="flex-start"
        onPress={() => {
          console.log('hiiiiiii')
          onSelect?.(climb)
        }}
      >
        <Avatar
          borderColor="$backgroundPress"
          // borderWidth={1}
          borderStyle="dotted"
          circular
          size="$7"
        >
          {climb.climber.avatar_url && (
            <Avatar.Image src={climb.climber.avatar_url} bg="$background" />
          )}
          <Avatar.Fallback jc="center" ai="center" bc="$background">
            <H2 fontWeight="400">
              {climb.climber.first_name[0]}
              {climb.climber.last_name[0]}
            </H2>
          </Avatar.Fallback>
        </Avatar>

        <YStack
          position="absolute"
          top={0}
          right={0}
          p="$3"
          // Figure out how to make darker
          bg="$backgroundPress"
          borderColor="alt2"
          borderTopWidth={0}
          borderRightWidth={0}
          borderTopRightRadius="$3"
          borderBottomLeftRadius="$3"
          zIndex={1}
          elevation="$1"
          shadowRadius={6}
          shadowOpacity={0.1}
        >
          <Paragraph size="$2" fontWeight="400">
            {displayName[climb.type]}
          </Paragraph>
        </YStack>

        <Card.Header paddingHorizontal={0} jc="center" ai="flex-start">
          <H3 textTransform="uppercase" size="$5">
            {climb.climber.first_name ?? 'unknown climber'}
          </H3>
          <Paragraph size="$1" fontWeight="400" ellipse>
            {climb.name}
          </Paragraph>
          <Spacer size="$1" />
        </Card.Header>
        <Card.Footer ai="baseline">
          <Paragraph theme="alt2" size="$1" fontWeight="400">
            {format(new Date(climb.start), 'EEEE')} @ {format(new Date(climb.start), 'h:mmaaa')}
          </Paragraph>
          <Spacer flex />
          {/* <Button fontSize="$1" size="$3" borderRadius="$3">
            Join
          </Button> */}
        </Card.Footer>
        <Card.Background>
          <LinearGradient
            width="100%"
            height="100%"
            borderRadius="$3"
            zIndex={-1}
            colors={['$red10', '$yellow10']}
            opacity={0.085}
            start={[1, 1]}
            end={[2, 3]}
          />
        </Card.Background>
      </Card>
    </Theme>
  )
}
export function ClimbsTab() {
  const climbsQuery = api.climb.read.useQuery()
  const [open, setOpen] = useState(false)
  const [selectedClimb, setSelectedClimb] = useState<ListClimb | undefined>(undefined)
  const onSelect = useCallback((climb: ListClimb) => {
    setSelectedClimb(climb)
    setOpen(true)
  }, [])
  // const config = {
  //   name: '[Reminder] Test the Add to Calendar Button',
  //   description:
  //     'Check out the maybe easiest way to include Add to Calendar Buttons to your web projects:[br]→ [url]https://add-to-calendar-button.com/',
  //   startDate: '2023-09-07',
  //   startTime: '10:15',
  //   endTime: '23:30',
  //   options: ['Google|My custom label', 'iCal'],
  //   timeZone: 'America/Los_Angeles',
  // }
  return (
    <YStack overflow="visible" ai="center" gap="$10" removeClippedSubviews={true}>
      <FlatList
        style={{
          flex: 1,
          overflow: 'visible',
        }}
        data={climbsQuery.data}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => <Climb onSelect={onSelect} climb={item} />}
        ItemSeparatorComponent={() => <Spacer size="$6" />}
      />
      {climbsQuery.data && <SheetDemo climb={selectedClimb} open={open} setOpen={setOpen} />}
    </YStack>
  )
}

export const SheetDemo = ({
  climb,
  open,
  setOpen,
}: {
  climb: ListClimb | undefined
  open: boolean
  setOpen: (state: boolean) => void
}) => {
  const [position, setPosition] = useState(0)
  const [modal, setModal] = useState(true)
  const joinMutation = api.climb.join.useMutation()
  const queryClient = useQueryClient()
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

  const reminderConfig = {
    name: `Climb with ${climb?.climber?.first_name ?? 'unknown climber'}`,
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

    // add(new Date(climb?.start ?? 0), {
    //   minutes: intervalToDuration({
    //     start: new Date(climb?.start ?? 0),
    //     end: new Date(climb?.duration ?? 0),
    //   }),
    //   'hh:mm'),
    // })

    options: ['Google', 'iCal'],
    timeZone: 'America/Los_Angeles',
  }

  return (
    <Theme name={color}>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[65, 50, 25]}
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

          {isWeb && (
            <AddToCalendarButton
              // name={climb?.name ?? ''}
              // description="test"
              // startTime={climb?.start}
              // startDate={new Date(climb?.start ?? 0).getDate().toString()}
              // options={['Google', 'iCal']}
              // endTime={add(new Date(climb?.start ?? 0), {
              //   minutes: Number(climb?.duration),
              // }).toISOString()}
              {...reminderConfig}
            />
          )}
          <YStack height={450}>
            {climb?.climber?.first_name && (
              <H3 fontSize="$8" pt="$0.5">
                Climb with {climb.climber.first_name}
              </H3>
            )}
            <Spacer size="$2" />
            {climb?.type && (
              <H5 fontSize="$4" theme="alt2">
                {displayName[climb.type]}
              </H5>
            )}
            <Spacer size="$4" />
            {climb && <Climb climb={climb} />}
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
                        console.log('success')
                        queryClient.setQueryData(
                          [['climb', 'read'], { type: 'query' }],
                          (climbs: ListClimb[] | undefined) => {
                            return climbs?.filter((c) => c.id !== climb.id)
                          }
                        )
                      },
                      onError: (error) => {
                        console.log(error)
                      },
                    }
                  )

                  alert('Request sent!')
                }}
              >
                Request
              </Button>
              <Spacer flex />
              <Button
                theme="alt1"
                padded
                fontSize="$5"
                fontWeight={'700'}
                size="$6"
                borderRadius="$3"
                elevation="$1"
                shadowRadius={6}
                shadowOpacity={0.1}
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
