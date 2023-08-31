import {
  Avatar,
  Card,
  H5,
  Paragraph,
  ThemeName,
  Theme,
  YStack,
  Spacer,
  H2,
  H3,
  Image,
  Button,
} from '@my/ui'
import { api } from 'app/utils/api'
import { format } from 'date-fns'
import { Tables } from '@my/supabase/helpers'
import { FlatList } from 'react-native'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Car } from '@tamagui/lucide-icons'

const displayName = {
  top_rope: 'Top Rope',
  lead_rope: 'Lead Rope',
  boulder: 'Boulder',
} as const
function Climb({
  climb,
}: // setOpen,
// onJoin,
{
  climb: Tables<'climbs'> & {
    climber: Tables<'profiles'>
  }
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
        f={1}
        minWidth={320}
        animation="bouncy"
        pressStyle={{ scale: 0.92 }}
        position="relative"
        height={220}
        padding="$3"
      >
        <Avatar
          borderColor="$backgroundPress"
          borderWidth={1}
          borderStyle="solid"
          circular
          size="$10"
          // position="absolute"
          // top={-42}
          // marginLeft={-44}
          // left="50%"
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
          right={0}
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
          <Button fontSize="$1" size="$3" borderRadius="$3">
            Join
          </Button>
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
export function ClimbsTab() {
  const climbsQuery = api.climb.read.useQuery()
  console.log(climbsQuery.data, 'climbs')
  return (
    <YStack>
      <YStack ai="center" gap="$10">
        <FlatList
          style={{
            flex: 1,
          }}
          data={climbsQuery.data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => <Climb climb={item} />}
          ItemSeparatorComponent={() => <Spacer size="$10" />}
        />
      </YStack>
    </YStack>
  )
}
