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
        f={1}
        br="$6"
        bw={1}
        bc="$borderColor"
        contentContainerStyle={{ flex: 1 }}
        maxHeight={350}
        maxWidth={400}
        als="center"
      >
        <YStack gap="$3" height="100%" f={1} pt="$4" px="$4" jc="space-between">
          <YStack gap="$2">
            <H3>Preview</H3>
            <Paragraph color="$color11">
              This is just an example, your actual components can use any values from the
              palette.
            </Paragraph>
          </YStack>
          <XStack width={200} alignItems="center" gap="$4">
            <Label
              paddingRight="$0"
              minWidth={90}
              justifyContent="flex-end"
              htmlFor="switch"
            >
              Label
            </Label>
            <Separator minHeight={20} vertical />
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
            <XStack my="$-2" jc="center">
              <XStack width={300} alignItems="center" space="$4">
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
            <Separator bc="$color2" />
            <XStack gap="$4">
              <Button f={1}>Cancel</Button>

              <AccentTheme>
                <Button f={1} onPress={onPressButton}>
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
