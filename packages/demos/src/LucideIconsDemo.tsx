import * as LucideIcons from '@tamagui/lucide-icons'
import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Grid, Input, Paragraph, Spacer, YStack, useDebounceValue } from 'tamagui'

const lucideIcons = Object.keys(LucideIcons).map((name) => ({
  key: name.toLowerCase(),
  name,
  Icon: LucideIcons[name],
}))

export function LucideIconsDemo() {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 400)

  const size = 100

  const iconsMemo = useMemo(() => {
    const icons = lucideIcons.filter((x) => x.key.startsWith(search.toLowerCase()))
    return icons.slice(0, 835).map(({ Icon, name }) => {
      return (
        <YStack h={size} ai="center" jc="center" key={name}>
          <Icon size={size * 0.25} />
          <Spacer />
          <Paragraph size="$2" o={0.5}>
            {name}
          </Paragraph>
        </YStack>
      )
    })
  }, [search])

  return (
    <YStack als="stretch" p="$4" pb="$0" space>
      <Input value={searchRaw} onChangeText={setSearch} placeholder="Search..." />

      <YStack h={420}>
        <ScrollView>
          <Grid itemMinWidth={size}>{iconsMemo}</Grid>
        </ScrollView>
      </YStack>
    </YStack>
  )
}
