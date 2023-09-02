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
} from '@my/ui'
import { api } from 'app/utils/api'
import { format } from 'date-fns'
import { Tables } from '@my/supabase/helpers'
import { FlatList } from 'react-native'
import { LinearGradient } from '@tamagui/linear-gradient'

import { useCallback, useState } from 'react'

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
        f={1}
        overflow="visible"
        minWidth={320}
        position="relative"
        height={220}
        padding="$4"
        elevation="$1"
        shadowRadius={6}
        shadowOpacity={0.1}
        onPress={() => onSelect?.(climb)}
      >
        <Avatar
          borderColor="$backgroundPress"
          borderWidth={1}
          borderStyle="solid"
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

        <Spacer size="$3" />
        <Card.Header f={1}>
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
  console.log(climbsQuery.data, 'climbs')
  const [open, setOpen] = useState(false)
  const [selectedClimb, setSelectedClimb] = useState<ListClimb | null>(null)
  const onSelect = useCallback((climb: ListClimb) => {
    setSelectedClimb(climb)
    setOpen(true)
  }, [])

  return (
    <>
      <YStack overflow="visible" ai="center" gap="$10">
        <FlatList
          style={{
            flex: 1,
            overflow: 'visible',
          }}
          data={climbsQuery.data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => <Climb onSelect={onSelect} climb={item} />}
          ItemSeparatorComponent={() => <Spacer size="$6" />}
        />
      </YStack>
      {climbsQuery.data && <SheetDemo climb={selectedClimb} open={open} setOpen={setOpen} />}
    </>
  )
}

export const SheetDemo = ({
  climb,
  open,
  setOpen,
}: {
  climb: ListClimb | null
  open: boolean
  setOpen: (state: boolean) => void
}) => {
  const [position, setPosition] = useState(0)
  const [modal, setModal] = useState(true)
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
                shadowRadius={6}
                shadowOpacity={0.1}
                onPress={() => {
                  setOpen(false)
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
