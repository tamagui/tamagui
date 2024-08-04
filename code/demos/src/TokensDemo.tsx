import React from 'react'
import type { Tokens } from '@tamagui/core'
import { getConfig } from '@tamagui/core'

import { Button, H2, H3, H4, Separator, Square, XGroup, XStack, YStack } from 'tamagui'

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
  const [section, setSection] = React.useState<Section>('size')

  return (
    <YStack space>
      <XGroup alignItems="center" alignSelf="center">
        {sections.map(({ name, key }) => {
          return (
            <XGroup.Item key={key}>
              <Button
                size="$3"
                theme={section === key ? 'active' : null}
                fontFamily="$silkscreen"
                onPress={() => setSection(key)}
              >
                {name}
              </Button>
            </XGroup.Item>
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
  const st = Object.keys(tokens).sort((a, b) =>
    Number.parseFloat(a) > Number.parseFloat(b) ? 1 : -1
  )
  const spaceTokens = st.filter((t) => Number.parseFloat(t) >= 0)
  const spaceTokensNegative = st
    .filter((t) => Number.parseFloat(t) < 0)
    .sort((a, b) => (Number.parseFloat(a) > Number.parseFloat(b) ? -1 : 1))

  return (
    <YStack flex={1} space>
      <H2>Sizes</H2>
      <YStack width="100%" space="$2" separator={<Separator />}>
        {(section === 'spaceNegative' ? spaceTokensNegative : spaceTokens).map(
          (token) => {
            return (
              <XStack width="100%" alignItems="center" key={token}>
                <YStack width="25%">
                  <H3 size="$6">${token}</H3>
                </YStack>
                <YStack width="20%">
                  <H4 size="$5">{tokens[token]?.val}px</H4>
                </YStack>
                <Square
                  size={tokens[token]?.val as any}
                  backgroundColor="$color5"
                  {...(section === 'spaceNegative' && {
                    backgroundColor: '$red5',
                    size:
                      -tokens[
                        spaceTokensNegative.find(
                          (t) => Number.parseFloat(t) === -Number.parseFloat(token)
                        ) ?? token
                      ]?.val,
                  })}
                  {...(section === 'radius' && {
                    size: allTokens.size[token]?.val as any,
                    borderRadius: tokens[token]?.val as any,
                  })}
                />
              </XStack>
            )
          }
        )}
      </YStack>
    </YStack>
  )
}
