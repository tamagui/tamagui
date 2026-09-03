import React from 'react'

import { ScrollView } from 'react-native'
import { Input, Paragraph, Spacer, YStack, useDebounceValue } from 'tamagui'

import { Grid } from './Grid'

type IconEntry = { key: string; name: string; Icon: any }

export function LucideIconsDemo() {
  const [searchRaw, setSearch] = React.useState('')
  const search = useDebounceValue(searchRaw, 400)

  // the whole icon set is ~1mb, so it loads on demand. it has to come from the
  // /all entry rather than the index: reading every key off the index namespace
  // would make bundlers retain all 1700 icons for anyone importing even one.
  const [lucideIcons, setLucideIcons] = React.useState<IconEntry[]>([])
  React.useEffect(() => {
    import('@tamagui/lucide-icons-2/all').then(({ allIcons }) => {
      setLucideIcons(
        Object.keys(allIcons).map((name) => ({
          key: name.toLowerCase(),
          name,
          Icon: allIcons[name],
        }))
      )
    })
  }, [])

  const size = 100

  const iconsMemo = React.useMemo(
    () =>
      lucideIcons
        .filter((x) => x.key.includes(search.toLowerCase()))
        .map(({ Icon, name }) => (
          <YStack height={size + 20} items="center" justify="center" key={name}>
            <Icon size={size * 0.25} />
            <Spacer />
            <Paragraph
              height="6"
              wordWrap="break-word"
              maxW="100%"
              text="center"
              px="2"
              opacity={0.5}
              size="1"
            >
              {name}
            </Paragraph>
          </YStack>
        )),
    [search, lucideIcons]
  )

  return (
    <YStack minW="100%" paddingTop="4" paddingRight="4" paddingLeft="4" pb="0" gap="4">
      <Input value={searchRaw} onChangeText={setSearch as any} placeholder="Search..." />

      <YStack height={420}>
        <ScrollView>
          <Grid itemMinWidth={size}>{iconsMemo}</Grid>
        </ScrollView>
      </YStack>
    </YStack>
  )
}
