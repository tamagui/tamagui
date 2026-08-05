import { H3, H4, ListItem, Paragraph, Separator, View, XStack, YStack } from 'tamagui'

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
      borderColor="border-color"
      flex={1}
      flexBasis="auto"
      my="4"
      rounded="4"
      overflow="hidden"
      mx="-4 sm:0px"
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
    >
      <XStack items="center" py="2" px="4" bg="color1">
        <H3 size="3">{title}</H3>
      </XStack>
      {data.map(
        ({ name, type, required, deprecated, default: defaultValue, description }, i) => (
          <ListItem
            key={`${name}-${i}`}
            p={0}
            borderBottomWidth={1}
            borderBottomColor="color4"
            py="3"
            pointerEvents="none"
            bg={`${i % 2 === 1 ? 'color0025' : 'transparent'}`}
          >
            <YStack width="100%">
              <XStack position="relative" py="1" px="4" flexDirection="sm:column">
                <XStack minW="30%" items="center" justify="space-between">
                  <H4
                    color="color"
                    fontWeight="700"
                    fontFamily="mono"
                    textTransform="none"
                    textDecorationLine={deprecated ? 'line-through' : 'none'}
                    width={280}
                    size="5"
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
                    <Separator self="stretch" mx="3.5" my="2" vertical />

                    <XStack
                      flex={2}
                      flexBasis="auto"
                      minW="30%"
                      items="center xs:flex-start"
                      flexDirection="xs:column"
                    >
                      <Paragraph
                        size="3"
                        opacity={0.8}
                        fontFamily="mono"
                        overflow="hidden"
                        mr="auto"
                        ellipsis
                      >
                        {type}
                      </Paragraph>

                      <XStack items="center">
                        {defaultValue ? (
                          <XStack items="center" gap="1">
                            <Paragraph opacity={0.5} size="2">
                              Default:&nbsp;
                            </Paragraph>
                            {/* @ts-ignore */}
                            <Code my="-1" bg="background-press">
                              {defaultValue}
                            </Code>
                          </XStack>
                        ) : null}

                        {Boolean(defaultValue) && (
                          <Separator self="stretch" mx="3.5" my="2" vertical />
                        )}

                        {deprecated ? (
                          <View
                            width="8"
                            items="center"
                            bg="red2"
                            borderWidth={1}
                            rounded="2"
                            theme="red"
                          >
                            <Paragraph render="span" size="2" fontWeight="300">
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
                <YStack py="1" px="4">
                  <Paragraph size="3" opacity={0.65}>
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
