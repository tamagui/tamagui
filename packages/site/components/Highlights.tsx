import { ExternalLink } from '@tamagui/feather-icons'
import { useRouter } from 'next/router'
import React from 'react'
// import { Select } from '@components/Select'
import {
  H2,
  Paragraph,
  Separator,
  SizableText,
  Text,
  VisuallyHidden,
  XStack,
  YStack,
} from 'tamagui'

import { Features } from './Features'
import { Link } from './Link'
import { FrontmatterContext } from './MDXComponents'

// TODO
const Select = (props) => <select {...props} />

export function Highlights({ features, disableLinks }: any) {
  const router = useRouter()
  const frontmatter = React.useContext(FrontmatterContext)

  return (
    <YStack
      mt="$2"
      $gtSm={{
        fd: 'row',
        mt: '$2',
      }}
    >
      <YStack
        mb="$4"
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
        <YStack space="$4" tag="nav" aria-labelledby="site-component-info-header">
          <VisuallyHidden>
            <h2 id="site-component-info-heading">Component Reference Links</h2>
          </VisuallyHidden>

          <YStack ai="center">
            <Select
              // @ts-ignore
              value={frontmatter.version}
              // @ts-ignore
              onChange={(e) => router.push(`./${frontmatter.name}/${e.target.value}`)}
            >
              {/* @ts-ignore */}
              {(frontmatter.versions || []).map((v, i) => {
                return (
                  <option key={v} value={v}>
                    {v}
                    {i === 0 && ' (latest)'}
                  </option>
                )
              })}
            </Select>
          </YStack>

          <Separator />

          <YStack space="$3">
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
