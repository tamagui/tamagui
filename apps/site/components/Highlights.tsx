import { ChevronDown, ChevronUp, ExternalLink } from '@tamagui/feather-icons'
import { useRouter } from 'next/router'
import React from 'react'
import {
  H2,
  LinearGradient,
  Paragraph,
  Select,
  Separator,
  SizableText,
  Text,
  VisuallyHidden,
  XStack,
  YStack,
} from 'tamagui'

import { Features } from './Features'
import { FrontmatterContext } from './FrontmatterContext'
import { Link } from './Link'

export function Highlights({ features, disableLinks }: any) {
  const router = useRouter()
  const frontmatter = React.useContext(FrontmatterContext)

  return (
    <YStack
      my="$2"
      f={1}
      $gtSm={{
        fd: 'row',
      }}
    >
      <YStack
        f={1}
        mih={142}
        $gtSm={{
          flex: 1,
          mr: '$5',
        }}
      >
        <H2 fontFamily="$body" size="$6" mb="$2" fow="800">
          Features
        </H2>

        <YStack tag="ul" p={0} m={0} space>
          <Features space="$2" items={features} />
        </YStack>
      </YStack>

      {!disableLinks && (
        <YStack space="$3" tag="nav" aria-labelledby="site-component-info-header">
          <VisuallyHidden>
            <h2 id="site-component-info-heading">Component Reference Links</h2>
          </VisuallyHidden>

          <YStack ai="center">
            <Select
              size="$2"
              value={frontmatter.version}
              onValueChange={(value) => {
                if (value) {
                  router.push(`./${frontmatter.name}/${value}`)
                }
              }}
            >
              <Select.Trigger w={200} iconAfter={ChevronDown}>
                <Select.Value placeholder="Something" />
              </Select.Trigger>

              <Select.Content>
                <Select.ScrollUpButton ai="center" jc="center" pos="relative" w="100%" h="$3">
                  <YStack zi={10}>
                    <ChevronUp size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['$background', '$backgroundTransparent']}
                  />
                </Select.ScrollUpButton>

                <Select.Viewport minWidth={180}>
                  <Select.Group>
                    <Select.Label>Versions</Select.Label>
                    {(frontmatter.versions || []).map((version, i) => {
                      return (
                        <Select.Item index={i + 1} key={version} value={version}>
                          <Select.ItemText>{version}</Select.ItemText>
                        </Select.Item>
                      )
                    })}
                  </Select.Group>
                </Select.Viewport>

                <Select.ScrollDownButton ai="center" jc="center" pos="relative" w="100%" h="$3">
                  <YStack zi={10}>
                    <ChevronDown size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['$backgroundTransparent', '$background']}
                  />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>
          </YStack>

          <Separator />

          <YStack mb="$4" space="$1">
            <Link
              href={`https://github.com/tamagui/tamagui/tree/master/packages/tamagui/src/views/${frontmatter.component}.tsx`}
              target="_blank"
            >
              <XStack ai="center" space="$1">
                <SizableText size="$2">View source</SizableText>
                <YStack opacity={0.5} ml="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>
            <Link href={`https://www.npmjs.com/package/tamagui`} target="_blank">
              <XStack ai="center" space="$1">
                <SizableText size="$2">View on npm</SizableText>
                <YStack opacity={0.5} ml="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>
            <Link href="https://github.com/tamagui/tamagui/issues/new/choose" target="_blank">
              <XStack ai="center" space="$1">
                <SizableText size="$2">Report an issue</SizableText>
                <YStack opacity={0.5} ml="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>

            {/* @ts-ignore */}
            {frontmatter.aria && (
              <YStack mb="$2">
                {/* @ts-ignore */}
                <Link theme="blue" href={frontmatter.aria} target="_blank">
                  <XStack position="relative">
                    <Paragraph size="$2" theme="alt1">
                      ARIA design pattern
                    </Paragraph>
                    <YStack ml="$1">
                      <Text theme="alt2">
                        <ExternalLink size={12} color="var(--color)" />
                      </Text>
                    </YStack>
                  </XStack>
                </Link>
              </YStack>
            )}
          </YStack>
        </YStack>
      )}
    </YStack>
  )
}
