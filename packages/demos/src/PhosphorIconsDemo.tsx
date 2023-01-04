import * as Phosphor from '@tamagui/phosphor-icons'
import { IconProps } from '@tamagui/phosphor-icons'
import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  Button,
  Grid,
  Input,
  Paragraph,
  Spacer,
  XGroup,
  YStack,
  useDebounceValue,
} from 'tamagui'

const phosphorIcons = Object.keys(Phosphor).map((name) => ({
  key: name.toLowerCase(),
  name,
  Icon: Phosphor[name],
}))

const sections: { name: string; key: IconProps['weight'] }[] = [
  {
    name: `Regular`,
    key: `regular`,
  },
  {
    name: `Thin`,
    key: `thin`,
  },
  {
    name: `Light`,
    key: `light`,
  },
  {
    name: `Bold`,
    key: `bold`,
  },
  {
    name: `Fill`,
    key: `fill`,
  },
  {
    name: `Duotone`,
    key: `duotone`,
  },
]

export function PhosphorIconsDemo() {
  const [searchRaw, setSearch] = useState('')
  const [weight, setWeight] = useState<IconProps['weight']>('regular')
  const search = useDebounceValue(searchRaw, 400)

  const size = 120

  const iconsMemo = useMemo(() => {
    const icons = phosphorIcons.filter((x) => x.key.startsWith(search.toLowerCase()))
    return icons.slice(0, 835).map(({ Icon, name }) => {
      return (
        <YStack h={size} ai="center" jc="center" key={name}>
          <Icon weight={weight} color="$color" size={size * 0.25} />
          <Spacer />
          <Paragraph size="$2" o={0.5}>
            {name}
          </Paragraph>
        </YStack>
      )
    })
  }, [search, weight])

  return (
    <YStack p="$4" als="stretch">
      <XGroup als="center" ai="center">
        {sections.map(({ name, key }) => {
          return (
            <Button
              key={key}
              size="$3"
              theme={weight === key ? 'active' : null}
              fontFamily="$silkscreen"
              onPress={() => setWeight(key)}
            >
              {name}
            </Button>
          )
        })}
      </XGroup>

      <YStack als="stretch" p="$4" pb="$0" space>
        <Input value={searchRaw} onChangeText={setSearch} placeholder="Search..." />

        <YStack h={420}>
          <ScrollView>
            <Grid itemMinWidth={size}>{iconsMemo}</Grid>
          </ScrollView>
        </YStack>
      </YStack>
    </YStack>
  )
}
