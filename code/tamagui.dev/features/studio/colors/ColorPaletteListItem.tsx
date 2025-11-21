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
  letterSpacing: -1,
  size: '$1',
  flex: 1,
  text: 'center',
  width: 20,
  overflow: 'hidden',
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
        items="flex-start"
        hoverTheme={hoverTheme ?? !isActive}
        borderColor={isActive ? '$borderColor' : 'transparent'}
        bg={isActive ? '$background' : 'transparent'}
      >
        <YStack p="$3" width="100%" mt={-1}>
          {!hideTitle && (
            <H5 size="$2" select="none" cursor="default" z={10} mb="$1">
              Palette: {scale?.name}
            </H5>
          )}

          <YStack width="100%" position="relative" gap="$2" z={100}>
            {showOffsetIndicators && (
              <XStack>
                {colors.map((_, index) => (
                  <OffsetIndicator key={index}>
                    {`-${Math.abs(index - colors.length + 1)}`}
                  </OffsetIndicator>
                ))}
              </XStack>
            )}
            <XStack opacity={0} width="100%" height={24}>
              {colors.map((color, index) => {
                // const color = getColor(palette.curves, scale, index)
                return (
                  <YStack
                    flex={1}
                    key={index}
                    items="center"
                    animation="bouncy"
                    animateOnly={['transform']}
                    overflow="hidden"
                    scale={1}
                    borderWidth={1}
                    borderColor={colorToHex(color) as any}
                    {...(indicateActive === index && {
                      scale: 1.2,
                      z: 100,
                      elevation: '$2',
                      borderColor: '$color',
                    })}
                    {...(index === 0 && {
                      borderBottomLeftRadius: '$8',
                      borderTopLeftRadius: '$8',
                    })}
                    {...(index === colors.length - 1 && {
                      borderTopRightRadius: '$8',
                      borderBottomRightRadius: '$8',
                    })}
                  >
                    <YStack bg={colorToHex(color) as any} fullscreen />
                  </YStack>
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
                position="absolute"
                animation="quick"
                animateOnly={['transform']}
                z={0}
                width={23}
                t={12}
                y={indicateActive < 0 ? 0 : 50}
                x={
                  (1 / numColors) *
                    265 *
                    (indicateActive < 0 ? numColors + indicateActive : indicateActive) +
                  12
                }
              >
                <YStack height="100%" items="center" justify="flex-end" pb="$2">
                  <YStack
                    x={-14}
                    y={indicateActive < 0 ? -12 : 12}
                    width={14}
                    height={4}
                    borderColor="red"
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
