import {
  GetProps,
  SizableText,
  XStack,
  YStack,
  composeRefs,
  styled,
  withStaticProperties,
} from 'tamagui'

import { useHoverGlow } from './HoverGlow'

const DocsCtaCardFrame = styled(YStack, {
  className: 'blur-8',
  borderWidth: 1,
  justifyContent: 'center',
  overflow: 'hidden',

  variants: {
    size: {
      '...size': (val) => ({
        elevation: val,
        p: val as any,
        br: val as any,
      }),
    },
  } as const,

  defaultVariants: {
    size: '$4',
  },
})

export type DocsCtaCardProps = { glowColor: string } & GetProps<typeof DocsCtaCardFrame>

export const DocsCtaCard = withStaticProperties(
  ({ children, glowColor, ...props }: DocsCtaCardProps) => {
    const innerGlow = useHoverGlow({
      resist: 40,
      size: 150,
      strategy: 'blur',
      blurPct: 100,
      // inverse: true,
      color: glowColor,
      opacity: 0.5,
      background: 'transparent',
      style: {
        transition: `all ease-out 300ms`,
      },
    })

    // const borderGlow = useHoverGlow({
    //   resist: 0,
    //   size: 200,
    //   strategy: 'blur',
    //   blurPct: 100,
    //   color: 'var(--color11)',
    //   opacity: 1,
    //   background: 'transparent',
    // })

    return (
      <>
        <DocsCtaCardFrame
          borderColor={glowColor as any}
          {...props}
          ref={
            composeRefs(
              // borderGlow.parentRef,
              innerGlow.parentRef
            ) as any
          }
        >
          {/* <svg width="0" height="0">
            <defs>
              <clipPath id="myClip">
                <path d="M285,0 C293.284271,-1.52179594e-15 300,6.71572875 300,15 L300,285 C300,293.284271 293.284271,300 285,300 L15,300 C6.71572875,300 1.01453063e-15,293.284271 0,285 L0,15 C-1.01453063e-15,6.71572875 6.71572875,1.52179594e-15 15,0 L285,0 Z M285,1 L15,1 C7.2680135,1 1,7.2680135 1,15 L1,15 L1,285 C1,292.731986 7.2680135,299 15,299 L15,299 L285,299 C292.731986,299 299,292.731986 299,285 L299,285 L299,15 C299,7.2680135 292.731986,1 285,1 L285,1 Z"></path>
              </clipPath>
            </defs>
          </svg> */}

          <innerGlow.Component />
          {/* <YStack
            fullscreen
            style={{
              clipPath: `url(#myClip)`,
            }}
          >
            <borderGlow.Component />
          </YStack> */}

          <XStack f={1} gap="$4">
            {children}
          </XStack>
        </DocsCtaCardFrame>
      </>
    )
  },
  {
    Title: styled(SizableText, {
      fontFamily: '$heading',
      size: '$6',
    }),
    description: styled(SizableText, {
      fontFamily: '$body',
      size: '$3',
    }),
  }
)
