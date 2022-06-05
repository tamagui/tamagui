import { useRef } from 'react'
import { H3, Paragraph, XStack, YStack } from 'tamagui'

import { FancyCard, OuterSubtleBorder } from './FancyCard'
import { HoverGlow } from './HoverGlow'
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
  const containerRef = useRef(null)
  return (
    <YStack
      className="transition all ease-in ms100"
      width="calc(33.33%)"
      $md={{
        width: 'calc(50%)',
      }}
      $sm={{ width: 'auto', minWidth: '100%' }}
      p="$2"
      hoverStyle={{
        zIndex: 1000,
        y: -1,
      }}
    >
      <OuterSubtleBorder>
        {/* shadow */}
        <HoverGlow
          resist={80}
          borderRadius={0}
          strategy="blur"
          blurPct={10}
          initialOffset={{
            y: 20,
          }}
          full
          scale={1}
          color="var(--shadowColor)"
          background="transparent"
          opacity={0.5}
          inverse
          parentRef={containerRef}
        />
        <FancyCard ov="hidden" y={0}>
          <YStack ref={containerRef}>
            {/* glow */}
            <HoverGlow
              resist={30}
              full
              scale={2.25}
              color="var(--color)"
              background="transparent"
              opacity={0.095}
              parentRef={containerRef}
            />
            <XStack py="$2" space="$5">
              <YStack f={1} space="$4" ai="center">
                {!!icon && (
                  <NotoIcon size="$12" o={0.5}>
                    {icon}
                  </NotoIcon>
                )}

                <XStack mb="$3" space="$4" jc="center" ai="center">
                  <H3
                    fontFamily="$silkscreen"
                    size="$7"
                    color="$color"
                    cursor="default"
                    letterSpacing={1}
                  >
                    {title}
                  </H3>
                </XStack>

                {!!(subtitlePre || subtitlePost) && (
                  <XStack>
                    {!!subtitlePre && (
                      <Paragraph cursor="default" tag="time" size="$3" theme="alt3">
                        {subtitlePre}
                      </Paragraph>
                    )}
                    {!!subtitlePost && (
                      <Paragraph cursor="default" fow="800" theme="alt3" size="$3">
                        {subtitlePost}
                      </Paragraph>
                    )}
                  </XStack>
                )}

                <Paragraph fow="500" cursor="default" theme="alt3" size="$3">
                  {children || description}
                </Paragraph>

                {footer}
              </YStack>
            </XStack>
          </YStack>
        </FancyCard>
      </OuterSubtleBorder>
    </YStack>
  )
}
