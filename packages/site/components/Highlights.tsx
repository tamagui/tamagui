import { Check, ExternalLink } from '@tamagui/feather-icons'
import { useRouter } from 'next/router'
import React from 'react'
// import { Select } from '@components/Select'
import { H2, Paragraph, Separator, Text, VisuallyHidden, XStack, YStack } from 'tamagui'

import { Link } from './Link'
import { FrontmatterContext } from './MDXComponents'

// TODO
const Select = (props) => <select {...props} />

export function Highlights({ features }) {
  const router = useRouter()
  const frontmatter = React.useContext(FrontmatterContext)
  const publishedName = frontmatter.publishedName || frontmatter.name || ''

  return (
    <YStack
      mt="$2"
      $gtSm={{
        fd: 'row',
        mt: '$2',
      }}
    >
      <YStack
        mb="$5"
        $gtSm={{
          flex: 1,
          mr: '$5',
        }}
      >
        <H2 fontFamily="$body" size="$6" mb="$4">
          Features
        </H2>

        <YStack tag="ul" p={0} m={0} space>
          {features.map((feature, i) => (
            <XStack tag="li" key={i}>
              <Text color="$green9">
                <YStack w={25} h={25} ai="center" jc="center" bc="$green3" br={100} mr="$3">
                  <Check size={12} color="var(--color)" />
                </YStack>
              </Text>
              <Paragraph color="$gray11">{feature}</Paragraph>
            </XStack>
          ))}
        </YStack>
      </YStack>

      <YStack space="$2" tag="nav" aria-labelledby="site-component-info-header">
        <VisuallyHidden>
          <h2 id="site-component-info-heading">Component Reference Links</h2>
        </VisuallyHidden>

        <YStack py="$1" ai="center">
          <Select
            value={frontmatter.version}
            onChange={(e) => router.push(`./${frontmatter.name}/${e.target.value}`)}
          >
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

        {/* {frontmatter.gzip && (
          <Paragraph size="$2" color="$color3">
            Size:{' '}
            <Link
              variant="subtle"
              href={`https://bundlephobia.com/package/@tamagui/react-${frontmatter.name}@${frontmatter.version}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {frontmatter.gzip}
            </Link>
          </Paragraph>
        )} */}

        <Separator />

        <YStack py="$2" space="$1">
          <YStack>
            <Link
              // /${publishedName}/src
              href={`https://github.com/tamagui/tamagui/tree/master/packages/tamagui/src/views`}
              target="_blank"
            >
              <XStack ai="center" space="$1">
                <Paragraph size="$2" color="inherit">
                  View source
                </Paragraph>
                <YStack opacity={0.5} ml="$1">
                  <ExternalLink size={12} color="var(--color2)" />
                </YStack>
              </XStack>
            </Link>
          </YStack>
          <YStack>
            <Link
              // @tamagui/react-${publishedName}
              href={`https://www.npmjs.com/package/tamagui`}
              target="_blank"
            >
              <XStack ai="center" space="$1">
                <Paragraph size="$2" color="inherit">
                  View on npm
                </Paragraph>
                <YStack opacity={0.5} ml="$1">
                  <ExternalLink size={12} color="var(--color2)" />
                </YStack>
              </XStack>
            </Link>
          </YStack>
          <YStack>
            <Link href="https://github.com/tamagui/tamagui/issues/new/choose" target="_blank">
              <XStack ai="center" space="$1">
                <Paragraph size="$2" color="inherit">
                  Report an issue
                </Paragraph>
                <YStack opacity={0.5} ml="$1">
                  <ExternalLink size={12} color="var(--color2)" />
                </YStack>
              </XStack>
            </Link>
          </YStack>

          {frontmatter.aria && (
            <YStack mb="$2">
              <Link variant="blue" href={frontmatter.aria} target="_blank">
                <XStack position="relative">
                  <Paragraph size="$2" color="$color2">
                    ARIA design pattern
                  </Paragraph>
                  <YStack ml="$1">
                    <Text color="$color3">
                      <ExternalLink size={12} color="var(--color)" />
                    </Text>
                  </YStack>
                </XStack>
              </Link>
            </YStack>
          )}
        </YStack>
      </YStack>
    </YStack>
  )
}
