import { ChevronRight } from '@tamagui/lucide-icons'
import { ScrollView } from 'react-native'
import { H1, ListItem, YGroup, YStack } from 'tamagui'
import { demos } from './demos'

export function HomeScreen({ onSelect }: { onSelect: (demoName: string) => void }) {
  return (
    <ScrollView>
      <YStack bg="$color2" p="$3" pt="$6" pb="$8" flex={1} gap="$4">
        <H1 fontFamily="$heading" size="$9">
          Kitchen Sink
        </H1>

        <YStack gap="$4" maxW={600}>
          <YGroup size="$4">
            {demos.map((demo) => (
              <YGroup.Item key={demo.key}>
                <ListItem
                  bg="$color1"
                  pressStyle={{ backgroundColor: '$color2' }}
                  size="$4"
                  iconAfter={<ChevronRight color="$color10" />}
                  onPress={() => onSelect(demo.key)}
                >
                  {demo.title}
                </ListItem>
              </YGroup.Item>
            ))}
          </YGroup>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
