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
    <YStack userSelect="none">
      {showIndices && (
        <XStack ov="hidden">
          {new Array(colors.length).fill(0).map((_, i) => (
            <Paragraph
              o={0.7}
              size="$1"
              fos={11}
              lh={18}
              ls={-1}
              f={1}
              fb={0}
              ta="center"
              key={i}
            >
              {i}
            </Paragraph>
          ))}
        </XStack>
      )}
      <XStack ov="hidden" br="$4" bw={1} bc="$color7">
        {colors.map((color, i) => (
          <XStack
            key={color + i}
            h={32}
            f={1}
            {...(i > 0 && {
              blw: 0.5,
              blc: '$background',
            })}
          >
            <Checkerboard opacity={0.5} />
            <XStack fullscreen bg={color as any} />
            {showLabelIndices && (
              <YStack fullscreen jc="center" ai="center" pe="none">
                <Paragraph size="$1" fos={11} ls={-1} color={readableColor(color) as any}>
                  {i}
                </Paragraph>
              </YStack>
            )}
          </XStack>
        ))}
      </XStack>
      {showNegativeIndices && (
        <XStack ov="hidden">
          {new Array(colors.length).fill(0).map((_, i) => (
            <Paragraph
              o={0.7}
              size="$1"
              fos={11}
              lh={18}
              ls={-1}
              f={1}
              fb={0}
              ta="center"
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
