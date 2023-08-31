import { YStack, Spacer } from '@my/ui'
import { api } from 'app/utils/api'
import { FlatList } from 'react-native'
import { useState } from 'react'
import { ListClimb, Climb, SheetDemo } from './climbs-tab'

export function ClimbsTab() {
  const climbsQuery = api.climb.read.useQuery()
  console.log(climbsQuery.data, 'climbs')
  const [open, setOpen] = useState(false)
  const [selectedClimb, setSelectedClimb] = useState<ListClimb | null>(null)
  useEffect(() => {
    if (climbsQuery.data) {
      setSelectedClimb(climbsQuery.data[0])
    }
  }, [climbsQuery.data])

  return (
    <>
      <YStack>
        <YStack ai="center" gap="$10">
          <FlatList
            style={{
              flex: 1,
            }}
            data={climbsQuery.data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => <Climb onSelect={setSelectedClimb} climb={item} />}
            ItemSeparatorComponent={() => <Spacer size="$10" />}
          />
        </YStack>
      </YStack>
      <SheetDemo climb={selectedClimb} open={open} setOpen={setOpen} />
    </>
  )
}
