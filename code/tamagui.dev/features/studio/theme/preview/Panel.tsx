import { MoreVertical } from '@tamagui/lucide-icons'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { YStackProps } from 'tamagui'
import {
  Adapt,
  Button,
  ListItem,
  Paragraph,
  Popover,
  Sheet,
  Switch,
  Theme,
  YGroup,
  YStack,
} from 'tamagui'
import { accentThemeName } from '../../accentThemeName'
import { useHasAccent } from '../../hooks/useHasAccent'
import { useThemeBuilderStore } from '../store/ThemeBuilderStore'

interface IPanelContext {
  inverse: boolean
}

const PanelContext = createContext<IPanelContext | null>(null)
export const usePanelContext = () => {
  const context = useContext(PanelContext)
  if (!context) {
    throw new Error(`usePanelContext should be used inside PanelContext`)
  }
  return context
}

export function Panel({
  fileToCopyName,
  disableSettings,
  children,
  initialAccent,
  initialInverse,
  ...props
}: YStackProps & {
  disableSettings?: boolean
  initialInverse?: boolean
  initialAccent?: boolean
  fileToCopyName?: string
}) {
  const hasAccent = useHasAccent()
  const [inverse, setInverse] = useState(initialInverse || false)
  const [accent, setAccent] = useState(initialAccent)
  const [hovered, setHovered] = useState(false)
  const store = useThemeBuilderStore()

  useEffect(() => {
    if (store.randomizeId) {
      setAccent((x) => Math.random() > 0.75)
      setInverse((x) => Math.random() > 0.95)
    }
  }, [store.randomizeId])

  return (
    <YStack
      width="100%"
      maxH={600}
      flex={1}
      flexBasis="auto"
      group="card"
      containerType="normal"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <PanelContext.Provider
        value={useMemo(
          () => ({
            inverse,
          }),
          [inverse]
        )}
      >
        <Theme name={accent ? accentThemeName : null} key={`${accent}`}>
          {children}
        </Theme>
      </PanelContext.Provider>

      {!disableSettings && (
        <YStack
          position="absolute"
          opacity={hovered ? 1 : 0}
          transition="100ms"
          r="$-2"
          t="$-2"
          z={100}
        >
          <Popover size="$5" allowFlip placement="bottom">
            <Popover.Trigger asChild>
              <Button
                theme="accent"
                onPress={(event) => {
                  event.stopPropagation()
                }}
                size="$2"
                circular
                icon={<MoreVertical size="$1" />}
              />
            </Popover.Trigger>

            <Adapt when="maxMd" platform="touch">
              <Sheet modal dismissOnSnapToBottom>
                <Sheet.Frame p="$4">
                  <Adapt.Contents />
                </Sheet.Frame>
                <Sheet.Overlay
                  transition="quickest"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Sheet>
            </Adapt>

            <Popover.Content
              borderWidth={1}
              borderColor="$borderColor"
              enterStyle={{ y: -3, opacity: 0 }}
              exitStyle={{ y: -3, opacity: 0 }}
              y={0}
              opacity={1}
              elevate
              p={0}
              animateOnly={['transform', 'opacity']}
              transition={[
                'quicker',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
            >
              <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

              <YGroup>
                {hasAccent && (
                  <ListItem
                    bg="transparent"
                    gap="$3"
                    onPress={() => setAccent((val) => !val)}
                  >
                    <Paragraph size="$3" mr="$2" text="left" select="none">
                      Accent
                    </Paragraph>

                    <Switch
                      size="$1"
                      checked={!!accent}
                      onPress={(e) => e.stopPropagation()}
                      onCheckedChange={(val) => {
                        setAccent(val)
                      }}
                    >
                      <Switch.Thumb
                        transition={[
                          'quickest',
                          {
                            transform: {
                              overshootClamping: true,
                            },
                          },
                        ]}
                      />
                    </Switch>
                  </ListItem>
                )}
              </YGroup>
            </Popover.Content>
          </Popover>
        </YStack>
      )}
    </YStack>
  )
}
