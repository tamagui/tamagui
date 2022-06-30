import { H3, Paragraph, XStack, YStack, useComposedRefs } from 'tamagui'

import { FancyCard, OuterSubtleBorder } from './FancyCard'
import { useHoverGlow } from './HoverGlow'
import { NotoIcon } from './NotoIcon'

export const TamaCard = ({
  title,
  icon,
  subtitlePre,
  subtitlePost,
  description,
  footer,
  children,
}: any) => {
  const shadow = useHoverGlow({
    resist: 80,
    borderRadius: 0,
    strategy: 'blur',
    blurPct: 10,
    initialOffset: {
      y: 20,
    },
    full: true,
    scale: 1,
    color: 'var(--shadowColor)',
    background: 'transparent',
    opacity: 0.5,
    inverse: true,
  })
  const glow = useHoverGlow({
    resist: 70,
    size: 800,
    color: 'var(--color)',
    opacity: 0.075,
  })
  const containerRef = useComposedRefs(glow.parentRef, shadow.parentRef)
  return (
    <YStack
      className="transition all ease-in ms100"
      pos="relative"
      width="calc(33.33%)"
      $md={{
        width: 'calc(50%)',
      }}
      $sm={{ width: 'auto', minWidth: '100%' }}
      p="$4"
      hoverStyle={{
        zIndex: 1000,
      }}
    >
      {/* shadow */}
      {/* {shadow.element} */}
      <FancyCard ov="hidden" y={0}>
        <YStack ref={containerRef}>
          {/* glow */}
          {glow.element}
          <XStack p="$2" space>
            <YStack f={1} space="$2" ai="center">
              <H3
                als="flex-start"
                fontFamily="$silkscreen"
                size="$7"
                fow="200"
                color="$color"
                cursor="default"
                letterSpacing={1}
              >
                {title}
              </H3>

              {!!(subtitlePre || subtitlePost) && (
                <XStack>
                  {!!subtitlePre && (
                    <Paragraph cursor="default" tag="time" size="$7" theme="alt3">
                      {subtitlePre}
                    </Paragraph>
                  )}
                  {!!subtitlePost && (
                    <Paragraph cursor="default" fow="800" theme="alt3" size="$7">
                      {subtitlePost}
                    </Paragraph>
                  )}
                </XStack>
              )}

              <Paragraph cursor="default" theme="alt3" size="$7">
                {children || description}
              </Paragraph>

              {footer}
            </YStack>

            {!!icon && <NotoIcon size="$7">{icon}</NotoIcon>}
          </XStack>
        </YStack>
      </FancyCard>
    </YStack>
  )
}
