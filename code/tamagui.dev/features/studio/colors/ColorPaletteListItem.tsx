import {
  H5,
  ListItem,
  Popover,
  SizableText,
  Theme,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import type { Palette, Scale } from '../state/types'
import { ColorPicker } from './ColorPicker'
import { colorToHex } from './helpers'

const OffsetIndicator = styled(SizableText, {
  ls: -1,
  size: '$1',
  f: 1,
  ta: 'center',
  w: 20,
  ov: 'hidden',
})

export const ColorPaletteListItem = ({
  isActive,
  scale,
  palette,
  indicateActive,
  showOffsetIndicators,
  hoverTheme,
  hideTitle,
}: {
  isActive?: boolean
  scale?: Scale
  palette: Palette
  indicateActive?: number
  showOffsetIndicators?: boolean
  hoverTheme?: boolean
  hideTitle?: boolean
}) => {
  if (!scale) return null
  const colors = scale.colors
  const numColors = colors.length

  return (
    <Theme name={isActive ? 'alt1' : null}>
      <ListItem
        size="$2"
        p={0}
        flexDirection="column"
        ai="flex-start"
        hoverTheme={hoverTheme ?? !isActive}
        bc={isActive ? '$borderColor' : 'transparent'}
        bg={isActive ? '$background' : 'transparent'}
      >
        <YStack p="$3" w="100%" mt={-1}>
          {!hideTitle && (
            <H5 size="$2" userSelect="none" cursor="default" zi={10} mb="$1">
              Palette: {scale?.name}
            </H5>
          )}

          <YStack w="100%" pos="relative" space="$2" zi={100}>
            {showOffsetIndicators && (
              <XStack>
                {colors.map((_, index) => (
                  <OffsetIndicator key={index}>
                    {`-${Math.abs(index - colors.length + 1)}`}
                  </OffsetIndicator>
                ))}
              </XStack>
            )}
            <XStack w="100%" h={24}>
              {colors.map((color, index) => {
                // const color = getColor(palette.curves, scale, index)
                return (
                  <Popover key={`${color}${index}`}>
                    <Popover.Trigger asChild="except-style">
                      <YStack
                        f={1}
                        ai="center"
                        animation="bouncy"
                        animateOnly={['transform']}
                        ov="hidden"
                        scale={1}
                        bw={1}
                        bc={colorToHex(color) as any}
                        {...(indicateActive === index && {
                          scale: 1.2,
                          zi: 100,
                          elevation: '$2',
                          bc: '$color',
                        })}
                        {...(index === 0 && {
                          bblr: '$8',
                          btlr: '$8',
                        })}
                        {...(index === colors.length - 1 && {
                          btrr: '$8',
                          bbrr: '$8',
                        })}
                      >
                        <YStack backgroundColor={colorToHex(color) as any} fullscreen />
                      </YStack>
                    </Popover.Trigger>

                    <Popover.Content>
                      <XStack space="$2" ai="center">
                        <ColorPicker
                          value=""
                          onChange={(color) => {
                            // state.colors.setBackgroundColor(color)
                          }}
                        />
                      </XStack>
                    </Popover.Content>
                  </Popover>
                )
              })}
            </XStack>
            {showOffsetIndicators && (
              <XStack>
                {colors.map((_, index) => (
                  <OffsetIndicator key={index}>{index}</OffsetIndicator>
                ))}
              </XStack>
            )}
            {typeof indicateActive === 'number' && (
              <YStack
                pos="absolute"
                animation="quick"
                animateOnly={['transform']}
                zi={0}
                w={23}
                t={12}
                y={indicateActive < 0 ? 0 : 50}
                x={
                  (1 / numColors) *
                    265 *
                    (indicateActive < 0 ? numColors + indicateActive : indicateActive) +
                  12
                }
              >
                <YStack h="100%" ai="center" jc="flex-end" pb="$2">
                  <YStack
                    x={-14}
                    y={indicateActive < 0 ? -12 : 12}
                    w={14}
                    h={4}
                    bc="red"
                  />
                </YStack>
              </YStack>
            )}
          </YStack>
        </YStack>
      </ListItem>
    </Theme>
  )
}
