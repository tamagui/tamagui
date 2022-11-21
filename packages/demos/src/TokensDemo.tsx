import { Tokens, getConfig } from '@tamagui/core'
import { useState } from 'react'
import { Button, H2, H3, H4, ScrollView, Separator, Square, XGroup, XStack, YStack } from 'tamagui'

type Section = 'spaceNegative' | keyof Tokens

const sections: { name: string; key: Section }[] = [
  {
    name: `Size`,
    key: `size`,
  },
  {
    name: `Space`,
    key: 'space',
  },
  {
    name: `Space (-)`,
    key: `spaceNegative`,
  },
  {
    name: `Radius`,
    key: `radius`,
  },
]

export function TokensDemo() {
  const [section, setSection] = useState<Section>('size')

  return (
    <YStack space>
      <XGroup ai="center" als="center">
        {sections.map(({ name, key }) => {
          return (
            <Button
              key={key}
              size="$3"
              theme={section === key ? 'active' : null}
              fontFamily="$silkscreen"
              onPress={() => setSection(key)}
            >
              {name}
            </Button>
          )
        })}
      </XGroup>

      {(section === 'size' ||
        section === 'spaceNegative' ||
        section === 'space' ||
        section === 'radius') && <SizeSection section={section} />}
    </YStack>
  )
}

function SizeSection({ section }: { section: Section }) {
  const allTokens = getConfig().tokens
  const tokens = allTokens[section.startsWith('space') ? 'space' : section]
  const st = Object.keys(tokens).sort((a, b) => (parseFloat(a) > parseFloat(b) ? 1 : -1))
  const spaceTokens = st.filter((t) => parseFloat(t) >= 0 && t !== '-0')
  const spaceTokensNegative = st
    .filter((t) => parseFloat(t) < 0 || t === '-0')
    .sort((a, b) => (parseFloat(a) > parseFloat(b) ? -1 : 1))

  return (
    <YStack f={1} space>
      <H2>Sizes</H2>
      <YStack w="100%" space="$2" separator={<Separator />}>
        {(section === 'spaceNegative' ? spaceTokensNegative : spaceTokens).map((token) => {
          return (
            <XStack w="100%" ai="center" key={token}>
              <YStack w="25%">
                <H3 size="$6">${token}</H3>
              </YStack>
              <YStack w="20%">
                <H4 size="$5">{tokens[token]?.val}px</H4>
              </YStack>
              <Square
                size={tokens[token]?.val}
                bc="$color3"
                {...(section === 'spaceNegative' && {
                  bc: '$red3',
                  size: -tokens[
                    spaceTokensNegative.find((t) => parseFloat(t) === -parseFloat(token)) ?? token
                  ]?.val,
                })}
                {...(section === 'radius' && {
                  // @ts-ignore
                  size: allTokens.size[token]?.val,
                  br: tokens[token]?.val,
                })}
              />
            </XStack>
          )
        })}
      </YStack>
    </YStack>
  )
}
