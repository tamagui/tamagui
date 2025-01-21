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
      f={1}
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
      my="$4"
      br="$4"
      ov="hidden"
      mx="$-4"
      $sm={{
        mx: 0,
      }}
    >
      <XStack ai="center" py="$2" px="$4" backgroundColor="$borderColor">
        <H3 size="$3">{title}</H3>
      </XStack>
      {data.map(
        ({ name, type, required, deprecated, default: defaultValue, description }, i) => (
          <ListItem key={`${name}-${i}`} p={0} bbw={1} bbc="$color4" py="$3">
            <YStack width="100%">
              <XStack
                pos="relative"
                py="$2"
                bg="$background"
                px="$4"
                $sm={{ flexDirection: 'column' }}
              >
                <YStack fullscreen backgroundColor="$background" zi={-1} o={0.5} />
                <XStack miw="30%" ai="center" jc="space-between">
                  <H4
                    color="$color"
                    fow="700"
                    fontFamily="$mono"
                    textTransform="none"
                    textDecorationLine={deprecated ? 'line-through' : 'none'}
                    size="$6"
                    width={280}
                  >
                    {name}
                    {required ? (
                      <Paragraph
                        tag="span"
                        // @ts-ignore
                        fontSize="inherit"
                        o={0.5}
                      >
                        {' '}
                        <Paragraph tag="span" fontWeight="300">
                          (required)
                        </Paragraph>
                      </Paragraph>
                    ) : null}
                  </H4>
                </XStack>

                {!!type && (
                  <>
                    <Separator als="stretch" vertical mx="$3.5" my="$2" />

                    <XStack
                      f={2}
                      miw="30%"
                      ai="center"
                      separator={<Separator als="stretch" vertical mx="$3.5" my="$2" />}
                      $xs={{
                        flexDirection: 'column',
                        ai: 'flex-start',
                      }}
                    >
                      <Paragraph
                        size="$3"
                        o={0.8}
                        fontFamily="$mono"
                        overflow="hidden"
                        ellipse
                        mr="auto"
                      >
                        {type}
                      </Paragraph>

                      <XStack ai="center">
                        {defaultValue ? (
                          <XStack ai="center" gap="$1">
                            <Paragraph o={0.5} size="$2">
                              Default:&nbsp;
                            </Paragraph>
                            {/* @ts-ignore */}
                            <Code my="$-1" bg="$backgroundPress">
                              {defaultValue}
                            </Code>
                          </XStack>
                        ) : null}

                        {Boolean(defaultValue) && (
                          <Separator als="stretch" vertical mx="$3.5" my="$2" />
                        )}

                        {deprecated ? (
                          <View w="$8" ai="center" theme="red" bg="$red2" bw={1} br="$2">
                            <Paragraph tag="span" size="$2" fontWeight="300">
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
                  <Paragraph size="$5" o={0.65}>
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
