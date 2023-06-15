import { PoweredByStripeIcon } from '@components/PoweredByStripeIcon'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { Database } from '@lib/supabase-types'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { getSize } from '@tamagui/get-token'
import { LogoIcon, LogoWords, TamaguiLogo, ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Check, Dot, Hammer, X } from '@tamagui/lucide-icons'
import { useClientValue, useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { Store, createUseStore } from '@tamagui/use-store'
import { ContainerXL } from 'components/Container'
import { useUser } from 'hooks/useUser'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import React, { Suspense, memo, useEffect, useState } from 'react'
import {
  AnimatePresence,
  Button,
  ButtonProps,
  Circle,
  Dialog,
  GetProps,
  H1,
  H2,
  H3,
  Input,
  Label,
  Paragraph,
  RadioGroup,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  SizeTokens,
  Spacer,
  Stack,
  TabLayout,
  Tabs,
  TabsProps,
  TabsTabProps,
  Theme,
  Unspaced,
  XStack,
  XStackProps,
  YStack,
  YStackProps,
  composeRefs,
  isClient,
  styled,
  useMedia,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { useHoverGlow } from '../components/HoverGlow'
import { LoadGlusp, LoadMunro } from '../components/LoadFont'
import { NextLink } from '../components/NextLink'

const ua = (() => {
  if (typeof window === 'undefined') return
  return window.navigator.userAgent
})()

const isWebkit = (() => {
  return !!ua?.match(/WebKit/i)
})()

const isSafariMobile = (() => {
  const iOS = !!ua?.match(/iPad/i) || !!ua?.match(/iPhone/i)
  return isClient && iOS && isWebkit && !ua?.match(/CriOS/i)
})()

const TakeoutBox3D = dynamic(() => import('../components/TakeoutBox3D'), { ssr: false })

const heroHeight = 850

type TakeoutPageProps = {
  starter?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
}

const TakeoutCard2Frame = styled(YStack, {
  className: 'blur-8',
  borderWidth: 1,
  borderColor: '$borderColor',
  minWidth: 302,
  maxWidth: 302,
  minHeight: 302,
  maxHeight: 302,
  overflow: 'hidden',

  variants: {
    size: {
      '...size': (val) => ({
        elevation: val,
        p: val,
        br: val,
      }),
    },
  } as const,

  defaultVariants: {
    size: '$6',
  },
})

type TakeoutCardFrameProps = GetProps<typeof TakeoutCard2Frame> & {
  title: React.ReactNode
  icon?: string
}

const TakeoutCard = ({ children, title, icon, ...props }: TakeoutCardFrameProps) => {
  const innerGlow = useHoverGlow({
    resist: 50,
    size: 450,
    strategy: 'blur',
    blurPct: 100,
    // inverse: true,
    color: 'var(--color10)',
    opacity: 0.25,
    background: 'transparent',
    style: {
      transition: `all ease-out 500ms`,
    },
  })

  const borderGlow = useHoverGlow({
    resist: 0,
    size: 200,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--color12)',
    opacity: 0.9,
    background: 'transparent',
  })

  return (
    <>
      <TakeoutCard2Frame
        {...props}
        ref={composeRefs(borderGlow.parentRef, innerGlow.parentRef) as any}
      >
        <svg width="0" height="0">
          <defs>
            <clipPath id="myClip">
              <path d="M285,0 C293.284271,-1.52179594e-15 300,6.71572875 300,15 L300,285 C300,293.284271 293.284271,300 285,300 L15,300 C6.71572875,300 1.01453063e-15,293.284271 0,285 L0,15 C-1.01453063e-15,6.71572875 6.71572875,1.52179594e-15 15,0 L285,0 Z M285,1 L15,1 C7.2680135,1 1,7.2680135 1,15 L1,15 L1,285 C1,292.731986 7.2680135,299 15,299 L15,299 L285,299 C292.731986,299 299,292.731986 299,285 L299,285 L299,15 C299,7.2680135 292.731986,1 285,1 L285,1 Z"></path>
            </clipPath>
          </defs>
        </svg>

        <innerGlow.Component />
        <YStack
          fullscreen
          style={{
            clipPath: `url(#myClip)`,
          }}
        >
          <borderGlow.Component />
        </YStack>

        <YStack fullscreen bg="$background" pe="none" zi={-1} o={0.5} />

        <YStack f={1} space zi={100}>
          <H2 fontFamily="$munro" size="$10" my={-12}>
            {title}
          </H2>
          {children}

          {!!icon && (
            <YStack pos="absolute" b={0} r={0}>
              <Image className="pixelate" src={icon} alt="Icon" width={52} height={52} />
            </YStack>
          )}
        </YStack>
      </TakeoutCard2Frame>
    </>
  )
}

const TakeoutHero = () => {
  const disableMotion = useDisableMotion()
  const enable3d = useClientValue(
    !isSafariMobile && isClient && !window.location.search?.includes('disable-3d')
  )

  // unfortunately costs too much perf
  // const glow = useHoverGlow({
  //   resist: 80,
  //   size: 800,
  //   strategy: 'blur',
  //   blurPct: 100,
  //   color: 'var(--color9)',
  //   opacity: 0.09,
  //   offset: {
  //     y: -200,
  //     x: -70,
  //   },
  //   style: {
  //     zIndex: -1,
  //   },
  //   background: 'transparent',
  // })

  return (
    <YStack
      y={heroHeight / 2 - 360}
      ai="center"
      jc="center"
      className="ease-in ms300 all"
      pos="relative"
      $xxs={{
        scale: 0.3,
      }}
      $xs={{
        scale: 0.35,
      }}
      $sm={{
        scale: 0.5,
      }}
      $md={{
        scale: 0.6,
      }}
      $lg={{
        scale: 0.8,
      }}
      // ref={glow.parentRef as any}
    >
      {/* <ThemeTint>
        <glow.Component />
      </ThemeTint> */}

      <Paragraph
        color="$color"
        size="$1"
        fontSize={12}
        ls={135}
        o={0.1}
        fontFamily="$silkscreen"
        pe="none"
        h={40}
        userSelect="none"
      >
        TAMAGUI
      </Paragraph>

      {/* animated borders shine */}
      <YStack pos="absolute" y={-38}>
        <ThemeTint>
          <TAKEOUT className="theme-shadow masked2" zi={100} color="transparent" />
        </ThemeTint>
      </YStack>

      <YStack
        pos="absolute"
        className="mix-blend"
        y={-35}
        style={{
          clipPath: `polygon(0% 0, 50% 50%, 100% 100%, 100% 0%, 90% 0, 20% 100%)`,
        }}
      >
        <ThemeTint>
          <TAKEOUT className="" zi={1000} color="$color10" />
        </ThemeTint>
      </YStack>

      <YStack
        className="mix-blend"
        style={{
          clipPath: `polygon(0% 0%, 0% 100%, 100% 100%, 0% 0%, 90% 0, 20% 100%)`,
        }}
      >
        <TAKEOUT zi={1000} />

        {!disableMotion && (
          <ThemeTint>
            {/* main color slices */}
            <TAKEOUT
              className="clip-slice mix-blend"
              pos="absolute"
              color="$color7"
              scale={1.04}
              o={0.8}
            />

            {/* alt color slices */}
            <ThemeTintAlt>
              <TAKEOUT
                className="clip-slice mix-blend animate-fade2 slice-alt"
                pos="absolute"
                color="$color7"
                y={2}
                o={0.8}
              />
            </ThemeTintAlt>

            {/* alt color slices */}
            <ThemeTintAlt offset={1}>
              <TAKEOUT
                className="clip-slice mix-blend animate-fade2"
                pos="absolute"
                color="$color7"
                scale={1}
              />
            </ThemeTintAlt>
          </ThemeTint>
        )}

        <YStack
          pos="absolute"
          fullscreen
          zi={2}
          pe="none"
          ai="center"
          jc="center"
          y={30}
          scaleX={0.9}
        >
          <TAKEOUT className="bg-dot-grid clip-text" />
        </YStack>

        {/* takeout shadow */}
        <YStack
          pos="absolute"
          fullscreen
          zi={-1}
          pe="none"
          ai="center"
          jc="center"
          y={-20}
          o={0.75}
          scale={1.05}
        >
          <TAKEOUT color="$background" className="" />
        </YStack>
      </YStack>

      <XStack my={21} gap={125} f={1} jc="space-between" className="mix-blend">
        <IconFrame>
          <Image
            className="pixelate"
            src="/retro-icons/coding-apps-websites-module-21.svg"
            alt="Icon"
            width={18}
            height={18}
          />
        </IconFrame>

        <IconFrame>
          <Image
            className="pixelate"
            src="/retro-icons/coding-apps-websites-browser-bugs-2-58.svg"
            alt="Icon"
            width={18}
            height={18}
          />
        </IconFrame>

        <IconFrame>
          <Image
            className="pixelate"
            src="/retro-icons/coding-apps-websites-database-60.svg"
            alt="Icon"
            width={18}
            height={18}
          />
        </IconFrame>

        <IconFrame>
          <Image
            className="pixelate"
            src="/retro-icons/design-color-bucket-brush-63.svg"
            alt="Icon"
            width={18}
            height={18}
          />
        </IconFrame>

        <IconFrame>
          <Image
            className="pixelate"
            src="/retro-icons/design-color-palette-sample-26.svg"
            alt="Icon"
            width={18}
            height={18}
          />
        </IconFrame>
      </XStack>

      <YStack
        position="absolute"
        top={360}
        r="-10%"
        $sm={{ r: '-180%' }}
        $md={{ r: '-50%' }}
        $lg={{ r: '-35%' }}
        zIndex={-1}
      >
        {enable3d && (
          <Suspense fallback={null}>
            <TakeoutBox3D />
          </Suspense>
        )}
      </YStack>
    </YStack>
  )
}

const useDisableMotion = () => {
  return useClientValue(
    isClient &&
      (window.matchMedia(`(prefers-reduced-motion: reduce)`)?.matches ||
        window.location.search?.includes('disable-motion') ||
        /firefox/i.test(navigator.userAgent))
  )
}

export default function TakeoutPage({ starter }: TakeoutPageProps) {
  const store = useTakeoutStore()
  const disableMotion = useDisableMotion()

  return (
    <>
      <>
        <NextSeo
          title="🥡 Tamagui Takeout"
          description="Tamagui Takeout React Native Bootstrap Starter Kit"
        />
        <Head>
          <LoadGlusp />
          <LoadMunro />
        </Head>
      </>

      {/* <Glow /> */}

      <PurchaseModal productWithPrices={starter} />

      {/* big background outlined font */}
      <YStack
        pos="absolute"
        fullscreen
        b="auto"
        zi={-2}
        pe="none"
        ai="center"
        jc="center"
        ov="hidden"
        contain="paint layout"
        y={20}
      >
        <TAKEOUT
          className={`font-outlined theme-shadow`}
          fontSize={150 * 3.5}
          lineHeight={110 * 3.5}
          color="#000"
          o={0.1}
        />
      </YStack>

      <YStack>
        <ContainerXL>
          <YStack h={0} mah={0}>
            <YStack position="absolute" t={20} r="5%">
              <PurchaseButton
                onPress={() => {
                  store.showPurchase = true
                }}
                size="$3"
              >
                Purchase
              </PurchaseButton>
            </YStack>

            <TakeoutHero />
          </YStack>

          <YStack t={heroHeight - 1000} l={-100} pos="absolute" b={0} zi={-3}>
            <Separator o={0.75} vertical h={4100} pos="absolute" l={0.5} />
            <Separator o={0.75} vertical h={4100} pos="absolute" r={0} />

            <YStack t={750} px="$6">
              <Separator o={0.75} w={3000} pos="absolute" t={0.5} l={-1000} />
              <Separator o={0.75} w={3000} pos="absolute" b={0} l={-1000} />

              <YStack mb="$6" space="$4">
                <H2 ta="right" fontFamily="$munro" o={0.1}>
                  x
                </H2>
                <LogoIcon />
              </YStack>

              <H2
                t={-100}
                pos="absolute"
                fontFamily="$munro"
                tt="uppercase"
                x={-650}
                scale={0.5}
                rotate="-90deg"
                o={0.15}
                ls={15}
                w={4000}
              >
                A new take on bootstrapping · A new take on bootstrapping · A new take on
                bootstrapping · A new take on bootstrapping
              </H2>
            </YStack>
          </YStack>

          <XStack mt={heroHeight + 70} space="$10" $md={{ fd: 'column' }}>
            <XStack
              f={1}
              p="$10"
              mt={20}
              $md={{
                flexDirection: 'column',
              }}
              $lg={{
                p: '$6',
              }}
              $sm={{
                p: '$4',
              }}
            >
              <YStack mt={-500} ml={20} mr={-20}>
                <StarterCard product={starter} />
              </YStack>
              {/* <YStack
                className="mix-blend"
                fullscreen
                bw={1}
                boc="$color"
                bc="$background"
                o={0.24}
              /> */}

              <YStack f={1} space="$6">
                <MunroP
                  className="mix-blend pixelate"
                  mt={-230}
                  mb={-20}
                  size="$7"
                  ls={4}
                  o={0.5}
                  $sm={{
                    size: '$4',
                  }}
                >
                  Jumpstarting startups since '23
                </MunroP>

                <ThemeTint>
                  <H2
                    className="clip-text mix-blend"
                    size="$13"
                    color="$color10"
                    style={{
                      // @ts-ignore
                      backgroundImage: `-webkit-linear-gradient(100deg, var(--color9) 50%, #fff 50%)`,
                    }}
                    $lg={{
                      size: '$11',
                    }}
                    $sm={{
                      size: '$10',
                    }}
                  >
                    From idea to shipped in less time than ever.
                  </H2>
                </ThemeTint>

                <HeartsRow />

                <Paragraph fontFamily="$munro" size="$10" fow="400" $sm={{ size: '$8' }}>
                  We can't promise the moon or the ✨, success is up to you. But if you
                  want a cheat code to shipping a stunning web + native app fast, you've
                  found it.
                </Paragraph>

                <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                  Takeout 🥡 is a bootstrap that delivers on years of effort putting
                  together a better unified React Native + web stack for startups.
                </Paragraph>

                <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                  And of course it's powered by{' '}
                  <LogoWords tag="span" display="inline-flex" mx="$3" scale={1.1} />, the
                  best universal UI system ever created (by far). Within an hour you'll be
                  deploying your app on the web to Vercel and to iOS and Android app
                  stores via Expo EAS.
                </Paragraph>

                <Spacer size="$6" />

                <XStack fw="wrap" gap="$4" mx="$-6" ai="center" jc="center">
                  <TakeoutCard
                    theme="orange"
                    title="Monorepo"
                    icon="retro-icons/coding-apps-websites-module-21.svg"
                  >
                    <YStack space>
                      <Point size="$4">Well-isolated configuration.</Point>
                      <Point size="$4">100% shared code between web and native.</Point>
                      <Point size="$4" mr="$10">
                        Scripts for running your dev env in one command.
                      </Point>
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="yellow"
                    title="Design"
                    icon="retro-icons/design-color-painting-palette-25.svg"
                  >
                    <YStack space>
                      <Point size="$4">
                        Complete design system with the new ThemeBuilder for easy
                        customization.
                      </Point>
                      <Point size="$4">
                        Two brand new theme packs - Neon and Pastel.
                      </Point>
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="green"
                    title="Deploy"
                    icon="retro-icons/computers-devices-electronics-vintage-mac-54.svg"
                  >
                    <YStack space>
                      <Point size="$4">Vercel + Preview Deploys.</Point>
                      <Point size="$4">Expo EAS + Expo Router.</Point>
                      <Point size="$4" mr="$10">
                        Script that sets up both local and remote dev environments.
                      </Point>
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="blue"
                    title="Screens"
                    icon="retro-icons/coding-app-website-ui-62.svg"
                  >
                    <YStack space>
                      <Point size="$4">
                        100% shared native and web, adapted to each platform.
                      </Point>
                      {/* <Point size="$4">Adapted to each platform.</Point> */}
                      <Point size="$4">
                        Onboarding, auth, account, settings, profile, feed, edit profile.
                      </Point>
                      <Point size="$4" mr="$10">
                        Universal form system + validation.
                      </Point>
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="purple"
                    title="Assets"
                    icon="retro-icons/coding-apps-websites-plugin-33.svg"
                  >
                    <YStack space>
                      <Point size="$4">
                        +150 icon packs, adapted to use themes, sizing, and tree shaking.
                      </Point>
                      <Point size="$4">All of Google fonts, over +1500 packs.</Point>
                      <Point size="$4">More every month.</Point>
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="pink"
                    title="& More"
                    icon="retro-icons/coding-apps-websites-programming-hold-code-9.svg"
                  >
                    <YStack space>
                      <Point size="$4">
                        Universal light/dark mode, image upload and Supabase utils.
                      </Point>
                      <Point size="$4">TakeoutBot ongoing updates.</Point>
                      {/* <Point size="$4">Test, lint, CI/CD.</Point> */}
                      <Point size="$4" mr="$10">
                        #takeout Discord access.
                      </Point>
                    </YStack>
                  </TakeoutCard>
                </XStack>

                <YStack marginTop={-300} marginBottom={-550} x={200} zi={-1}>
                  <Image
                    alt="iPhone screenshot of Tamagui"
                    src="/iphone.png"
                    width={863}
                    height={928}
                  />
                </YStack>

                <Separator className="mix-blend" boc="#fff" o={0.25} my="$8" mx="$8" />

                <YStack
                  p="$6"
                  px="$8"
                  className="blur-medium"
                  space="$6"
                  elevation="$6"
                  br="$10"
                  mt={-100}
                  $sm={{
                    px: '$4',
                    mx: '$-4',
                  }}
                >
                  <YStack br="$10" zi={-1} fullscreen bc="$background" o={0.3} />
                  <YStack br="$10" zi={-1} fullscreen bc="$color" o={0.1} />

                  <YStack
                    bc="#000"
                    rotate="-2deg"
                    mt={-130}
                    mb={20}
                    px="$6"
                    py="$2"
                    elevation="$4"
                    als="center"
                    br="$5"
                  >
                    <ThemeTint>
                      <Paragraph
                        color="$color9"
                        fontFamily="$munro"
                        size="$11"
                        $sm={{ size: '$8' }}
                        fow="800"
                        ta="center"
                      >
                        Speedrun from 0-to-100 🥡
                      </Paragraph>
                    </ThemeTint>
                    <Paragraph
                      color="$color9"
                      fontFamily="$munro"
                      size="$8"
                      mt={-10}
                      $sm={{ dsp: 'none' }}
                      fow="800"
                      ta="center"
                    >
                      (...but don't forget the long run)
                    </Paragraph>
                  </YStack>

                  <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                    It's not just about shipping fast.
                  </Paragraph>

                  <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                    Takeout is a template repo *and a bot* that's designed with pluggable,
                    well-isolated features. Whenever we make significant updates, we
                    trigger the TakeoutBot to send over a PR.
                  </Paragraph>

                  <Paragraph size="$8" $sm={{ size: '$7' }} fow="400" color="$yellow10">
                    That means you get constant improvements to your codebase.
                  </Paragraph>

                  <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                    It's why we've set up pricing the way we have: lifetime rights, one
                    year of updates. Forever pricing wouldn't incentivize us to keep
                    innovating, and we want to make the Takeout stack the best stack,
                    period.
                  </Paragraph>

                  <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                    We're working on bringing many nice new features that you can pick and
                    choose from, some of which are already in progress:
                  </Paragraph>

                  <Separator />

                  <XStack tag="ul" fw="wrap" gap="$4" my="$4">
                    <Bullet inProgress>Maestro native integration tests</Bullet>
                    <Bullet inProgress>Playwright integration tests</Bullet>
                    <Bullet inProgress>Reanimated + reanimated modules</Bullet>
                    <Bullet inProgress>Simple state management system</Bullet>
                    <Bullet inProgress>Layout animations</Bullet>
                    <Bullet inProgress>Storybook</Bullet>
                    <Bullet>Notifications</Bullet>
                    <Bullet>Alternative deployment targets</Bullet>
                    <Bullet>Simple data fetching library</Bullet>
                    <Bullet>Premium font add-ons</Bullet>
                    <Bullet>Unified RN and web testing tools</Bullet>
                    <Bullet>Improved CI/CD caching</Bullet>
                  </XStack>

                  <Spacer />
                </YStack>

                <XStack my="$8" gap="$4" f={1} jc="space-around">
                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-app-website-ui-62.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-browser-bugs-2-58.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-database-60.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-bucket-brush-63.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-palette-sample-26.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />
                </XStack>

                <MunroP size="$10">
                  A reference design for a building a truly high quality app - that keeps
                  improving.
                </MunroP>

                <HeartsRow />

                <MunroP size="$10" color="$yellow10">
                  We hope you enjoy.
                </MunroP>

                <MunroP size="$3" o={0.3}>
                  These statements have not been approved by the FDA. Talk to your doctor
                  about Tamagui Takeout. Side effects may include spending way too much
                  time tweaking color palettes when you should be just shipping your damn
                  app.
                </MunroP>
              </YStack>
            </XStack>

            <YStack mt={200} w={3} mih={500} h="100%" />
          </XStack>

          <YStack pos="absolute" t={150} r={-520} rotate="120deg" o={0.045} zi={-2}>
            <Image
              alt="mandala"
              width={2500}
              height={2500}
              src="/takeout/geometric.svg"
            />
          </YStack>

          <Spacer size="$10" />
        </ContainerXL>
      </YStack>
    </>
  )
}

const Bullet = ({
  size = '$6',
  children,
  subtitle,
  inProgress,
  ...props
}: XStackProps & {
  children: any
  subtitle?: any
  size?: SizeTokens
  inProgress?: boolean
}) => {
  return (
    <XStack tag="li" ai="flex-start" space f={1} {...props} w="calc(50% - 10px)">
      <YStack y={-1}>
        <Circle size={42} my={-6} boc="$borderColor" bw={1}>
          {inProgress ? (
            <Hammer size={24} color="$color10" />
          ) : (
            <Dot size={24} color="$color10" />
          )}
        </Circle>
      </YStack>
      <YStack f={1}>
        <Paragraph wordWrap="break-word" size={size}>
          {children}
        </Paragraph>
        {!!subtitle && (
          <Paragraph
            size={
              getSize(size, {
                shift: -2,
              }) as any
            }
            theme="alt2"
            o={0.5}
          >
            {subtitle}
          </Paragraph>
        )}
      </YStack>
    </XStack>
  )
}

const Point = ({
  size = '$4',
  children,
  subtitle,
  ...props
}: XStackProps & {
  children: any
  subtitle?: any
  size?: SizeTokens
}) => {
  return (
    <XStack tag="li" ai="flex-start" space f={1} ov="hidden" {...props}>
      <YStack py="$1.5">
        <Check size={16} color="$color10" />
      </YStack>
      <YStack f={1}>
        <Paragraph wordWrap="break-word" size={size}>
          {children}
        </Paragraph>
        {!!subtitle && (
          <Paragraph
            size={
              getSize(size, {
                shift: -2,
              }) as any
            }
            theme="alt2"
            o={0.5}
          >
            {subtitle}
          </Paragraph>
        )}
      </YStack>
    </XStack>
  )
}

const IconFrame = styled(Stack, {
  borderRadius: 1000,
  p: '$4',
  bc: 'rgba(255, 255, 255, 0.035)',
})

class TakeoutStore extends Store {
  showPurchase = false
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}
const useTakeoutStore = createUseStore(TakeoutStore)

const PurchaseModal = ({
  productWithPrices: product,
}: {
  productWithPrices: TakeoutPageProps['starter']
}) => {
  if (!product) return null

  const prices = product.prices
  const store = useTakeoutStore()
  const [selectedPriceId, setSelectedPriceId] = useState(prices[prices.length - 1].id)
  const [seats, setSeats] = useState(1)
  const selectedPrice = prices.find((p) => p.id === selectedPriceId)
  const { data } = useUser()
  const subscriptions = data?.subscriptions
  const subscription = subscriptions?.find((sub) => {
    if (sub.status !== 'active') return false
    const price = sub.prices
      ? Array.isArray(sub.prices)
        ? sub.prices[0]
        : sub.prices
      : null
    if (!price) return false
    return price.product_id === product.id
  })
  const sortedPrices = prices.sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0))

  return (
    <Dialog
      modal
      open={store.showPurchase}
      onOpenChange={(val) => {
        store.showPurchase = val
      }}
    >
      <Dialog.Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Dialog.Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Dialog.Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          className="blur-medium"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0, scale: 0.975 }}
          exitStyle={{ opacity: 0, scale: 0.975 }}
          w="90%"
          maw={900}
        >
          <YStack h="100%" space>
            <XStack ai="center" jc="space-between" gap="$6" mx="$8">
              <Separator />
              <Dialog.Title size="$9" my="$3" als="center">
                Purchase 🥡
              </Dialog.Title>
              <Separator />
            </XStack>

            <YStack>
              <RadioGroup
                gap="$4"
                value={selectedPriceId}
                onValueChange={setSelectedPriceId}
                flexDirection="row"
                flexWrap="wrap"
              >
                {sortedPrices.map((price) => {
                  const active = price.id === selectedPriceId
                  const htmlId = `radio-${price.id}`
                  return (
                    <ThemeTint key={price.id} disable={!active}>
                      <Label
                        f={1}
                        htmlFor={htmlId}
                        p="$4"
                        height="unset"
                        display="flex"
                        borderWidth="$0.25"
                        borderColor={active ? '$color8' : '$color5'}
                        borderRadius="$4"
                        space="$4"
                        ai="flex-start"
                        maw="calc(33% - 16px)"
                        hoverStyle={{
                          borderColor: active ? '$color10' : '$color7',
                        }}
                      >
                        <RadioGroup.Item id={htmlId} size="$6" value={price.id} mt="$2">
                          <RadioGroup.Indicator
                            backgroundColor={active ? '$color8' : '$color1'}
                          />
                        </RadioGroup.Item>

                        <YStack gap="$1" f={1}>
                          <H3>
                            {price.interval === 'year' && 'Yearly Plan'}
                            {price.interval === 'month' && 'Monthly Plan'} 🥡
                          </H3>
                          <Paragraph ellipse>{price.description}</Paragraph>
                        </YStack>
                      </Label>
                    </ThemeTint>
                  )
                })}
              </RadioGroup>
            </YStack>

            <XStack f={1} space separator={<Separator vertical />}>
              <ScrollView space maw="55%" ov="hidden">
                <YStack space="$4">
                  <Points />
                </YStack>
              </ScrollView>

              <YStack f={1} space="$4">
                <H3>Seats</H3>
                <Separator />
                <YStack ai="flex-start">
                  <PurchaseSelectTeam
                    onValueChange={(val) => {
                      setSeats(Math.max(1, Number(val)))
                    }}
                    value={seats.toString()}
                  />
                </YStack>

                <Spacer f={100} />

                <YStack space>
                  <YStack ai="flex-end">
                    <H3 size="$10">
                      {formatPrice(
                        (selectedPrice!.unit_amount! / 100) * seats,
                        selectedPrice!.currency ?? 'usd'
                      )}
                    </H3>
                  </YStack>

                  <Separator />

                  <YStack pb="$8" px="$4" space>
                    <NextLink
                      href={
                        subscription
                          ? `/account/subscriptions`
                          : `api/checkout?${new URLSearchParams({
                              product_id: product.id,
                              price_id: selectedPriceId,
                              quantity: seats.toString(),
                            }).toString()}`
                      }
                    >
                      <PurchaseButton>
                        {subscription ? `View Subscription` : `Purchase`}
                      </PurchaseButton>
                    </NextLink>
                    <XStack jc="space-between" space="$2" ai="center">
                      <XStack
                        ai="center"
                        separator={<Separator vertical bc="$color8" my="$2" />}
                        space="$2"
                      >
                        <NextLink href="#">
                          <SizableText
                            theme="alt1"
                            // @ts-ignore
                            style={{ textDecoration: 'underline' }}
                            size="$1"
                          >
                            FAQ
                          </SizableText>
                        </NextLink>
                        <NextLink href="#">
                          <SizableText
                            theme="alt1"
                            // @ts-ignore
                            style={{ textDecoration: 'underline' }}
                            size="$1"
                          >
                            License Agreement
                          </SizableText>
                        </NextLink>
                      </XStack>
                      <Theme name="alt1">
                        <PoweredByStripeIcon width={96} />
                      </Theme>
                    </XStack>
                  </YStack>
                </YStack>
              </YStack>
            </XStack>

            <Unspaced>
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  top="$1"
                  right="$1"
                  size="$2"
                  circular
                  icon={X}
                />
              </Dialog.Close>
            </Unspaced>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const StarterCard = memo(({ product }: { product: TakeoutPageProps['starter'] }) => {
  const media = useMedia()
  const [ref, setRef] = useState<any>()

  const store = useTakeoutStore()

  useEffect(() => {
    if (!ref) return
    if (!isClient) return

    if (media.md) {
      // disable on medium
      return
    }

    let dispose = () => {}

    // @ts-ignore
    import('../lib/sticksy').then(({ Sticksy }) => {
      new Sticksy(ref as any)

      dispose = () => {
        Sticksy.disableAll()
      }
    })

    return dispose
  }, [ref, media.md])

  return (
    <div ref={setRef}>
      <ThemeTint>
        <TakeoutCardFrame
          className="blur-medium"
          zi={1000}
          maw={340}
          als="center"
          shadowRadius={30}
          shadowOffset={{ height: 20, width: 0 }}
          shadowColor="#000"
          x={-100}
          y={100}
          mah="calc(min(95vh, 800px))"
          $md={{
            x: -20,
            y: 0,
            mb: 280,
            mah: 'auto',
            w: '100%',
            maw: '100%',
            mt: 160,
          }}
        >
          <YStack zi={-1} fullscreen bc="$backgroundStrong" o={0.8} />

          <LinearGradient
            pos="absolute"
            b={0}
            l={0}
            r={0}
            h={200}
            colors={['$backgroundTransparent', 'rgba(0,0,0,1)']}
            zi={100}
          />

          <YStack pos="absolute" b="$4" l="$4" r="$4" zi={100}>
            {/* cant use buttonlink it breaks scroll on press if not enabled, conditionally use a link */}
            {/* subscription ? `/account/subscriptions#${subscription.id}` : '' */}
            <PurchaseButton
              onPress={() => {
                store.showPurchase = true
              }}
            >
              Purchase
            </PurchaseButton>
          </YStack>

          <ScrollView disabled={media.md} showsVerticalScrollIndicator={false}>
            <YStack space="$2" p="$6">
              <MunroP size="$3" o={0.12} mt={-5}>
                Drop 0001
              </MunroP>

              <MunroP size="$11" ls={2}>
                The Stack
              </MunroP>

              <YStack>
                <Row
                  title="Template"
                  description="Complete GitHub Template with a built-in bot to send PRs with updates."
                  after="01"
                />

                <Row
                  title="Monorepo"
                  description="Complete with Next.js, Vercel deploy, Expo and EAS."
                  after="01"
                />

                <Row
                  title="Screens"
                  description="Tab bar, Stack view, Onboarding, Auth, Profile, Edit Profile, Account, Settings, Feed and more + carefully crafted layouts to adapt to web and native."
                  after="08"
                />

                <Row
                  title="Data & Auth"
                  description="Supabase pre-configured with migrations, auth, utilities, automatic setup and everything to get rolling immediately."
                  after="01"
                />

                <Row
                  title="Icons"
                  description="A whopping ~180k icons in total across +150 different packs, integrated with your theme color and sizes, tree-shakeable, from icones.js.org."
                  after="+150"
                />

                <Row
                  title="Fonts"
                  description="All of Google fonts, more than +1500 font packages."
                  after="+1500"
                />

                <Row
                  title="Themes"
                  description="Two all new theme - Pastel and Neon - that bring a muted or more bright feel."
                  after="03"
                />

                <Row
                  title="CI / CD"
                  description="Lint, fix, tests, and deploys - all set up from day 1."
                  after="05"
                />

                <Row
                  title="Native"
                  description="Tamagui native components like Sheet and Toast pre-configured, saving you setup and build."
                  after="03"
                />

                <Row
                  title="Form"
                  description="Universal forms with react-hook-form, ts-form and zod, adaptable components for the most native look on web and native."
                  after="01"
                />

                <Row
                  title="Image Upload"
                  description="Component and utilities for uploading images that adapt to the native image picker. Avatar upload with Supabase Storage + RLS included."
                  after="01"
                />
              </YStack>

              <Spacer f={1} minHeight={120} />
            </YStack>
          </ScrollView>
        </TakeoutCardFrame>
      </ThemeTint>
    </div>
  )
})

function PurchaseButton(props: ButtonProps) {
  return (
    <ThemeTint>
      <Button
        size="$6"
        backgroundColor="$color9"
        borderWidth={2}
        borderColor="$color10"
        hoverStyle={{
          backgroundColor: '$color10',
        }}
        pressStyle={{
          backgroundColor: '$color7',
        }}
        {...props}
      >
        <Button.Text ff="$silkscreen" fontWeight="700">
          {props.children}
        </Button.Text>
      </Button>
    </ThemeTint>
  )
}

const Row = (props: { title: any; description: any; after: any }) => {
  const media = useMedia()
  const [showDetail, setShowDetail] = useState(false)

  return (
    <XStack
      bbw={1}
      boc="$borderColor"
      px="$8"
      mx="$-8"
      onPress={() => {
        if (media.md) {
          setShowDetail((x) => !x)
        }
      }}
      $md={{
        cursor: 'pointer',
        // @ts-ignore
        hoverStyle: {
          backgroundColor: 'var(--color2)',
        },
      }}
    >
      <YStack f={1} py="$3" space="$1">
        <MunroP size="$7">{props.title}</MunroP>
        <Paragraph
          size="$3"
          lh={18}
          color="$color10"
          $md={{
            display: showDetail ? 'flex' : 'none',
          }}
        >
          {props.description}
        </Paragraph>
      </YStack>

      <MunroP my="$4">{props.after}</MunroP>
    </XStack>
  )
}

const TakeoutCardFrame = styled(YStack, {
  boc: '$color3',
  bw: 0.5,
  // br: '$4',
  ov: 'hidden',
})

const TAKEOUT = ({ fontSize = 290, lineHeight = 255, ...props }) => (
  <H1
    className="mix-blend font-outlined"
    userSelect="none"
    color="$backgroundStrong"
    fontFamily="$glusp"
    fontSize={fontSize}
    lineHeight={lineHeight}
    mt={40}
    whiteSpace="nowrap"
    minWidth={970}
    ta="center"
    {...props}
  >
    Take
    <br />
    out
  </H1>
)

TakeoutPage.getLayout = getDefaultLayout

const MunroP = styled(Paragraph, {
  className: 'pixelate',
  fontFamily: '$munro',
})

const tabs = [{ value: '1' }, { value: '2' }, { value: '4' }, { value: '8' }]

const PurchaseSelectTeam = ({
  value: currentTab,
  onValueChange: setCurrentTab,
}: TabsProps) => {
  const [tabRovingState, setTabRovingState] = useState<{
    /**
     * Layout of the Tab user might intend to select (hovering / focusing)
     */
    intentAt: TabLayout | null
    /**
     * Layout of the Tab user selected
     */
    activeAt: TabLayout | null
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabLayout | null
  }>({
    activeAt: null,
    intentAt: null,
    prevActiveAt: null,
  })

  const [idPreset, setIsPreset] = useState(true)

  const handleChangePresetValue = (value: string) => {
    setIsPreset(true)
    setCurrentTab?.(value)
  }

  const setIntentIndicator = (intentAt) =>
    setTabRovingState({ ...tabRovingState, intentAt })
  const setActiveIndicator = (activeAt) =>
    setTabRovingState({
      ...tabRovingState,
      prevActiveAt: tabRovingState.activeAt,
      activeAt,
    })
  const { activeAt, intentAt } = tabRovingState

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  //   const direction = (() => {
  //     if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
  //       return 0
  //     }
  //     return activeAt.x > prevActiveAt.x ? -1 : 1
  //   })()

  //   const enterVariant =
  //     direction === 1 ? 'isLeft' : direction === -1 ? 'isRight' : 'defaultFade'
  //   const exitVariant =
  //     direction === 1 ? 'isRight' : direction === -1 ? 'isLeft' : 'defaultFade'

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  // const usingPresetValues = tabs.find((t) => t.value === currentTab)

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleChangePresetValue}
      orientation="horizontal"
      size="$4"
      flexDirection="column"
      activationMode="manual"
      position="relative"
      p="$2"
      bc="$backgroundStrong"
      als="center"
      br="$3"
    >
      <YStack>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              animation="100ms"
              key="intent-indicator"
              width={intentAt.width}
              height={intentAt.height}
              x={intentAt.x}
              y={intentAt.y}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          <ThemeTint>
            {activeAt && (
              <TabsRovingIndicator
                key="active-indicator"
                isActive
                width={activeAt.width}
                height={activeAt.height}
                x={activeAt.x}
                y={activeAt.y}
              />
            )}
          </ThemeTint>
        </AnimatePresence>

        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="Manage your account"
          space="$2"
          backgroundColor="transparent"
        >
          {tabs.map(({ value }) => (
            <Tabs.Tab
              key={value}
              unstyled
              bc="transparent"
              px="$4"
              value={value}
              onInteraction={handleOnInteraction}
            >
              <Paragraph>{value}</Paragraph>
            </Tabs.Tab>
          ))}
          {idPreset ? (
            <Button
              width={100}
              onPress={() => {
                setCurrentTab?.('10')
                setIsPreset(false)
                setIntentIndicator(null)
                setActiveIndicator(null)
              }}
              bc="transparent"
              borderColor="transparent"
              borderRadius="$2"
              px="$4"
            >
              <Paragraph>Custom</Paragraph>
            </Button>
          ) : (
            <ThemeTint>
              <Input
                backgroundColor="$color7"
                autoFocus
                width={100}
                borderRadius="$2"
                value={currentTab}
                onChangeText={(text) => {
                  if (isNaN(Number(text))) return
                  setActiveIndicator(null)
                  setCurrentTab?.(text)
                }}
              />
            </ThemeTint>
          )}
        </Tabs.List>
      </YStack>
    </Tabs>
  )
}

const TabsRovingIndicator = ({
  isActive,
  ...props
}: { isActive?: boolean } & YStackProps) => {
  return (
    <YStack
      borderRadius="$2"
      position="absolute"
      backgroundColor="$color3"
      animation="quicker"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      opacity={0.7}
      {...(isActive && {
        backgroundColor: '$color6',
        opacity: 1,
      })}
      {...props}
    />
  )
}

const Points = () => (
  <YStack tag="ul" space="$2.5" zi={2} mt="$8" maw={660} ov="hidden">
    <Point>React (web, native, ios) monorepo sharing a single codebase</Point>
    <Point>
      All the important screens: Onboard, Register, Login, Forgot Password, Account,
      Settings, Profile, Edit Profile, Feed
    </Point>
    <Point>SSR, RSC, choose from 3 animation drivers</Point>
    <Point>Complete & fully typed design system</Point>
    <Point>20 icon packs</Point>
    <Point>2 all new theme suites: Pastel & Neon</Point>
    <Point>35 custom fonts</Point>
    <Point>Github template with PR bot for updates</Point>
    <Point>Fully tested CI/CD: unit, integration, web and native</Point>
    <Point>Preview deploys for web, app-store builds with EAS</Point>
  </YStack>
)

export const getStaticProps: GetStaticProps<TakeoutPageProps> = async () => {
  try {
    const query = await supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'universal-starter')
      .single()
    if (query.error) throw query.error
    if (
      !query.data.prices ||
      !Array.isArray(query.data.prices) ||
      query.data.prices.length === 0
    ) {
      throw new Error('No prices are attached to the product.')
    }

    const props: TakeoutPageProps = {
      starter: {
        ...query.data,
        prices: query.data.prices,
      },
    }
    return {
      revalidate: 60,
      props,
    }
  } catch (err) {
    console.error(`Error getting props`, err)
    return {
      props: {},
    }
  }
}

const HeartsRow = () => (
  <XStack space="$12" als="center" spaceDirection="horizontal">
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
  </XStack>
)
