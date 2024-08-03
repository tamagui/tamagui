import React from 'react'
import * as LucideIcons from '@tamagui/lucide-icons'

import { ScrollView } from 'react-native'
import { Input, Paragraph, Spacer, YStack, useDebounceValue } from 'tamagui'

import { Grid } from './Grid'

const lucideIcons = Object.keys(
  // vite tree shaking workaround
  typeof LucideIcons !== 'undefined' ? LucideIcons : {}
).map((name) => ({
  key: name.toLowerCase(),
  name,
  Icon: LucideIcons[name],
}))

export function LucideIconsDemo() {
  const [searchRaw, setSearch] = React.useState('')
  const search = useDebounceValue(searchRaw, 400)

  const size = 100

  const iconsMemo = React.useMemo(
    () =>
      lucideIcons
        .filter((x) => x.key.includes(search.toLowerCase()))
        .map(({ Icon, name }) => (
          <YStack
            height={size + 20}
            alignItems="center"
            justifyContent="center"
            key={name}
          >
            <Icon size={size * 0.25} />
            <Spacer />
            <Paragraph
              height="$6"
              wordWrap="break-word"
              maxWidth="100%"
              textAlign="center"
              paddingHorizontal="$2"
              size="$1"
              opacity={0.5}
            >
              {name}
            </Paragraph>
          </YStack>
        )),
    [search]
  )

  return (
    <YStack minWidth="100%" padding="$4" paddingBottom="$0" space>
      <Input value={searchRaw} onChangeText={setSearch} placeholder="Search..." />

      <YStack height={420}>
        <ScrollView>
          <Grid itemMinWidth={size}>{iconsMemo}</Grid>
        </ScrollView>
      </YStack>
    </YStack>
  )
}
