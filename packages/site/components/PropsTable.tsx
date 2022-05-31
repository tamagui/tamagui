// import { AccessibleIcon } from '@tamagui/feather-icons'
import { Minus } from '@tamagui/feather-icons'
import React from 'react'
import {
  H4,
  ListItem,
  Paragraph,
  Separator,
  Text,
  Theme,
  ThemeInverse,
  ThemeReset,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import { Code } from './Code'

type PropDef = {
  name: string
  required?: boolean
  default?: string | boolean
  type: string
  description?: string
}

export function PropsTable({
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  data: PropDef[]
  'aria-label'?: string
  'aria-labelledby'?: string
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy)
  return (
    <ThemeReset>
      <ThemeInverse>
        <YStack
          backgroundColor="$backgroundStrong"
          width="100%"
          aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
          aria-labelledby={ariaLabelledBy}
          mt="$2"
          br="$4"
        >
          {data.map(({ name, type, required, default: defaultValue, description }, i) => (
            <ListItem key={`${name}-${i}`} pb="$4">
              <YStack width="100%">
                <XStack>
                  <XStack miw="35%" ai="center" space>
                    <H4
                      color="$color"
                      fow="800"
                      fontFamily="Inter"
                      textTransform="none"
                      size="$5"
                      width={200}
                    >
                      {name}
                      {required ? (
                        <Paragraph fontSize="inherit" o={0.5}>
                          {' '}
                          <Paragraph fontWeight="800" theme="yellow">
                            (required)
                          </Paragraph>
                        </Paragraph>
                      ) : null}
                    </H4>
                  </XStack>

                  <Separator als="stretch" vertical mx="$4" my="$2" />

                  <XStack bc="red" f={1} miw="30%" ai="center">
                    <Code bc="$backgroundPress">{type}</Code>

                    <Separator als="stretch" vertical mx="$4" my="$2" />

                    <Paragraph o={0.5} size="$2">
                      Default:&nbsp;
                    </Paragraph>
                    {Boolean(defaultValue) ? (
                      <Code bc="$backgroundPress">{defaultValue}</Code>
                    ) : (
                      <YStack>
                        <Minus size={12} opacity={0.5} color="var(--color)" />
                      </YStack>
                    )}
                  </XStack>
                </XStack>

                <Separator my={2} />

                {description && (
                  <YStack p="$2">
                    <Paragraph size="$4" theme="alt1">
                      {description}
                    </Paragraph>
                  </YStack>
                )}
              </YStack>
              <Separator my={2} />
            </ListItem>
          ))}
        </YStack>
      </ThemeInverse>
    </ThemeReset>
  )
}

const TD = styled(XStack, {
  // @ts-ignore
  display: 'table-cell',
  tag: 'td',
  paddingTop: 10,
})
