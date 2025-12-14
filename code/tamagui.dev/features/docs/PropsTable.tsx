import {
  H3,
  H4,
  ListItem,
  Paragraph,
  Separator,
  View,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import { Code } from '~/components/Code'

export type PropDef = {
  name: string
  required?: boolean
  deprecated?: boolean
  default?: string | boolean
  type: string
  description?: string
}

export function PropsTable({
  title = 'Props',
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  title?: string
  data: PropDef[]
  'aria-label'?: string
  'aria-labelledby'?: string
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy)
  return (
    <YStack
      borderWidth={1}
      borderColor="$borderColor"
      flex={1}
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
      my="$4"
      rounded="$4"
      overflow="hidden"
      mx="$-4"
      $sm={{
        mx: 0,
      }}
    >
      <XStack items="center" py="$2" px="$4" bg="$borderColor">
        <H3 size="$3">{title}</H3>
      </XStack>
      {data.map(
        ({ name, type, required, deprecated, default: defaultValue, description }, i) => (
          <ListItem
            key={`${name}-${i}`}
            p={0}
            borderBottomWidth={1}
            borderBottomColor="$color4"
            py="$3"
          >
            <YStack width="100%">
              <XStack
                position="relative"
                py="$1"
                bg="$background"
                px="$4"
                $sm={{ flexDirection: 'column' }}
              >
                <YStack fullscreen bg="$background" z={1} opacity={0.5} />
                <XStack minW="30%" items="center" justify="space-between">
                  <H4
                    color="$color"
                    fontWeight="700"
                    fontFamily="$mono"
                    textTransform="none"
                    textDecorationLine={deprecated ? 'line-through' : 'none'}
                    size="$5"
                    width={280}
                  >
                    {name}
                    {required ? (
                      <Paragraph
                        render="span"
                        // @ts-ignore
                        fontSize="inherit"
                        opacity={0.5}
                      >
                        {' '}
                        <Paragraph render="span" fontWeight="300">
                          (required)
                        </Paragraph>
                      </Paragraph>
                    ) : null}
                  </H4>
                </XStack>

                {!!type && (
                  <>
                    <Separator self="stretch" vertical mx="$3.5" my="$2" />

                    <XStack
                      flex={2}
                      minW="30%"
                      items="center"
                      $xs={{
                        flexDirection: 'column',
                        items: 'flex-start',
                      }}
                    >
                      <Paragraph
                        size="$3"
                        opacity={0.8}
                        fontFamily="$mono"
                        overflow="hidden"
                        ellipsis
                        mr="auto"
                      >
                        {type}
                      </Paragraph>

                      <XStack items="center">
                        {defaultValue ? (
                          <XStack items="center" gap="$1">
                            <Paragraph opacity={0.5} size="$2">
                              Default:&nbsp;
                            </Paragraph>
                            {/* @ts-ignore */}
                            <Code my="$-1" bg="$backgroundPress">
                              {defaultValue}
                            </Code>
                          </XStack>
                        ) : null}

                        {Boolean(defaultValue) && (
                          <Separator self="stretch" vertical mx="$3.5" my="$2" />
                        )}

                        {deprecated ? (
                          <View
                            width="$8"
                            items="center"
                            theme="red"
                            bg="$red2"
                            borderWidth={1}
                            rounded="$2"
                          >
                            <Paragraph render="span" size="$2" fontWeight="300">
                              deprecated
                            </Paragraph>
                          </View>
                        ) : null}
                      </XStack>
                    </XStack>
                  </>
                )}
              </XStack>

              {!!description && (
                <YStack py="$1" px="$4">
                  <Paragraph size="$3" opacity={0.65}>
                    {description}
                  </Paragraph>
                </YStack>
              )}
            </YStack>
            <Separator my={2} />
          </ListItem>
        )
      )}
    </YStack>
  )
}
