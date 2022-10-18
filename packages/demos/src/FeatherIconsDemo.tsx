import * as FeatherIcons from '@tamagui/lucide-icons'
import React from 'react'
import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Grid, Input, Paragraph, Spacer, YStack, useDebounceValue } from 'tamagui'

const featherIcons = Object.keys(FeatherIcons).map((name) => ({
  key: name.toLowerCase(),
  name,
  Icon: FeatherIcons[name],
}))

export function FeatherIconsDemo() {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 400)

  const size = 100

  const iconsMemo = useMemo(() => {
    const icons = featherIcons.filter((x) => x.key.startsWith(search.toLowerCase()))
    return icons.map(({ Icon, name }) => {
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
