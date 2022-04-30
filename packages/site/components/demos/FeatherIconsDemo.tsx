import * as FeatherIcons from '@tamagui/feather-icons'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { Grid, Input, Paragraph, Spacer, YStack } from 'tamagui'

export default function FeatherIconsDemo() {
  const [search, setSearch] = useState('')
  const icons = Object.keys(FeatherIcons)
    .filter((x) => x.toLowerCase().startsWith(search))
    .map((name) => ({ name, Icon: FeatherIcons[name] }))

  const size = 100

  return (
    <YStack als="stretch" p="$4" pb="$0" space>
      <Input value={search} onChangeText={setSearch} placeholder="Search..." />

      <YStack h={420}>
        <ScrollView>
          <Grid itemMinWidth={size}>
            {icons.map(({ Icon, name }) => {
              return (
                <YStack h={size} ai="center" jc="center" key={name}>
                  <Icon size={size * 0.25} />
                  <Spacer />
                  <Paragraph size="$2" o={0.5}>
                    {name}
                  </Paragraph>
                </YStack>
              )
            })}
          </Grid>
        </ScrollView>
      </YStack>
    </YStack>
  )
}
