import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { memo, useState } from 'react'
import {
  Button,
  Checkbox,
  H3,
  Label,
  Paragraph,
  ScrollView,
  Separator,
  Switch,
  XStack,
  YStack,
} from 'tamagui'

import { AccentTheme } from '~/features/studio/components/AccentTheme'
import { accentThemeName } from '../../../accentThemeName'

export const StudioThemesQuickPreviewSection = memo(
  ({
    scheme,
    hasAccent,
    onPressButton,
  }: {
    scheme: string
    hasAccent: boolean
    onPressButton?: any
  }) => {
    const [checked, setChecked] = useState(false)
    const [subtleBg, setSubtleBg] = useState(false)

    const checkId = `accept-check-${scheme}`
    return (
      <ScrollView
        bg={subtleBg ? '$color2' : '$color1'}
        flex={1}
        rounded="$6"
        borderWidth={1}
        borderColor="$borderColor"
        contentContainerStyle={{ flex: 1 }}
        maxH={350}
        maxW={400}
        self="center"
      >
        <YStack gap="$3" height="100%" flex={1} pt="$4" px="$4" justify="space-between">
          <YStack gap="$2">
            <H3>Preview</H3>
            <Paragraph color="$color11">
              This is just an example, your actual components can use any values from the
              palette.
            </Paragraph>
          </YStack>
          <XStack width={200} items="center" gap="$4">
            <Label pr="$0" minW={90} justify="flex-end" htmlFor="switch">
              Label
            </Label>
            <Separator minH={20} vertical />
            <>
              <Switch
                id="switch"
                theme={checked ? accentThemeName : null}
                size="$3"
                onCheckedChange={setChecked}
              >
                <Switch.Thumb
                  animateOnly={['transform']}
                  animation={[
                    'quickest',
                    {
                      backgroundColor: {
                        overshootClamping: true,
                      },
                    },
                  ]}
                />
              </Switch>
            </>
          </XStack>

          <YStack pb="$4" gap="$4">
            <XStack my="$-2" justify="center">
              <XStack width={300} items="center" gap="$4">
                <Checkbox
                  id={checkId}
                  onCheckedChange={(val) => {
                    setSubtleBg(!!val)
                  }}
                >
                  <Checkbox.Indicator>
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox>

                <Label htmlFor={checkId}>Use subtle background</Label>
              </XStack>
            </XStack>
            <Separator borderColor="$color2" />
            <XStack gap="$4">
              <Button flex={1}>Cancel</Button>

              <AccentTheme>
                <Button flex={1} onPress={onPressButton}>
                  Accept
                </Button>
              </AccentTheme>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    )
  }
)
