import { ErrorBoundary } from '@components/ErrorBoundary'
import { PoweredByStripeIcon } from '@components/PoweredByStripeIcon'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { getTakeoutPriceInfo } from '@lib/getProductInfo'
import { stripe } from '@lib/stripe'
import type { Database } from '@lib/supabase-types'
import { getArray } from '@lib/supabase-utils'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { getSize } from '@tamagui/get-token'
import { ThemeTint, ThemeTintAlt, useTint } from '@tamagui/logo'
import {
  Check,
  CheckCircle,
  Dot,
  Hammer,
  PlayCircle,
  X,
  XCircle,
} from '@tamagui/lucide-icons'
import { useClientValue } from '@tamagui/use-did-finish-ssr'
import { useUser } from 'hooks/useUser'
import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'
import type Stripe from 'stripe'
import type {
  ButtonProps,
  CheckboxProps,
  FontSizeTokens,
  GetProps,
  RadioGroupItemProps,
  TabLayout,
  TabsProps,
  TabsTabProps,
  ThemeName,
  XStackProps,
  YStackProps,
} from 'tamagui'
import {
  AnimatePresence,
  Button,
  Checkbox,
  Circle,
  Dialog,
  EnsureFlexed,
  H1,
  H2,
  H3,
  H4,
  H6,
  Input,
  Label,
  Paragraph,
  RadioGroup,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  Spacer,
  Stack,
  Tabs,
  Theme,
  Unspaced,
  XStack,
  YStack,
  composeRefs,
  isClient,
  styled,
  useMedia,
  useThemeName,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { BentoTable } from '@components/BentoPurchaseModal'
import { ContainerXL } from '../components/Container'
import { FaqModal } from '../components/FaqModal'
import { Footer } from '../components/Footer'
import { useHoverGlow } from '../components/HoverGlow'
import { LoadCherryBomb, LoadMunro } from '../components/LoadFont'
import { NextLink } from '../components/NextLink'
import { seasons } from '../components/SeasonToggleButton'
import { TakeoutLicense } from '../components/TakeoutLicense'
import { ThemeNameEffect } from '../components/ThemeNameEffect'
import { useTakeoutStore } from '../hooks/useTakeoutStore'
import { TakeoutPolicy } from '../components/TakeoutPolicy'

export default function TakeoutPage({
  starter,
  fontsPack,
  iconsPack,
  bento,
  coupon,
}: TakeoutPageProps) {
  const store = useTakeoutStore()

  return (
    <YStack maw="100%">
      <YStack
        pos="absolute"
        l={0}
        r={0}
        t={-100}
        b={0}
        style={{
          background: 'linear-gradient(var(--color6), var(--color4))',
        }}
        zi={-3}
      />

      <ThemeTintAlt offset={0}>
        <YStack
          pos="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background: 'linear-gradient(10deg, var(--color10), var(--color4))',
          }}
          zi={-3}
        />
      </ThemeTintAlt>

      <ThemeTintAlt offset={0}>
        <YStack
          pos="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background: 'linear-gradient(to bottom, var(--color3) 2%, transparent 20%)',
          }}
          zi={-1}
        />
        <ThemeNameEffect colorKey="$color3" />
      </ThemeTintAlt>

      <ThemeTintAlt offset={1}>
        <YStack
          pos="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background: 'linear-gradient(to right, transparent, var(--color7))',
          }}
          zi={-2}
        />
      </ThemeTintAlt>

      <>
        <NextSeo
          title="🥡 Tamagui Takeout"
          description="Tamagui Takeout React Native Bootstrap Starter Kit"
        />
        <Head>
          <LoadCherryBomb />
          <LoadMunro />
          <script src="https://cdn.paritydeals.com/banner.js" />
          {/* <script
            async
            src="https://cdn.tolt.io/tolt.js"
            data-tolt="df04d39c-a409-4bbf-b68e-2fc0a34cd5a6"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
.parity-banner {
    position: fixed!important;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
`,
            }}
          /> */}
        </Head>
      </>

      <YStack
        pe="none"
        pos="absolute"
        t={-950}
        l="50%"
        x={-300}
        rotate="120deg"
        o={0.01}
        $theme-light={{
          o: 0.12,
        }}
        zi={-1}
      >
        <Image alt="mandala" width={2500} height={2500} src="/takeout/geometric.svg" />
      </YStack>

      {/* <Glow /> */}

      <PurchaseModal
        coupon={coupon}
        starter={starter}
        iconsPack={iconsPack}
        fontsPack={fontsPack}
        bento={bento}
      />
      <FaqModal />
      <AgreementModal />
      <PoliciesModal />

      {/* gradient on the end of the page */}
      <ThemeTint>
        <YStack
          zi={-1}
          fullscreen
          style={{
            background: `linear-gradient(to bottom, transparent, transparent, var(--color3))`,
          }}
        />
      </ThemeTint>

      <YStack>
        <ContainerXL>
          <YStack h={0} mah={0}>
            <YStack position="absolute" t={30} r="10%">
              <PurchaseButton
                onPress={() => {
                  store.showPurchase = true
                }}
                size="$4"
              >
                Purchase
              </PurchaseButton>
            </YStack>

            {coupon && (
              <YStack
                position="absolute"
                $gtXs={{
                  right: '5%',
                  top: 150,
                }}
                $xs={{
                  top: '65vh',
                  left: 0,
                  right: 0,
                  ai: 'center',
                  jc: 'center',
                }}
                zIndex="$5"
              >
                <DiscountText coupon={coupon} />
              </YStack>
            )}

            {/* <PromoVideo /> */}

            <TakeoutHero coupon={coupon} />
          </YStack>

          <XStack
            mt={heroHeight}
            $sm={{ mt: heroHeight - 200 }}
            $xs={{ mt: heroHeight - 250 }}
            space="$10"
            $md={{ fd: 'column' }}
          >
            <XStack
              f={1}
              p="$10"
              mt={20}
              $md={{
                flexDirection: 'column-reverse',
              }}
              $sm={{
                px: '$4',
              }}
              $xxs={{
                px: '$2',
              }}
            >
              <YStack mt={-600} $md={{ mt: 0 }} ml={20} mr={0}>
                <StarterCard product={starter} />
              </YStack>

              <YStack mt={-440} group="takeoutBody" f={1} gap="$5">
                <ThemeTint>
                  <H2
                    className="text-wrap-balance pixelate"
                    ff="$munro"
                    my="$2"
                    pr={200}
                    maw={600}
                    size="$10"
                    color="$color10"
                    $group-takeoutBody-xs={{
                      size: '$9',
                      pr: '8%',
                    }}
                    $group-takeoutBody-xxs={{
                      size: '$8',
                      pr: '$1',
                    }}
                  >
                    From idea to shipped in less time than ever.
                  </H2>
                </ThemeTint>

                <ThemeTintAlt>
                  <Paragraph
                    className="text-wrap-balance"
                    size="$8"
                    $sm={{ size: '$7' }}
                    fow="400"
                  >
                    Takeout is a bootstrap extracted from our experience creating and
                    consulting on apps with Tamagui. It builds off the free and open
                    source starter <CodeInline>(npm&nbsp;create&nbsp;tamagui)</CodeInline>
                    , adding{' '}
                    <a target="_blank" href="https://supabase.com" rel="noreferrer">
                      Supabase
                    </a>{' '}
                    for data and auth, all the flows for a user-based app, and a bunch of
                    other goodies that take time to&nbsp;set&nbsp;up&nbsp;well.
                  </Paragraph>

                  <Paragraph
                    className="text-wrap-balance"
                    size="$7"
                    $sm={{ size: '$6' }}
                    $xs={{ size: '$5' }}
                    fow="400"
                  >
                    With <CodeInline>npx&nbsp;tamagui&nbsp;add&nbsp;font</CodeInline> and{' '}
                    <CodeInline>npx&nbsp;tamagui&nbsp;add&nbsp;icon</CodeInline>, add on
                    the ~1,500{' '}
                    <NextLink href="https://fonts.google.com" target="_blank">
                      Google Fonts
                    </NextLink>{' '}
                    and 120{' '}
                    <NextLink href="https://icones.js.org" target="_blank">
                      icones.js.org
                    </NextLink>{' '}
                    icon packs to your app as typed, Tamagui-styled components.
                  </Paragraph>
                </ThemeTintAlt>

                <Spacer size="$4" />

                <XStack fw="wrap" gap="$3" mx="$-10" ai="center" jc="center">
                  <TakeoutCard
                    theme="orange"
                    title="Monorepo"
                    icon="retro-icons/coding-apps-websites-module-21.svg"
                  >
                    <YStack space="$2">
                      {points.monorepo.map((point, idx, arr) => (
                        <Point
                          key={point}
                          size="$4"
                          mr={arr.length === idx + 1 ? '$10' : undefined}
                        >
                          {point}
                        </Point>
                      ))}
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="yellow"
                    title="Design"
                    icon="retro-icons/design-color-painting-palette-25.svg"
                  >
                    <YStack space="$2">
                      {points.design.map((point, idx, arr) => (
                        <Point
                          key={point}
                          size="$4"
                          mr={arr.length === idx + 1 ? '$10' : undefined}
                        >
                          {point}
                        </Point>
                      ))}
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="green"
                    title="Deploy"
                    icon="retro-icons/computers-devices-electronics-vintage-mac-54.svg"
                  >
                    <YStack space="$2">
                      {points.deploy.map((point, idx, arr) => (
                        <Point
                          key={point}
                          size="$4"
                          mr={arr.length === idx + 1 ? '$10' : undefined}
                        >
                          {point}
                        </Point>
                      ))}
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="blue"
                    title="Screens"
                    icon="retro-icons/coding-app-website-ui-62.svg"
                  >
                    <YStack space="$2">
                      {points.screens.map((point, idx, arr) => (
                        <Point
                          key={point}
                          size="$4"
                          mr={arr.length === idx + 1 ? '$10' : undefined}
                        >
                          {point}
                        </Point>
                      ))}
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="purple"
                    title="Assets"
                    icon="retro-icons/coding-apps-websites-plugin-33.svg"
                  >
                    <YStack space="$2">
                      {points.assets.map((point, idx, arr) => (
                        <Point
                          key={point}
                          size="$4"
                          mr={arr.length === idx + 1 ? '$10' : undefined}
                        >
                          {point}
                        </Point>
                      ))}
                    </YStack>
                  </TakeoutCard>
                  <TakeoutCard
                    theme="pink"
                    title="& More"
                    icon="retro-icons/coding-apps-websites-programming-hold-code-9.svg"
                  >
                    <YStack space="$2">
                      {points.more.map((point, idx, arr) => (
                        <Point
                          key={point}
                          size="$4"
                          mr={arr.length === idx + 1 ? '$10' : undefined}
                        >
                          {point}
                        </Point>
                      ))}
                    </YStack>
                  </TakeoutCard>
                </XStack>

                <Spacer />

                <YStack
                  className="phone-preview"
                  marginTop={-580}
                  marginBottom={-530}
                  x={700}
                  zi={-1}
                  style={{
                    mixBlendMode: 'lighten',
                  }}
                >
                  <div
                    style={{
                      transform: 'rotateX(41deg) rotateZ(33deg)',
                      transformStyle: 'preserve-3d',
                      width: 715 * 0.75,
                      borderRadius: 78,
                      boxShadow: '0 0 30px 40px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Image
                      alt="iPhone screenshot of Tamagui"
                      src="/tama-phone.svg"
                      width={715 * 0.75}
                      height={1467 * 0.75}
                    />
                  </div>
                </YStack>
                <ThemeTint>
                  <YStack
                    p="$6"
                    className="blur-medium"
                    px="$8"
                    py="$8"
                    gap="$5"
                    br="$10"
                    $sm={{
                      px: '$4',
                      mx: '$-4',
                    }}
                  >
                    <YStack pe="none" br="$10" zi={-1} fullscreen bg="$color6" o={0.2} />
                    <YStack pe="none" br="$10" zi={-1} fullscreen bg="$color" o={0.1} />
                    <YStack
                      pos="absolute"
                      t={-400}
                      o={0.2}
                      r={-400}
                      pe="none"
                      w={1000}
                      h={1000}
                      scale={1.5}
                      style={{
                        background: 'radial-gradient(var(--color9), transparent 70%)',
                        mixBlendMode: 'color-dodge',
                      }}
                    />

                    <ThemeTint>
                      <Paragraph
                        fontFamily="$silkscreen"
                        size="$9"
                        color="$color1"
                        ls={-2}
                        fow="400"
                        bg="$color12"
                        als="center"
                        px="$2"
                        mt={-55}
                        mb={10}
                      >
                        it's not all about shipping&nbsp;fast.
                      </Paragraph>
                    </ThemeTint>

                    <Paragraph size="$7" $sm={{ size: '$6' }} fow="400">
                      Takeout is a template repo that comes with a Github bot that sends
                      PRs as we improve the starter. This is done with some git magic,
                      scripting, and an architecture designed for easy merges. When we
                      make significant updates, we trigger TakeoutBot to
                      send&nbsp;a&nbsp;PR.
                    </Paragraph>

                    <Paragraph size="$7" $sm={{ size: '$6' }} fow="400">
                      As you diverge we can't be perfect at sending updates, but we also
                      have an ignorefile you can configure that gives you a lot of
                      control. Ultimately, if you diverge enough, then turn the automatic
                      PRs off at no cost.
                    </Paragraph>

                    <ThemeTintAlt>
                      <Paragraph size="$7" $sm={{ size: '$6' }} fow="400">
                        It's like having a developer updating dependencies, improving DX
                        and ensuring everything works before upgrading major versions in
                        more thoughful PRs than a typical bot. Here's a rough working
                        roadmap:
                      </Paragraph>
                    </ThemeTintAlt>

                    <ThemeTintAlt>
                      <XStack tag="ul" fw="wrap" gap="$5" my="$4">
                        <Bullet status="done">Storybook</Bullet>
                        <Bullet status="done">tRPC</Bullet>
                        <Bullet status="done">Apple & Google OAuth</Bullet>
                        <Bullet status="done">Screens + Components generators</Bullet>
                        <Bullet status="done">Reanimated</Bullet>
                        <Bullet status="building">Notifications</Bullet>
                        <Bullet status="building">Maestro integration tests</Bullet>
                        <Bullet status="building">Layout animations</Bullet>
                        <Bullet status="building">Tamagui CLI: Doctor</Bullet>
                        <Bullet status="building">Tamagui CLI: Upgrade</Bullet>
                        <Bullet>Playwright integration tests</Bullet>
                        <Bullet>Alternative deployment targets</Bullet>
                        <Bullet>Premium font add-ons</Bullet>
                        <Bullet>Unified RN and web testing tools</Bullet>
                        <Bullet>Improved CI/CD and caching</Bullet>
                        <Bullet>Generator for MDX support</Bullet>
                        <Bullet>Generator for Replicache support</Bullet>
                        <Bullet>Generator for other databases</Bullet>
                        <Bullet>Generators for Expo Deep links</Bullet>
                        <Bullet>Generator for native modules</Bullet>
                        <Bullet>Million.js opt-in and configuration</Bullet>
                        <Bullet>Virtual lists, swipeable + sorting</Bullet>
                        <Bullet>Native menus with Zeego</Bullet>
                        <Bullet>Much more (suggest in the #takeout channel)</Bullet>
                      </XStack>
                    </ThemeTintAlt>

                    <Spacer />
                  </YStack>
                </ThemeTint>

                <Spacer />

                <YStack br="$12" elevation="$4" bg="rgba(0,0,0,0.8)" p="$7" gap="$3">
                  <ThemeTint>
                    <Paragraph als="center" col="#fff" fontFamily="$munro" size="$10">
                      Gallery
                    </Paragraph>
                  </ThemeTint>

                  <Spacer />

                  <YStack mih={530}>
                    <Lazy>
                      <TakeoutGallery />
                    </Lazy>
                  </YStack>
                </YStack>

                <Spacer />

                <Spacer size="$10" />
              </YStack>
            </XStack>

            <YStack mt={200} w={3} mih={500} h="100%" $sm={{ display: 'none' }} />
          </XStack>
          <Footer />
        </ContainerXL>
      </YStack>
    </YStack>
  )
}

const CodeInline = styled(Paragraph, {
  tag: 'code',
  fontFamily: '$mono',
  color: '$color12',
  backgroundColor: 'color-mix(in srgb, var(--color8) 50%, transparent 50%)' as any,
  cursor: 'inherit',
  br: '$3',
  // @ts-ignore
  fontSize: '85%',
  p: '$1.5',
})

const checkCircle = <CheckCircle color="$green9" />
const xCircle = <XCircle size={28} color="$red9" />

const points = {
  // this one's only shown on modal
  monorepo: [
    'Well-isolated configuration.',
    'Nearly all code shared between web and native.',
    'Guided setup script, easily generate common patterns.',
  ],
  design: [
    'Complete design system with the new ThemeBuilder for easy customization.',
    'Two new theme packs - Neon and Pastel.',
  ],
  deploy: [
    'Vercel + Preview Deploys.',
    'Expo EAS + Expo Router.',
    'Script that sets up both local and remote dev environments.',
  ],
  screens: [
    'Variety of screen types adapted to each platform.',
    'Onboarding, auth, account, settings, profile, feed, edit profile.',
    'Universal forms + zod validation.',
  ],
  assets: [
    '+150 icon packs, adapted to use themes, sizing, and tree shaking.',
    'All of Google fonts, over +1500 packs.',
  ],
  more: [
    'Image upload and Supabase utils.',
    'Reanimated, Solito, React Query, Zod & more',
    'TakeoutBot ongoing updates.',
    'Private Discord.',
  ],
}

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
const TakeoutGallery = dynamic(() => import('../components/TakeoutGallery'), {
  ssr: false,
})

const heroHeight = 1100

type TakeoutPageProps = {
  starter?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  iconsPack?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  fontsPack?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  bento?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  coupon?: Stripe.Coupon | null
}

const TakeoutCard2Frame = styled(YStack, {
  className: 'blur-8',
  minWidth: 282,
  maxWidth: 282,
  minHeight: 312,
  maxHeight: 312,
  elevation: '$1',
  overflow: 'hidden',
  borderRadius: '$10',

  '$group-takeoutBody-gtXs': {
    scale: 0.915,
    m: -12,
  },

  variants: {
    size: {
      '...size': (val) => ({
        p: val as any,
        br: val as any,
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
  const isDark = useThemeName().startsWith('dark')
  const innerGlow = useHoverGlow({
    resist: 30,
    size: 300,
    strategy: 'blur',
    blurPct: 60,
    // inverse: true,
    color: isDark ? 'var(--color9)' : 'var(--color4)',
    opacity: isDark ? 0.18 : 1,
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
      <TakeoutCard2Frame
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

        <YStack f={1} space zi={100}>
          <H2 color="$color10" fontFamily="$munro" size="$10" my={-8}>
            {title}
          </H2>
          {children}

          {!!icon && (
            <YStack pos="absolute" b={0} r={0}>
              <Image className="pixelate" src={icon} alt="Icon" width={32} height={32} />
            </YStack>
          )}
        </YStack>
      </TakeoutCard2Frame>
    </>
  )
}

const TakeoutHero = ({ coupon }: Pick<TakeoutPageProps, 'coupon'>) => {
  const enable3d = useClientValue(
    () => !isSafariMobile && !window.location.search?.includes('disable-3d')
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
      y={heroHeight / 2 - 500}
      ai="center"
      jc="center"
      className="ease-in ms300 all"
      pe="none"
      pos="relative"
      scale={1}
      $xxs={{
        scale: 0.35,
      }}
      $xs={{
        scale: 0.45,
        y: 0,
      }}
      $sm={{
        scale: 0.65,
        y: 0,
      }}
      $md={{
        scale: 0.85,
        y: '20%',
      }}
      // ref={glow.parentRef as any}
    >
      {/* <ThemeTint>
        <glow.Component />
      </ThemeTint> */}

      {/* animated borders shine */}
      {/* super expensive chrome gpu :/ */}
      {/* <YStack pos="absolute" y={0} zi={100}>
        <ThemeTintAlt>
          <TAKEOUT className="theme-shadow clip-slice" color="transparent" />
        </ThemeTintAlt>
      </YStack> */}

      <TakeoutLogo />

      <YStack
        position="absolute"
        pe="none"
        top={300}
        r="-5%"
        $lg={{ r: '-15%' }}
        $md={{ r: '-50%' }}
        $sm={{ r: '-90%' }}
        zIndex={-1}
      >
        {enable3d && (
          <Suspense fallback={null}>
            <ErrorBoundary noMessage>
              <TakeoutBox3D />
            </ErrorBoundary>
          </Suspense>
        )}
      </YStack>

      <XStack
        zi={1000}
        my={21}
        bottom={-100}
        pos="absolute"
        gap={50}
        f={1}
        alignSelf="center"
        jc="space-between"
        className="mix-blend"
        pe="auto"
        $sm={{
          dsp: 'none',
        }}
      >
        <FeatureIcon
          themeIndex={0}
          title="Monorepo"
          icon="retro-icons/coding-apps-websites-module-21.svg"
        />

        <FeatureIcon
          themeIndex={1}
          title="Design"
          icon="retro-icons/design-color-painting-palette-25.svg"
        />

        <FeatureIcon
          themeIndex={2}
          title="Deploy"
          icon="retro-icons/computers-devices-electronics-vintage-mac-54.svg"
        />

        <FeatureIcon
          themeIndex={3}
          title="Themes"
          icon="retro-icons/design-color-bucket-brush-63.svg"
        />

        <FeatureIcon
          themeIndex={4}
          title="Screens"
          icon="retro-icons/coding-app-website-ui-62.svg"
        />

        <FeatureIcon
          themeIndex={5}
          title="Assets"
          icon="retro-icons/coding-apps-websites-plugin-33.svg"
        />

        <FeatureIcon
          themeIndex={6}
          title="& More"
          icon="retro-icons/coding-apps-websites-programming-hold-code-9.svg"
        />
      </XStack>
    </YStack>
  )
}

const TakeoutLogo = () => {
  const disableMotion = useDisableMotion()

  return (
    <>
      <YStack
        pos="absolute"
        style={{
          clipPath: `polygon(0% 0%, 0% 0%, 100% 100%, 100% 0%, 100% 0, 0% 100%)`,
        }}
      >
        <ThemeTint>
          <TAKEOUT className="text-3d" zi={1000} color="$color10" />
        </ThemeTint>
      </YStack>

      <YStack
        mt={0}
        zi={0}
        className="mix-blend"
        style={{
          clipPath: `polygon(0% 0%, 0% 100%, 100% 100%, 0% 0%, 100% 0, 0% 100%)`,
        }}
      >
        <ThemeTintAlt>
          <TAKEOUT className="font-outlined" zi={1000} color="var(--color8)" />
        </ThemeTintAlt>

        {!disableMotion && (
          <>
            <ThemeTint>
              {/* main color slices */}
              <TAKEOUT
                color="$color7"
                className="clip-slice mix-blend"
                pos="absolute"
                o={1}
                zi={1001}
              />
            </ThemeTint>
            {/* alt color slices */}
            <ThemeTintAlt>
              <TAKEOUT
                color="$color7"
                className="clip-slice mix-blend slice-alt"
                pos="absolute"
                o={1}
                zi={1002}
              />
            </ThemeTintAlt>
          </>
        )}
      </YStack>
    </>
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

const Point = ({
  size = '$4',
  children,
  subtitle,
  ...props
}: XStackProps & {
  children: any
  subtitle?: any
  size?: FontSizeTokens
}) => {
  return (
    <XStack tag="li" ai="flex-start" space f={1} ov="hidden" {...props}>
      <YStack py="$1.5">
        <Check size={16} color="$color10" />
      </YStack>
      <YStack f={1}>
        <Paragraph color="$color" wordWrap="break-word" size={size}>
          {children}
        </Paragraph>
        {!!subtitle && (
          <Paragraph
            size={
              getSize(size, {
                shift: -2,
              }) as any
            }
            color="$color"
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
  p: '$2',
  bg: 'rgba(255, 255, 255, 0.035)',
})

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

const PurchaseModal = ({
  starter,
  iconsPack,
  fontsPack,
  bento,
  coupon,
}: TakeoutPageProps) => {
  const products = [starter, iconsPack, fontsPack]
  // const prices = products.prices
  const store = useTakeoutStore()
  // const [selectedPriceId, setSelectedPriceId] = useState(prices[prices.length - 1].id)
  const [selectedProductsIds, setSelectedProductsIds] = useState<string[]>(
    products.filter(Boolean).map((p) => p!.id)
  )
  const sortedStarterPrices = (starter?.prices ?? []).sort(
    (a, b) => a.unit_amount! - b.unit_amount!
  )
  const sortedBentoPrices = (bento?.prices ?? []).sort(
    (a, b) => a.unit_amount! - b.unit_amount!
  )
  const [starterPriceId, setStarterPriceId] = useState(sortedStarterPrices[0]?.id)
  const [bentoPriceId, setBentoPriceId] = useState(sortedBentoPrices[0]?.id)
  // const selectedProducts = products.filter((p) => selectedProductsIds.includes(p.id))
  const { data } = useUser()
  const subscriptions = data?.subscriptions
  // const subscription = subscriptions?.find((sub) => {
  //   if (sub.status !== 'active') return false
  //   const price = sub.prices
  //     ? Array.isArray(sub.prices)
  //       ? sub.prices[0]
  //       : sub.prices
  //     : null
  //   if (!price) return false
  //   return price.product_id === products.id
  // })
  // const sortedPrices = prices.sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0))

  const sum = useMemo(() => {
    if (!starter || !iconsPack || !fontsPack) {
      return 0
    }
    let final = 0
    if (selectedProductsIds.includes(starter.id)) {
      final += starterPriceId
        ? starter.prices.find((p) => p.id === starterPriceId)?.unit_amount ?? 0
        : 0
    }
    if (selectedProductsIds.includes(iconsPack.id)) {
      final += iconsPack.prices[0].unit_amount ?? 0
    }
    if (selectedProductsIds.includes(fontsPack.id)) {
      final += fontsPack.prices[0].unit_amount ?? 0
    }
    if (bento && selectedProductsIds.includes(bento.id)) {
      final += bentoPriceId
        ? bento.prices.find((p) => p.id === bentoPriceId)?.unit_amount ?? 0
        : 0
    }
    return final
  }, [selectedProductsIds, starterPriceId, bentoPriceId, starter, iconsPack, fontsPack])

  // with discount applied
  const finalPrice = useMemo(() => {
    const appliedCoupon = store.appliedCoupon ?? coupon
    if (appliedCoupon) {
      if (appliedCoupon.amount_off) return sum - appliedCoupon.amount_off
      if (appliedCoupon.percent_off)
        return (sum * (100 - appliedCoupon.percent_off)) / 100
    }

    return sum
  }, [sum, store.appliedCoupon, coupon])
  const hasDiscountApplied = finalPrice !== sum

  const noProductSelected = selectedProductsIds.length === 0
  const showTeamSelect = selectedProductsIds.includes(starter?.id || '')

  const enable3d = useClientValue(
    () => !isSafariMobile && !window.location.search?.includes('disable-3d')
  )

  return (
    <Dialog
      modal
      open={store.showPurchase}
      onOpenChange={(val) => {
        store.showPurchase = val
      }}
    >
      <Dialog.Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame padding={0} gap>
            <Sheet.ScrollView>
              <Dialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Dialog.Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="medium"
          className="blur-medium"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          theme="surface1"
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
          // animateOnly={['transform']}
          enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
          exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}
          w="90%"
          maw={900}
          p={0}
        >
          <ScrollView $gtSm={{ maxHeight: '90vh' }}>
            <YStack group="takeoutBody" p="$6" space>
              <XStack ai="center" jc="center" gap="$6" mx="$8">
                <Dialog.Title
                  ff="$silkscreen"
                  size="$7"
                  mt="$-3"
                  ls={5}
                  als="center"
                  theme="alt2"
                >
                  Checkout
                </Dialog.Title>
              </XStack>

              {process.env.NEXT_PUBLIC_IS_TAMAGUI_DEV && (
                <YStack my="$2">
                  <YStack gap="$4" $gtSm={{ fd: 'row' }} flexWrap="wrap">
                    <CheckboxGroupItem
                      disabled
                      onCheckedChange={() => {
                        if (!starter) return
                        const active = selectedProductsIds.includes(starter.id)
                        setSelectedProductsIds(
                          active
                            ? selectedProductsIds.filter((id) => id !== starter.id)
                            : [...selectedProductsIds, starter.id]
                        )
                      }}
                      id={'takeout-starter'}
                      checked={starter && selectedProductsIds.includes(starter.id)}
                    >
                      <H3 lh="$6">{starter?.name}</H3>
                      <Paragraph size="$3" lh="$1" theme="alt2">
                        {starter?.description}
                      </Paragraph>
                    </CheckboxGroupItem>
                    <CheckboxGroupItem
                      onCheckedChange={() => {
                        if (!bento) return
                        const active = selectedProductsIds.includes(bento.id)
                        setSelectedProductsIds(
                          active
                            ? selectedProductsIds.filter((id) => id !== bento.id)
                            : [...selectedProductsIds, bento.id]
                        )
                      }}
                      id={'takeout-bento'}
                      checked={bento && selectedProductsIds.includes(bento.id)}
                    >
                      <H3 lh="$6">{bento?.name}</H3>
                      <Paragraph size="$3" lh="$1" theme="alt2">
                        {bento?.description}
                      </Paragraph>
                    </CheckboxGroupItem>
                  </YStack>
                </YStack>
              )}

              <XStack
                f={1}
                space
                separator={<Separator vertical />}
                $group-takeoutBody-sm={{ fd: 'column-reverse' }}
              >
                <YStack
                  f={1}
                  maw="50%"
                  $group-takeoutBody-sm={{
                    maw: '100%',
                  }}
                >
                  <EnsureFlexed />

                  <YStack gap="$4">
                    <YStack gap="$2">
                      <H6
                        o={bento && selectedProductsIds.includes(bento.id) ? 1 : 0}
                        animation="100ms"
                      >
                        {starter?.name}
                      </H6>
                      <TakeoutTable product={starter} selectedPriceId={starterPriceId} />
                      <XStack
                        mt="$2"
                        theme="green"
                        bg="$background"
                        p="$4"
                        bw={1}
                        bc="$color5"
                        br="$4"
                        gap="$3"
                      >
                        <Check size={24} mt={2} color="$color9" />
                        <MunroP size="$7" color="$color11">
                          Every plan includes the starter, icons & fonts
                        </MunroP>
                      </XStack>
                    </YStack>

                    {bento && selectedProductsIds.includes(bento.id) && (
                      <YStack
                        gap="$2"
                        animation="100ms"
                        o={1}
                        enterStyle={{ o: 0 }}
                        exitStyle={{ o: 0 }}
                      >
                        <H6>{bento?.name}</H6>

                        <BentoTable product={bento} selectedPriceId={bentoPriceId} />
                      </YStack>
                    )}
                  </YStack>

                  <YStack mt="$6" space="$4" ai="center">
                    <Paragraph size="$3" theme="alt1">
                      Instant one-click cancel your subscription from /account
                    </Paragraph>
                  </YStack>
                </YStack>

                <YStack f={2} space="$4">
                  <YStack
                    opacity={showTeamSelect ? 1 : 0.25}
                    pointerEvents={showTeamSelect ? 'auto' : 'none'}
                    gap="$3"
                  >
                    <YStack gap="$2">
                      <H6
                        o={bento && selectedProductsIds.includes(bento.id) ? 1 : 0}
                        animation="100ms"
                      >
                        {starter?.name}
                      </H6>
                      <RadioGroup
                        gap="$2"
                        value={starterPriceId}
                        onValueChange={(val) => setStarterPriceId(val)}
                      >
                        {sortedStarterPrices.map((price) => {
                          const active = starterPriceId === price.id
                          const htmlId = `price-${price.id}`
                          return (
                            <RadioGroupItem active={active} value={price.id} id={htmlId}>
                              <H4 mt="$-1">
                                {price.description === 'Unlimited (+9 seats)'
                                  ? 'Pro'
                                  : price.description === 'Hobby (3-8 seats)'
                                    ? 'Team'
                                    : 'Personal'}
                              </H4>

                              <Paragraph theme="alt2">
                                {formatPrice(price.unit_amount! / 100, 'usd')} base + 1
                                year of updates
                              </Paragraph>
                              {/* <Paragraph theme="alt1" size="$2">
                                  {formatPrice(price.unit_amount! / (100 * 2), 'usd')}{' '}
                                  annual renewal (cancel anytime)
                                </Paragraph> */}
                            </RadioGroupItem>
                          )
                        })}
                      </RadioGroup>
                    </YStack>
                    <AnimatePresence>
                      {bento && selectedProductsIds.includes(bento.id) && (
                        <YStack
                          gap="$2"
                          o={1}
                          enterStyle={{ o: 0 }}
                          exitStyle={{ o: 0 }}
                          animation="100ms"
                        >
                          <H6>{bento.name}</H6>

                          <RadioGroup
                            gap="$2"
                            value={bentoPriceId}
                            onValueChange={(val) => setBentoPriceId(val)}
                          >
                            {sortedBentoPrices.map((price) => {
                              const active = bentoPriceId === price.id
                              const htmlId = `price-${price.id}`
                              return (
                                <RadioGroupItem
                                  key={price.id}
                                  active={active}
                                  value={price.id}
                                  id={htmlId}
                                >
                                  <H4 mt="$-1">{price.description}</H4>

                                  <Paragraph theme="alt2">
                                    {formatPrice(price.unit_amount! / 100, 'usd')} base +
                                    1 year of updates
                                  </Paragraph>
                                  {/* <Paragraph theme="alt1" size="$2">
                                  {formatPrice(price.unit_amount! / (100 * 2), 'usd')}{' '}
                                  annual renewal (cancel anytime)
                                </Paragraph> */}
                                </RadioGroupItem>
                              )
                            })}
                          </RadioGroup>
                        </YStack>
                      )}
                    </AnimatePresence>
                  </YStack>

                  <Spacer size="$1" />

                  <YStack space>
                    <XStack ai="flex-end" jc="flex-end" gap="$2">
                      {hasDiscountApplied ? (
                        <>
                          <H3 textDecorationLine="line-through" size="$4" theme="alt2">
                            {formatPrice(sum! / 100, 'usd')}
                          </H3>
                          <H3 size="$11">{formatPrice(finalPrice! / 100, 'usd')}</H3>
                        </>
                      ) : (
                        <H3 size="$11">{formatPrice(finalPrice! / 100, 'usd')}</H3>
                      )}
                    </XStack>

                    <Unspaced>
                      <YStack mt="$2">
                        <PromotionInput />
                      </YStack>
                    </Unspaced>

                    <YStack pb="$8" px="$4" space>
                      <NextLink
                        href={`api/checkout?${(() => {
                          const params = new URLSearchParams({
                            // product_id: products.id,
                            // price_id: selectedPriceId,
                            // quantity: seats.toString(),
                          })
                          for (const productId of selectedProductsIds) {
                            params.append('product_id', productId)
                          }
                          params.append(`price-${starter?.id}`, starterPriceId)
                          if (store.appliedPromoCode) {
                            // the coupon user applied
                            params.append(`promotion_code`, store.appliedPromoCode)
                          } else if (coupon) {
                            // the coupon that's applied by default (special event, etc.)
                            params.append(`coupon_id`, coupon.id)
                          }

                          return params.toString()
                        })()}`}
                      >
                        <PurchaseButton
                          disabled={noProductSelected}
                          opacity={noProductSelected ? 0.5 : undefined}
                        >
                          Purchase
                        </PurchaseButton>
                      </NextLink>
                      <XStack jc="space-between" space="$2" ai="center" mb="$2">
                        <XStack
                          ai="center"
                          separator={<Separator vertical bg="$color8" my="$2" />}
                          space="$2"
                        >
                          <SizableText
                            theme="alt1"
                            cursor="pointer"
                            onPress={() => {
                              store.showFaq = true
                            }}
                            style={{ textDecorationLine: 'underline' }}
                            hoverStyle={{
                              color: '$color11',
                            }}
                            size="$2"
                          >
                            FAQ
                          </SizableText>

                          <SizableText
                            theme="alt1"
                            cursor="pointer"
                            onPress={() => {
                              store.showAgreement = true
                            }}
                            style={{ textDecorationLine: 'underline' }}
                            hoverStyle={{
                              color: '$color11',
                            }}
                            size="$2"
                          >
                            License
                          </SizableText>

                          <SizableText
                            theme="alt1"
                            cursor="pointer"
                            onPress={() => {
                              store.showPolicies = true
                            }}
                            style={{ textDecorationLine: 'underline' }}
                            hoverStyle={{
                              color: '$color11',
                            }}
                            size="$2"
                          >
                            Policies
                          </SizableText>
                        </XStack>
                        <Theme name="alt1">
                          <PoweredByStripeIcon width={96} height={40} />
                        </Theme>
                      </XStack>
                    </YStack>
                  </YStack>
                </YStack>
              </XStack>
            </YStack>
          </ScrollView>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$4"
                right="$4"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
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

  const { name } = useTint()

  return (
    <div ref={setRef}>
      {name !== 'tamagui' && (
        <SizableText
          size="$11"
          h={200}
          rotate="-8deg"
          als="center"
          zi={100}
          pos="absolute"
          t={-10}
          pe="none"
        >
          {seasons[name]}
        </SizableText>
      )}

      <ThemeTintAlt offset={6}>
        <TakeoutCardFrame
          className="blur-medium"
          zi={100_000}
          maw={310}
          als="center"
          shadowRadius={30}
          shadowOffset={{ height: 20, width: 0 }}
          shadowColor="$shadowColor"
          x={-50}
          y={50}
          mah="calc(min(85vh, 800px))"
          br="$8"
          $md={{
            x: -20,
            y: 0,
            // mb: 280,
            mah: 'auto',
            w: '100%',
            maw: '100%',
            mt: 100,
          }}
        >
          <YStack zi={-1} fullscreen bg="$color5" o={0.5} />

          <ThemeTintAlt>
            <LinearGradient
              pos="absolute"
              b={0}
              l={0}
              r={0}
              h={200}
              colors={['$background0', '$color5']}
              zi={100}
            />
          </ThemeTintAlt>

          <YStack pos="absolute" b="$4" l="$4" r="$4" zi={100}>
            {/* cant use buttonlink it breaks scroll on press if not enabled, conditionally use a link */}
            {/* subscription ? `/account/items#${subscription.id}` : '' */}
            <PurchaseButton
              onPress={() => {
                store.showPurchase = true
              }}
            >
              Purchase
            </PurchaseButton>
          </YStack>

          <ScrollView p="$6" disabled={media.md} showsVerticalScrollIndicator={false}>
            <YStack space="$2">
              <MunroP size="$3" o={0.1} mt={-15} mb={-5}>
                Drop 0001
              </MunroP>

              <ThemeTintAlt>
                <MunroP color="$color10" size="$11" ls={2}>
                  The Stack
                </MunroP>
              </ThemeTintAlt>

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
                  description="Tab bar, Stack view, Onboarding, Auth, Profile, Edit Profile, Account, Settings, Feed + more, well crafted layouts to adapt to web/native."
                  after="08"
                />

                <Row
                  title="Data & Auth"
                  description="Supabase pre-configured with migrations, email and OAuth (Google + Apple) authentication, utilities, automatic setup and everything to get rolling immediately."
                  after="01"
                />

                <Row
                  title="RPC"
                  description="We've set up tRPC, which you can optionally use, that works alongside Zod to provide easy, type-safe APIs."
                  after="01"
                />

                <Row
                  title="Icons"
                  description="~180k icons in total across +150 different packs, integrated with your theme color and sizes, tree-shakeable, from iconify.design"
                  after="+150"
                />

                <Row
                  title="Fonts"
                  description="All of Google fonts, more than +1500 font packages."
                  after="+1500"
                />

                <Row
                  title="Themes"
                  description="Two all new themes - Pastel and Neon - that bring a muted or more bright feel."
                  after="03"
                />

                <Row
                  title="Deploy"
                  description="Vercel and Expo EAS configured for you to ship as fast as possible."
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
      </ThemeTintAlt>
    </div>
  )
})

function PurchaseButton(props: ButtonProps) {
  return (
    <ThemeTintAlt>
      <Button size="$6" borderWidth={2} bc="$color8" {...props}>
        <Button.Text ff="$silkscreen">{props.children} 🥡</Button.Text>
      </Button>
    </ThemeTintAlt>
  )
}

const Row = (props: { title: any; description: any; after: any }) => {
  const media = useMedia()
  const [showDetail, setShowDetail] = useState(false)

  return (
    <XStack
      px="$8"
      mx="$-8"
      onPress={() => {
        if (media.md) {
          setShowDetail((x) => !x)
        }
      }}
      $md={{
        cursor: 'pointer',
        // TODO ?
        // @ts-ignore
        hoverStyle: {
          backgroundColor: 'var(--color4)',
        },
      }}
    >
      <YStack f={1} py="$3" space="$1">
        <Paragraph fontFamily="$munro" tt="uppercase" ls={4} size="$4">
          {props.title}
        </Paragraph>
        <Paragraph
          size="$3"
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
  bc: '$color3',
  br: '$4',
  ov: 'hidden',
})

const TAKEOUT = ({ fontSize = 450, lineHeight = fontSize * 0.64, ...props }) => (
  <H1
    userSelect="none"
    color="transparent"
    fontFamily="$cherryBomb"
    fontSize={fontSize}
    lineHeight={lineHeight}
    whiteSpace="nowrap"
    minWidth={970}
    ta="center"
    {...props}
  >
    Take
    <br />
    <span style={{ display: 'inline-flex', transform: 'translateY(-65px)' }}>out</span>
  </H1>
)

TakeoutPage.getLayout = getDefaultLayout

const MunroP = styled(Paragraph, {
  // className: 'pixelate',
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
      bg="$background"
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
                  if (Number.isNaN(Number(text))) return
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
  <YStack tag="ul" gap="$1.5" zi={2} ov="hidden">
    {/* <Point>React (web, native, ios) monorepo sharing a single codebase</Point>
    <Point>
      All the important screens: Onboard, Register, Login, Forgot Password, Account,
      Settings, Profile, Edit Profile, Feed
    </Point>
    <Point>SSR, RSC, choose from 3 animation drivers</Point> 
    <Point>Complete & fully typed design system</Point>
    <Point>+150 icon packs</Point>
    <Point>2 all new theme suites: Pastel & Neon</Point>
    <Point>All of Google fonts fonts</Point>
    <Point>Github template with PR bot for updates</Point>
    <Point>Fully tested CI/CD: unit, integration, web and native</Point>
    <Point>Preview deploys for web, app-store builds with EAS</Point> */}
    {Object.entries(points).map(([key, group]) => (
      <React.Fragment key={key}>
        {group.map((point) => (
          <Point key={point}>{point}</Point>
        ))}
      </React.Fragment>
    ))}
  </YStack>
)

const HeartsRow = () => (
  <XStack space="$12" my="$4" als="center" spaceDirection="horizontal">
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
  </XStack>
)

const AgreementModal = () => {
  const store = useTakeoutStore()
  return (
    <Dialog
      modal
      open={store.showAgreement}
      onOpenChange={(val) => {
        store.showAgreement = val
      }}
    >
      <Dialog.Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Sheet.ScrollView>
              <Dialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Dialog.Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="medium"
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
          enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
          exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}
          w="90%"
          maw={900}
        >
          <ScrollView>
            <YStack $gtSm={{ maxHeight: '90vh' }} space>
              <Paragraph>
                <Link href="/takeout-license">Permalink to the license</Link>.
              </Paragraph>

              <TakeoutLicense />
            </YStack>
          </ScrollView>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$2"
                right="$2"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const PoliciesModal = () => {
  const store = useTakeoutStore()
  return (
    <Dialog
      modal
      open={store.showPolicies}
      onOpenChange={(val) => {
        store.showPolicies = val
      }}
    >
      <Dialog.Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Sheet.ScrollView>
              <Dialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Dialog.Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="medium"
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
          enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
          exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}
          w="90%"
          maw={900}
        >
          <ScrollView>
            <YStack $gtSm={{ maxHeight: '90vh' }} space>
              <Paragraph>
                <Link href="/takeout-policy">Permalink to policies</Link>.
              </Paragraph>

              <TakeoutPolicy />
            </YStack>
          </ScrollView>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$2"
                right="$2"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const DiscountText = ({
  coupon,
}: {
  coupon: NonNullable<TakeoutPageProps['coupon']>
}) => {
  const text = coupon.amount_off
    ? `${formatPrice(coupon.amount_off, 'usd')} ${coupon.name}`
    : coupon.percent_off
      ? `${coupon.percent_off}% ${coupon.name}`
      : ''
  return (
    <ThemeTintAlt offset={6}>
      <YStack m="auto" scale={1} $xs={{ scale: 1.2 }}>
        {/* <YStack
          fullscreen
          shadowColor="$shadowColor"
          shadowRadius={30}
          shadowOffset={{ height: 5, width: 0 }}
          scale={0.95}
        /> */}
        <YStack
          px="$4"
          py="$1"
          rotate="10deg"
          y={-40}
          $sm={{ dsp: 'none' }}
          // backgroundColor="$color8"
          // style={{
          //   clipPath: `polygon(
          //   0% 3px,
          //   3px 3px,
          //   3px 0%,
          //   calc(100% - 3px) 0%,
          //   calc(100% - 3px) 3px,
          //   100% 3px,
          //   100% calc(100% - 3px),
          //   calc(100% - 3px) calc(100% - 3px),
          //   calc(100% - 3px) 100%,
          //   3px 100%,
          //   3px calc(100% - 3px),
          //   0% calc(100% - 3px)
          // )`,
          // }}
        >
          <Paragraph
            o={0.8}
            ff="$silkscreen"
            color="$color11"
            textAlign="center"
            size="$5"
          >
            {text.trim()}
          </Paragraph>
        </YStack>
      </YStack>
    </ThemeTintAlt>
  )
}

let keepCycling = true

const FeatureIcon = ({
  themeIndex,
  title,
  icon,
}: {
  themeIndex: number
  icon: string
  title: string
}) => {
  const Tint = useTint()
  const store = useTakeoutStore()

  useEffect(() => {
    if (store.showPurchase) return
    if (!keepCycling) return
    ;(document.querySelector(`.logo-words`) as HTMLDivElement)?.addEventListener(
      'mouseenter',
      () => {
        keepCycling = false
      }
    )

    const id = setTimeout(() => {
      Tint.setNextTint()
    }, 10_000)

    return () => clearTimeout(id)
  }, [Tint.tint, store.showPurchase])
  const theme = Tint.tints[themeIndex] as ThemeName
  const active = Tint.tint === theme

  return (
    <YStack>
      <Theme name={theme}>
        <PixelTooltip active={active} label={title}>
          <IconFrame
            onMouseEnter={() => {
              keepCycling = false
              Tint.setTintIndex(themeIndex)
            }}
            backgroundColor={active ? '$color9' : '$color10'}
          >
            <Image className="pixelate" src={icon} alt="Icon" height={18} width={18} />
          </IconFrame>
        </PixelTooltip>
      </Theme>
    </YStack>
  )
}

const PixelTooltip = ({
  children,
  label,
  active,
}: {
  label: string
  children?: any
  active?: boolean
}) => {
  return (
    <YStack
      ai="center"
      jc="center"
      {...(active && {
        scale: 1.1,
      })}
    >
      <Paragraph color="$color12" fontFamily="$munro" size="$4">
        {label}
      </Paragraph>
      {children}
    </YStack>
  )
}

const PromotionInput = () => {
  const store = useTakeoutStore()

  const [localCode, setLocalCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const applyCoupon = (promoCode: string, coupon: Stripe.Coupon) => {
    store.appliedCoupon = coupon
    store.appliedPromoCode = promoCode
  }

  const removeCoupon = () => {
    setLocalCode('')
    store.appliedCoupon = null
    store.appliedPromoCode = null
  }

  const closeField = () => {
    setLocalCode('')
    store.promoInputIsOpen = false
  }

  const checkPromotion = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/check-promo-code?${new URLSearchParams({ code: localCode })}`
      )
      if (res.status === 200) {
        const json = (await res.json()) as Stripe.Coupon
        applyCoupon(localCode, json)
      } else {
        const json = await res.json()
        if (json.message) {
          alert(json.message)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {store.promoInputIsOpen ? (
        <XStack
          key="is-open"
          animation="100ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
          gap="$2"
          jc="center"
          ai="center"
        >
          {store.appliedPromoCode ? (
            <>
              <Paragraph theme="green_alt2">
                Coupon {store.appliedPromoCode} applied.
              </Paragraph>
              <Button chromeless size="$2" onPress={removeCoupon}>
                Remove Coupon
              </Button>
            </>
          ) : (
            <>
              {!store.appliedPromoCode && (
                <Button disabled={isLoading} size="$2" chromeless onPress={closeField}>
                  Cancel
                </Button>
              )}
              <Input
                disabled={!!store.appliedPromoCode}
                value={store.appliedPromoCode ?? localCode}
                onChangeText={(text) => {
                  setLocalCode(text)
                }}
                placeholder="Enter the code"
                size="$2"
              />
              <Button
                disabled={isLoading}
                themeInverse
                size="$2"
                onPress={checkPromotion}
              >
                Submit
              </Button>
            </>
          )}
        </XStack>
      ) : (
        <Paragraph
          key="is-not-open"
          animation="100ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
          ta="right"
          textDecorationLine="underline"
          cursor="pointer"
          theme="alt2"
          size="$2"
          onPress={() => {
            store.promoInputIsOpen = true
          }}
        >
          Coupon
        </Paragraph>
      )}
    </AnimatePresence>
  )
}

const lazy = globalThis['requestIdleCallback'] || setTimeout

const useLazilyMounted = (extraTime?: number) => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (isClient) {
      lazy(() => {
        setTimeout(() => {
          setLoaded(true)
        }, extraTime)
      })
    }
  }, [])
  return loaded
}

const PromoVideo = () => {
  const [open, setOpen] = useState(false)
  const loaded = useLazilyMounted(0)

  return (
    <YStack
      className="all ease-in ms300"
      disableOptimization
      pos="absolute"
      t={360}
      l={-230}
      pe={!loaded ? 'none' : 'auto'}
      zi={1000}
      o={loaded ? 1 : 0}
      scale={!loaded ? 0.25 : 0.175}
      rotate="-4deg"
      $sm={{
        dsp: 'none',
      }}
      {...(open && {
        scale: 1,
        rotate: '0deg',
        x: 400,
        y: -180,
      })}
      cursor="pointer"
      onPress={() => {
        setOpen(true)
      }}
    >
      {open && (
        <Button
          pos="absolute"
          t={-20}
          r={-20}
          elevation="$4"
          zi={100}
          circular
          icon={X}
          onPress={(e) => {
            e.stopPropagation()
            setOpen(false)
          }}
        ></Button>
      )}
      <YStack
        br="$10"
        ov="hidden"
        elevation="$10"
        w={840}
        h={480}
        bg="$color3"
        bw={3}
        bc="$borderColor"
      >
        {!open && (
          <YStack fullscreen ai="center" jc="center" bc="rgba(0,0,0,0.75)">
            <PlayCircle size={150} color="red" />
            <Paragraph
              size="$12"
              pos="absolute"
              rotate="-10deg"
              ta="center"
              ff="$silkscreen"
            >
              promo
            </Paragraph>
          </YStack>
        )}
        <iframe
          width="840"
          height="480"
          style={{
            width: 840,
            height: 480,
          }}
          src={`https://www.youtube.com/embed/Guwa1oPBvmU?modestbranding=1&rel=0&showinfo=0&autoplay=${
            open ? 1 : 0
          }`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </YStack>
    </YStack>
  )
}

const Bullet = ({
  size = '$6',
  children,
  subtitle,
  status,
  ...props
}: XStackProps & {
  children: any
  subtitle?: any
  size?: FontSizeTokens
  status?: 'building' | 'done'
}) => {
  return (
    <XStack
      tag="li"
      ai="flex-start"
      space
      f={1}
      {...props}
      w="100%"
      $gtLg={{ w: 'calc(50% - 20px)' }}
    >
      <YStack y={-1}>
        <Circle size={32} elevation="$1">
          {status === 'done' ? (
            <Check size={18} color="$color10" />
          ) : status === 'building' ? (
            <Hammer size={18} color="$color10" />
          ) : (
            <Dot size={18} color="$color10" />
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

const Lazy = (props: { children: any }) => {
  const loaded = useLazilyMounted(100)
  return loaded ? props.children : null
}

const CheckboxGroupItem = ({ children, ...props }: CheckboxProps) => {
  return (
    <ThemeTint disable={!props.checked}>
      <Label
        f={1}
        htmlFor={props.id}
        p="$4"
        height="unset"
        display="flex"
        borderWidth="$0.25"
        backgroundColor={props.checked ? '$color7' : '$color5'}
        borderColor={props.checked ? '$color8' : '$color7'}
        borderRadius="$4"
        space="$4"
        ai="center"
        opacity={props.disabled ? 0.75 : 1}
        cursor={props.disabled ? 'not-allowed' : 'default'}
        $gtSm={{
          maw: 'calc(50% - 8px)',
        }}
        hoverStyle={{
          borderColor: props.checked ? '$color10' : '$color7',
        }}
      >
        <Checkbox checked={props.checked} size="$6" {...props}>
          <Checkbox.Indicator
          // backgroundColor={props.checked ? '$color8' : '$color1'}
          >
            <Check />
          </Checkbox.Indicator>
        </Checkbox>

        <YStack gap="$1" f={1}>
          {children}
        </YStack>
      </Label>
    </ThemeTint>
  )
}

const RadioGroupItem = ({
  children,
  active,
  ...props
}: RadioGroupItemProps & { active: boolean }) => {
  return (
    <ThemeTint disable={!active}>
      <Label
        f={1}
        htmlFor={props.id}
        p="$4"
        height="unset"
        display="flex"
        borderWidth="$0.25"
        borderColor={active ? '$color8' : '$color5'}
        borderRadius="$4"
        space="$4"
        ai="center"
        hoverStyle={{
          borderColor: active ? '$color10' : '$color7',
        }}
      >
        <RadioGroup.Item size="$6" {...props}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>

        <YStack gap="$0" f={1}>
          {children}
        </YStack>
      </Label>
    </ThemeTint>
  )
}

const TakeoutTable = ({
  product,
  selectedPriceId,
}: {
  product?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  selectedPriceId: string
}) => {
  const takeoutPriceInfo = getTakeoutPriceInfo(
    product?.prices.find((price) => price.id === selectedPriceId)?.description ?? ''
  )
  return (
    <YStack
      separator={<Separator o={0.35} />}
      borderWidth="$0.5"
      borderRadius="$4"
      borderColor="$borderColor"
    >
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6" fow="bold">
            Lifetime access, 1 year of updates
          </Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            You own the code for life, with updates for a year
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{checkCircle}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">License Seats</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            Number of people that are allowed to&nbsp;develop&nbsp;on&nbsp;it
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{takeoutPriceInfo.licenseSeats}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">Discord Seats</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            Access to the Discord #takeout room
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{takeoutPriceInfo.discordSeats}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">Discord Private Channel</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            Private chat for your team only
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">
            {takeoutPriceInfo.hasDiscordPrivateChannels ? checkCircle : xCircle}
          </Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6">GitHub Seats</Paragraph>
          <Paragraph className="text-wrap-balance" size="$3" theme="alt1">
            Open PRs and issues on the Github repo
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{takeoutPriceInfo.githubSeats}</Paragraph>
        </XStack>
      </XStack>
    </YStack>
  )
}

export const getStaticProps: GetStaticProps<TakeoutPageProps | any> = async () => {
  try {
    const props = await getTakeoutProducts()
    return {
      props,
    }
  } catch (err) {
    console.error(`Error getting props`, err)
    return {
      props: {},
    }
  }
}

const getTakeoutProducts = async (): Promise<TakeoutPageProps> => {
  const promoListPromise = stripe.promotionCodes.list({
    code: 'SITE', // ones with code site are considered public and will be shown here
    active: true,
    expand: ['data.coupon'],
  })
  const productPromises = [
    supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'universal-starter')
      .single(),
    supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'icon-packs')
      .single(),
    supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'font-packs')
      .single(),
    supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'bento')
      .single(),
  ]
  const promises = [promoListPromise, ...productPromises]
  const queries = await Promise.all(promises)

  const products = queries.slice(1) as Awaited<(typeof productPromises)[number]>[]
  const couponsList = queries[0] as Awaited<typeof promoListPromise>

  let coupon: Stripe.Coupon | null = null

  if (couponsList.data.length > 0) {
    coupon = couponsList.data[0].coupon
  }

  if (!products.length) {
    throw new Error(`No products found`)
  }

  for (const product of products) {
    if (product.error) throw product.error
    if (
      !product.data.prices ||
      !Array.isArray(product.data.prices) ||
      product.data.prices.length === 0
    ) {
      throw new Error('No prices are attached to the product.')
    }
  }

  return {
    starter: {
      ...products[0].data!,
      prices: getArray(products[0].data!.prices!).filter(
        (p) => p.active && !(p.metadata as Record<string, any>).hide_from_lists
      ),
    },
    iconsPack: {
      ...products[1].data!,
      prices: getArray(products[1].data!.prices!).filter(
        (p) => p.active && !(p.metadata as Record<string, any>).hide_from_lists
      ),
    },
    fontsPack: {
      ...products[2].data!,
      prices: getArray(products[2].data!.prices!).filter(
        (p) => p.active && !(p.metadata as Record<string, any>).hide_from_lists
      ),
    },
    bento: {
      ...products[3].data!,
      prices: getArray(products[3].data!.prices!).filter(
        (p) => p.active && !(p.metadata as Record<string, any>).hide_from_lists
      ),
    },
    coupon,
  }
}
