import { readableColor } from 'color2k'
import { Paragraph, XStack, YStack } from 'tamagui'

import { Checkerboard } from './components/Checkerboard'

export function StudioPaletteBar({
  showIndices,
  showNegativeIndices,
  showLabelIndices,
  colors,
}: {
  showIndices?: boolean
  showNegativeIndices?: boolean
  showLabelIndices?: boolean
  colors: string[]
}) {
  return (
    <YStack mx="$2" select="none">
      {showIndices && (
        <XStack overflow="hidden">
          {new Array(colors.length).fill(0).map((_, i) => (
            <Paragraph
              opacity={0.7}
              size="$1"
              fontSize={11}
              lineHeight={18}
              letterSpacing={-1}
              flex={1}
              flexBasis={0}
              text="center"
              key={i}
            >
              {i}
            </Paragraph>
          ))}
        </XStack>
      )}
      <XStack overflow="hidden" rounded="$4" borderWidth={0.5} borderColor="$color3">
        {colors.map((color, i) => (
          <XStack
            key={color + i}
            height={18}
            flex={1}
            {...(i > 0 && {
              borderLeftWidth: 0.5,
              borderLeftColor: '$background',
            })}
          >
            <Checkerboard opacity={0.5} />
            <XStack fullscreen bg={color as any} />
            {showLabelIndices && (
              <YStack fullscreen justify="center" items="center" pointerEvents="none">
                <Paragraph
                  size="$1"
                  fontSize={11}
                  letterSpacing={-1}
                  color={readableColor(color) as any}
                >
                  {i}
                </Paragraph>
              </YStack>
            )}
          </XStack>
        ))}
      </XStack>
      {showNegativeIndices && (
        <XStack overflow="hidden">
          {new Array(colors.length).fill(0).map((_, i) => (
            <Paragraph
              opacity={0.7}
              size="$1"
              fontSize={11}
              lineHeight={18}
              letterSpacing={-1}
              flex={1}
              flexBasis={0}
              text="center"
              key={i}
            >
              -{colors.length - 1 - i}
            </Paragraph>
          ))}
        </XStack>
      )}
    </YStack>
  )
}
