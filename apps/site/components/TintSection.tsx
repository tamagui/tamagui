import { useOnIntersecting } from '@tamagui/demos'
import { tints } from '@tamagui/logo'
import { useEffect, useMemo, useRef } from 'react'
import { GetProps, XStack, YStack, styled } from 'tamagui'

import { setTintIndex, useTint } from './useTint'

const numIntersectingAtSection: number[] = tints.map((_) => 0)

export const TintSection = ({
  children,
  index,
  themed,
  ...props
}: SectionProps & { themed?: boolean; index: number }) => {
  const top = useRef<HTMLElement>(null)
  const bottom = useRef<HTMLElement>(null)
  const mid = useRef<HTMLElement>(null)
  const { tint } = useTint()

  useOnIntersecting(
    useMemo(() => [top, mid, bottom], []),
    (entries) => {
      const count = entries.reduce((a, b) => a + (b?.isIntersecting ? 1 : 0), 0)
      numIntersectingAtSection[index] = count

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
      threshold: 0.1,
    }
  )

  return (
    <YStack contain="layout paint" pos="relative">
      <XStack ref={top} pos="absolute" t="10%" l={0} r={0} h={10} o={0} pe="none" />
      <XStack ref={mid} pos="absolute" t="50%" l={0} r={0} h={10} o={0} pe="none" />
      <XStack ref={bottom} pos="absolute" b="10%" l={0} r={0} h={10} o={0} pe="none" />
      <HomeSection theme={themed ? tint : null} {...props}>
        {useMemo(() => children, [children])}
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
  pos: 'relative',
  className: 'content-visibility-auto',
  py: '$14',
  zi: 2,

  variants: {
    below: {
      true: {
        zi: 1,
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
      zi={2}
      contain="paint"
      pos="relative"
      py="$14"
      elevation="$2"
      {...(bubble && {
        maw: 1400,
        br: '$6',
        bw: 1,
        boc: `$${tint}4`,
        als: 'center',
        width: '100%',
      })}
      {...props}
    >
      <YStack
        fullscreen
        className="all ease-in ms1000"
        zi={-1}
        o={0.4}
        bc={gradient ? `$${tint}2` : null}
        {...(!bubble && {
          btw: noBorderTop ? 0 : 1,
          bbw: 1,
          boc: `$${tint}3`,
        })}
      />
      {childrenMemo}
    </YStack>
  )
}
