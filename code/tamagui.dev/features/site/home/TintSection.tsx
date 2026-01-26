import { getTints, useTint } from '@tamagui/logo'
import { useEffect, useMemo, useRef } from 'react'
import type { LayoutRectangle } from 'react-native'
import type { GetProps } from 'tamagui'
import { XStack, YStack, styled } from 'tamagui'
import { useOnIntersecting } from '~/hooks/useOnIntersecting'

type Props = SectionProps & { themed?: boolean; index: number }

const numIntersectingAtSection = getTints().tints.map((_) => 0)

export const tintSectionDimensions: Record<number, LayoutRectangle> = {}

export const TintSection = ({ children, index, themed, z, ...props }: Props) => {
  const top = useRef<HTMLElement>(null)
  const bottom = useRef<HTMLElement>(null)
  const mid = useRef<HTMLElement>(null)
  const { tint, tints, setTintIndex } = useTint()

  useOnIntersecting(
    useMemo(() => [top, mid, bottom], []),
    (entries) => {
      const count = entries.reduce((a, b) => a + (b?.isIntersecting ? 1 : 0), 0)
      numIntersectingAtSection[index] = count

      if (count < 1) {
        return
      }

      let topIndex = -1
      let topStr = -1
      numIntersectingAtSection.forEach((str, index) => {
        if (str >= topStr) {
          topIndex = index
          topStr = str
        }
      })

      if (topIndex === index && topIndex !== current) {
        const tintIndex = topIndex <= 1 ? 3 : topIndex % tints.length
        setTintIndex(tintIndex)
        current = index
        listeners.forEach((cb) => cb(topIndex, count))
      }
    },
    {
      threshold: 0.2,
    }
  )

  return (
    <YStack
      onLayout={(e) => (tintSectionDimensions[index] = e.nativeEvent.layout)}
      z={z}
      position="relative"
    >
      {useMemo(() => {
        return (
          <>
            <XStack
              ref={top as any}
              position="absolute"
              t="10%"
              l={0}
              r={0}
              height={10}
              opacity={0}
              pointerEvents="none"
            />
            <XStack
              ref={mid as any}
              position="absolute"
              t="50%"
              l={0}
              r={0}
              height={10}
              opacity={0}
              pointerEvents="none"
            />
            <XStack
              ref={bottom as any}
              position="absolute"
              b="10%"
              l={0}
              r={0}
              height={10}
              opacity={0}
              pointerEvents="none"
            />
          </>
        )
      }, [top, mid, bottom])}
      <HomeSection theme={(themed ? tint : null) as any} {...props}>
        {children}
      </HomeSection>
    </YStack>
  )
}

let current = 0
const listeners = new Set<Function>()

export const useTintSectionIndex = (cb: (index: number, str: number) => void) => {
  useEffect(() => {
    listeners.add(cb)
    return () => {
      listeners.delete(cb)
    }
  }, [])
}

export const HomeSection = styled(YStack, {
  name: 'Section',
  position: 'relative',
  py: '$14',
  z: 2,

  variants: {
    below: {
      true: {
        z: 1,
      },
    },
  } as const,
})

type SectionProps = GetProps<typeof HomeSection>

export const SectionTinted = ({
  children,
  gradient,
  extraPad,
  bubble,
  noBorderTop,
  ...props
}: any) => {
  const { tint } = useTint()
  const childrenMemo = useMemo(() => children, [children])

  return (
    <YStack
      z={2}
      contain="paint"
      position="relative"
      py="$14"
      elevation="$2"
      {...(bubble &&
        tint && {
          maxW: 1400,
          rounded: '$6',
          borderWidth: 1,
          borderColor: `$${tint}4`,
          self: 'center',
          width: '100%',
        })}
      {...props}
    >
      <YStack
        fullscreen
        className="all ease-in ms1000"
        z={-1}
        opacity={0.4}
        bg={gradient && tint ? (`$${tint}2` as any) : null}
        {...(!bubble && {
          borderTopWidth: noBorderTop ? 0 : 1,
          borderBottomWidth: 1,
          borderColor: tint ? (`$${tint}3` as any) : '$borderColor',
        })}
      />
      {childrenMemo}
    </YStack>
  )
}
