import { useThemeSetting } from '@tamagui/next-theme'
import Head from 'next/head'
import React from 'react'
import { H1, Spacer, YStack, useComposedRefs } from 'tamagui'

import { ContainerXL } from '../../components/Container'
import { HeaderIndependent } from '../../components/HeaderIndependent'
import { useHoverGlow } from '../../components/HoverGlow'
import { TitleAndMetaTags } from '../../components/TitleAndMetaTags'

export default function StudioPage() {
  return (
    <>
      <TitleAndMetaTags title="Tamagui Studio" description="Color and theme studio." />

      <HeaderIndependent showExtra />

      <Head>
        <link href="/fonts/inter-takeout.css" rel="stylesheet" />
      </Head>

      <ContainerXL>
        <Hero />
      </ContainerXL>
    </>
  )

  // return (
  //   <Studio />
  // )
}

const Hero = () => {
  const { resolvedTheme: themeName } = useThemeSetting()

  const glow = useHoverGlow({
    resist: 60,
    size: 900,
    strategy: 'blur',
    blurPct: 100,
    color: themeName === 'light' ? '#fff' : 'var(--pink10)',
    opacity: 0.4,
    background: 'transparent',
  })

  const glint = useHoverGlow({
    resist: 76,
    size: 500,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--red10)',
    offset: {
      x: 200,
      y: -200,
    },
    opacity: 0.34,
    background: 'transparent',
    inverse: true,
  })

  const parentRef = useComposedRefs(glow.parentRef, glint.parentRef)

  return (
    <YStack
      ai="center"
      scale={0.4}
      $gtXs={{ scale: 0.5, py: '$2' }}
      $gtSm={{ scale: 0.7, py: '$4' }}
      $gtMd={{ scale: 0.9, py: '$6' }}
      $gtLg={{ scale: 1, py: '$8' }}
      pos="relative"
      ref={parentRef as any}
    >
      <YStack>
        {glow.element}
        {glint.element}
        <YStack ai="center" py={220} pos="relative">
          <H1
            color="$color"
            cursor="default"
            fos={320}
            lh={200}
            fow="900"
            fontFamily="$inter"
            ls={-24}
            pos="relative"
            zIndex={5}
          >
            Studio
          </H1>

          <Spacer size="$12" />

          <img width="100%" src="/studio.png" />
        </YStack>
      </YStack>
    </YStack>
  )
}
