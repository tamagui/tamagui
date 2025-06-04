import { MoreVertical } from '@tamagui/lucide-icons'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { YStackProps } from 'tamagui'
import {
  Adapt,
  Button,
  ListItem,
  Paragraph,
  Popover,
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
      w="100%"
      mah={600}
      f={1}
      // scale={0.95}
      // transformOrigin="left top"
      group="card"
      containerType="normal"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
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
        <Theme
          name={accent ? accentThemeName : undefined}
          // TODO shouldn't need this
          key={`${accent}`}
          inverse={inverse}
        >
          {children}
        </Theme>
      </PanelContext.Provider>

      {!disableSettings && (
        // <Theme reset>
        <YStack
          pos="absolute"
          opacity={hovered ? 1 : 0}
          animation="100ms"
          right={'$-2'}
          top={'$-2'}
          zIndex={100}
        >
          <Popover size="$5" allowFlip placement="bottom">
            <Popover.Trigger asChild>
              <Button
                onPress={(event) => {
                  event.stopPropagation()
                }}
                themeInverse
                elevation="$2"
                size="$2"
                circular
                icon={<MoreVertical size="$1" />}
              />
            </Popover.Trigger>

            <Adapt when="maxMd" platform="touch">
              <Popover.Sheet modal dismissOnSnapToBottom>
                <Popover.Sheet.Frame padding="$4">
                  <Adapt.Contents />
                </Popover.Sheet.Frame>
                <Popover.Sheet.Overlay
                  animation="quickest"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Popover.Sheet>
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
              animation={[
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
                {/* {!!fileToCopyName && (
                  <ListItem
                    hoverTheme
                    gap="$3"
                    onPress={() => {
                      copyTheme()
                    }}
                  >
                    <Paragraph size="$3" mr="$2" ta="left" userSelect="none">
                      Copy Code
                    </Paragraph>

                    <YStack mx="$2">
                      <Copy size={16} />
                    </YStack>
                  </ListItem>
                )} */}

                <ListItem
                  bg="transparent"
                  gap="$3"
                  onPress={() => setInverse((val) => !val)}
                >
                  <Paragraph size="$3" mr="$2" ta="left" userSelect="none">
                    Inverse
                  </Paragraph>

                  <Switch
                    size="$1"
                    checked={inverse}
                    onPress={(e) => e.stopPropagation()}
                    onCheckedChange={(val) => {
                      setInverse(val)
                    }}
                  >
                    <Switch.Thumb
                      animation={[
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

                {hasAccent && (
                  <ListItem
                    bg="transparent"
                    gap="$3"
                    onPress={() => setAccent((val) => !val)}
                  >
                    <Paragraph size="$3" mr="$2" ta="left" userSelect="none">
                      Accent
                    </Paragraph>

                    <Switch
                      size="$1"
                      checked={accent}
                      onPress={(e) => e.stopPropagation()}
                      onCheckedChange={(val) => {
                        setAccent(val)
                      }}
                    >
                      <Switch.Thumb
                        animation={[
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
        // </Theme>
      )}
    </YStack>
  )
}
