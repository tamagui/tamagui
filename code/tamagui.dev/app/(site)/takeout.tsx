import { getSize } from '@tamagui/get-token'
import { Image } from '@tamagui/image'
import { ThemeTint, ThemeTintAlt, useTint } from '@tamagui/logo'
import { Dot } from '@tamagui/lucide-icons'
import { useClientValue, useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import type React from 'react'
import { Suspense, lazy, memo, useEffect, useState } from 'react'
import type { FontSizeTokens, GetProps, ThemeName, XStackProps } from 'tamagui'
import {
  H2,
  Paragraph,
  ScrollView,
  SizableText,
  Spacer,
  Stack,
  Theme,
  XStack,
  YStack,
  composeRefs,
  isClient,
  styled,
  useMedia,
  useThemeName,
} from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { HeadInfo } from '~/components/HeadInfo'
import { useHoverGlow } from '~/components/HoverGlow'
import { Link } from '~/components/Link'
import { Footer } from '~/features/site/Footer'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { MunroP, PurchaseButton, isSafariMobile } from '~/features/site/purchase/helpers'
import type { ProductsResponse } from '~/features/site/purchase/useProducts'
import { useTakeoutStore } from '~/features/site/purchase/useTakeoutStore'
import { seasons } from '~/features/site/seasons/SeasonTogglePopover'
import { TakeoutLogo } from '~/features/takeout/TakeoutLogo'
import { PageThemeCarousel } from '../../features/site/PageThemeCarousel'
import { useSubscriptionModal } from '../../features/site/purchase/useSubscriptionModal'
import { ThemeNameEffect } from '../../features/site/theme/ThemeNameEffect'

const whenIdle = globalThis['requestIdleCallback'] || setTimeout

export default function TakeoutPage() {
  const { showAppropriateModal, subscriptionStatus } = useSubscriptionModal()
  const isProUser = subscriptionStatus?.pro

  return (
    <YStack maxW="100%">
      <ThemeNameEffect colorKey="$color5" />
      <LoadCherryBomb />
      <HeadInfo
        title="🥡 Tamagui Takeout"
        description="Tamagui Takeout React Native Bootstrap Starter Kit"
        openGraph={{
          url: 'https://tamagui.dev/takeout',
          images: [
            {
              url: 'https://tamagui.dev/takeout/social.png',
            },
          ],
        }}
      />

      <PageThemeCarousel />

      <ThemeTintAlt>
        <YStack
          position="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background:
              'linear-gradient(140deg, var(--color02), var(--color0), var(--color0), var(--color0))',
          }}
          z={-3}
        />
      </ThemeTintAlt>

      <YStack
        className="grain"
        fullscreen
        t={-60}
        b={0}
        opacity={0.5}
        z={0}
        style={{
          imageRendering: 'pixelated',
        }}
      />

      <ThemeTintAlt offset={0}>
        <YStack
          position="absolute"
          l={0}
          r={0}
          t={-100}
          mixBlendMode="color-burn"
          b={0}
          style={{
            background: 'linear-gradient(10deg, var(--color5), var(--color1))',
          }}
          z={-3}
        />
      </ThemeTintAlt>

      <ThemeTintAlt offset={3}>
        <YStack
          position="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background:
              'linear-gradient(140deg, var(--color02), var(--color0), var(--color0), var(--color0))',
          }}
          z={-3}
        />
      </ThemeTintAlt>

      <YStack
        pointerEvents="none"
        position="absolute"
        t={-950}
        l="50%"
        x={-300}
        scale={1}
        rotate="120deg"
        opacity={0.02}
        $theme-light={{
          opacity: 0.12,
        }}
        z={-1}
      >
        <Image alt="mandala" width={2500} height={2500} src="/takeout/geometric.svg" />
      </YStack>

      {/* gradient on the end of the page */}
      <ThemeTint>
        <YStack
          z={-1}
          fullscreen
          style={{
            background: `linear-gradient(to bottom, transparent, transparent, var(--color2))`,
          }}
        />
      </ThemeTint>

      <ContainerLarge px={0}>
        <YStack height={0} maxH={0}>
          <YStack position="absolute" t={30} r="2%">
            <Theme name="accent">
              <PurchaseButton
                onPress={() => {
                  showAppropriateModal()
                }}
                size="$4"
              >
                {isProUser ? 'Access' : 'Buy'}
              </PurchaseButton>
            </Theme>
          </YStack>

          <TakeoutHero />
        </YStack>

        <XStack
          mt={heroHeight}
          $sm={{ mt: heroHeight - 100 }}
          $xs={{ mt: heroHeight - 150 }}
          gap="$10"
          $md={{ flexDirection: 'column' }}
        >
          <XStack
            flex={1}
            p="$5"
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
            <YStack mt={-700} $md={{ mt: 0 }} ml={20} mr={0}>
              <StarterCard />
            </YStack>

            <YStack mt={-580} $md={{ mt: -520 }} group="takeoutBody" flex={1} gap="$5">
              <ThemeTintAlt>
                <Paragraph className="text-wrap-balance" size="$7" $sm={{ size: '$7' }}>
                  Takeout is a production-ready base stack that includes everything you
                  need for apps with a user-system. It funds the OSS development of
                  Tamagui.
                </Paragraph>

                <Paragraph className="text-wrap-balance" size="$7" $sm={{ size: '$7' }}>
                  Takeout shares a high % of code between native and web, while
                  maintaining a high bar for UX and performance. Building off our OSS
                  starter (<CodeInline>npm create tamagui</CodeInline>), we add Supabase,
                  tRPC, Zod, custom themes, screens, a user system and common flows, and
                  typed, themeable fonts and icons via{' '}
                  <Link href="https://fonts.google.com" target="_blank">
                    Google Fonts
                  </Link>{' '}
                  and{' '}
                  <Link href="https://icones.js.org" target="_blank">
                    icones.js.org
                  </Link>{' '}
                  with <CodeInline>yarn&nbsp;add:icon|font</CodeInline>.
                </Paragraph>
              </ThemeTintAlt>

              <XStack flexWrap="wrap" gap="$3" mx="$-10" items="center" justify="center">
                <TakeoutCard
                  theme="orange"
                  title="Monorepo"
                  icon="retro-icons/coding-apps-websites-module-21.svg"
                >
                  <YStack gap="$2">
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
                  <YStack gap="$2">
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
                  <YStack gap="$2">
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
                  <YStack gap="$2">
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
                  <YStack gap="$2">
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
                  <YStack gap="$2">
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

              <YStack mt={-430} mb={-330} x={800} z={-1}>
                <div
                  style={{
                    transform: 'rotateX(41deg) rotateZ(33deg)',
                    transformStyle: 'preserve-3d',
                    width: 715 * 0.5,
                    borderRadius: 78,
                    boxShadow: '0 50px 50px 0px var(--shadowColor)',
                  }}
                >
                  {/* phone */}
                  <svg width={715 * 0.5} height={1467 * 0.5} viewBox="0 0 715 1467">
                    <path
                      d="M0 166.4C0 108.155 0 79.0318 11.3353 56.785C21.3062 37.2161 37.2161 21.3062 56.785 11.3353C79.0318 0 108.155 0 166.4 0H548.6C606.845 0 635.968 0 658.215 11.3353C677.784 21.3062 693.694 37.2161 703.665 56.785C715 79.0318 715 108.155 715 166.4V1300.6C715 1358.85 715 1387.97 703.665 1410.21C693.694 1429.78 677.784 1445.69 658.215 1455.66C635.968 1467 606.845 1467 548.6 1467H166.4C108.155 1467 79.0318 1467 56.785 1455.66C37.2161 1445.69 21.3062 1429.78 11.3353 1410.21C0 1387.97 0 1358.85 0 1300.6V166.4Z"
                      fill="var(--color2)"
                      style={{
                        outline: `0 0 10px #000`,
                      }}
                    />
                    <mask
                      id="mask0_2_131"
                      style={{ maskType: 'alpha' }}
                      maskUnits="userSpaceOnUse"
                      x="35"
                      y="36"
                      width="645"
                      height="1395"
                    >
                      <path
                        d="M42.4116 73.1286C35 87.6746 35 106.716 35 144.8V1322.2C35 1360.28 35 1379.33 42.4116 1393.87C48.9309 1406.67 59.3336 1417.07 72.1286 1423.59C86.6746 1431 105.716 1431 143.8 1431H571.2C609.284 1431 628.325 1431 642.871 1423.59C655.666 1417.07 666.069 1406.67 672.588 1393.87C680 1379.33 680 1360.28 680 1322.2V144.8C680 106.716 680 87.6746 672.588 73.1286C666.069 60.3336 655.666 49.9309 642.871 43.4116C628.325 36 609.284 36 571.2 36H537.778C536.122 36 535.295 36 534.632 36.2412C533.521 36.6456 532.646 37.5209 532.241 38.6319C532 39.2947 532 40.1224 532 41.7778C532 55.0209 532 61.6425 530.07 66.9446C526.835 75.8332 519.833 82.835 510.945 86.0702C505.642 88 499.021 88 485.778 88H229.222C215.979 88 209.358 88 204.055 86.0702C195.167 82.835 188.165 75.8332 184.93 66.9446C183 61.6425 183 55.0209 183 41.7778C183 40.1224 183 39.2947 182.759 38.6319C182.354 37.5209 181.479 36.6456 180.368 36.2412C179.705 36 178.878 36 177.222 36H143.8C105.716 36 86.6746 36 72.1286 43.4116C59.3336 49.9309 48.9309 60.3336 42.4116 73.1286Z"
                        fill="var(--color)"
                      />
                    </mask>
                    <g mask="url(#mask0_2_131)">
                      <path d="M25 22H702V1489H25V22Z" fill="var(--background)" />
                      <g clipPath="url(#clip0_2_131)">
                        <path
                          d="M379.351 710.63H385.629V716.909H379.351V710.63Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M370.311 710.63H376.589V716.909H370.311V710.63Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M361.271 710.63H367.549V716.909H361.271V710.63Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M352.231 710.63H358.509V716.909H352.231V710.63Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M343.191 710.63H349.469V716.909H343.191V710.63Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M334.151 710.63H340.429V716.909H334.151V710.63Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M325.111 719.644H331.389V725.923H325.111V719.644Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M316.071 728.658H322.349V734.937H316.071V728.658Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M307.031 737.673H313.309V743.951H307.031V737.673Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M307.031 746.687H313.309V752.965H307.031V746.687Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M307.031 755.701H313.309V761.979H307.031V755.701Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M307.031 764.715H313.309V770.993H307.031V764.715Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M297.991 773.729H304.269V780.007H297.991V773.729Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M297.991 782.743H304.269V789.022H297.991V782.743Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M297.991 791.757H304.269V798.036H297.991V791.757Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M307.031 800.771H313.309V807.05H307.031V800.771Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M316.071 809.785H322.349V816.064H316.071V809.785Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M325.111 818.799H331.389V825.078H325.111V818.799Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M334.151 827.814H340.429V834.092H334.151V827.814Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M343.191 827.814H349.469V834.092H343.191V827.814Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M352.231 818.799H358.509V825.078H352.231V818.799Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M361.271 818.799H367.549V825.078H361.271V818.799Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M361.271 827.814H367.549V834.092H361.271V827.814Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M370.311 827.814H376.589V834.092H370.311V827.814Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M379.351 818.799H385.629V825.078H379.351V818.799Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M379.351 809.785H385.629V816.064H379.351V809.785Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M388.391 800.771H394.669V807.05H388.391V800.771Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M397.431 782.743H403.709V789.022H397.431V782.743Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M397.431 791.757H403.709V798.036H397.431V791.757Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M397.431 773.729H403.709V780.007H397.431V773.729Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M406.471 764.715H412.749V770.993H406.471V764.715Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M415.511 764.715H421.789V770.993H415.511V764.715Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M424.551 755.701H430.829V761.979H424.551V755.701Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M415.511 746.687H421.789V752.965H415.511V746.687Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M406.471 746.687H412.749V752.965H406.471V746.687Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M397.431 746.687H403.709V752.965H397.431V746.687Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M424.551 737.673H430.829V743.951H424.551V737.673Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M424.551 746.687H430.829V752.965H424.551V746.687Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M415.511 728.658H421.789V734.937H415.511V728.658Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M415.511 728.658H421.789V734.937H415.511V728.658Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M406.471 728.658H412.749V734.937H406.471V728.658Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M388.391 719.644H394.669V725.923H388.391V719.644Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M379.351 728.658H385.629V734.937H379.351V728.658Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M352.231 737.673H358.509V743.951H352.231V737.673Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M352.231 773.729H358.509V780.007H352.231V773.729Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M352.231 782.743H358.509V789.022H352.231V782.743Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M343.191 791.757H349.469V798.036H343.191V791.757Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M334.151 782.743H340.429V789.022H334.151V782.743Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M334.151 773.729H340.429V780.007H334.151V773.729Z"
                          fill="var(--color)"
                        />
                        <path
                          d="M397.431 728.658H403.709V734.937H397.431V728.658Z"
                          fill="var(--color)"
                        />
                      </g>
                    </g>
                    <path
                      d="M319 55C319 51.134 322.134 48 326 48H390C393.866 48 397 51.134 397 55C397 58.866 393.866 62 390 62H326C322.134 62 319 58.866 319 55Z"
                      fill="var(--color6)"
                    />
                    <path
                      d="M413 55C413 47.268 419.268 41 427 41C434.732 41 441 47.268 441 55C441 62.732 434.732 69 427 69C419.268 69 413 62.732 413 55Z"
                      fill="var(--color6)"
                    />
                    <defs>
                      <clipPath id="clip0_2_131">
                        <rect
                          width="133.664"
                          height="124.999"
                          fill="var(--color)"
                          transform="translate(297.536 709.493)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </YStack>

              <Spacer />

              <YStack rounded="$12" p="$7" gap="$3">
                <YStack minH={530}>
                  <Lazy>
                    <TakeoutGallery />
                  </Lazy>
                </YStack>
              </YStack>

              <Spacer />

              <Spacer size="$10" />
            </YStack>
          </XStack>
        </XStack>
        <Footer />
      </ContainerLarge>
    </YStack>
  )
}

const CodeInline = styled(Paragraph, {
  render: 'code',
  fontFamily: '$mono',
  color: '$color12',
  backgroundColor: 'color-mix(in srgb, var(--color8) 50%, transparent 50%)' as any,
  cursor: 'inherit',
  rounded: '$3',
  // @ts-ignore
  fontSize: '85%',
  p: '$1.5',
})

const points = {
  // this one's only shown on modal
  monorepo: [
    'Builds off our free and OSS starter kit.',
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

const TakeoutBox3D = lazy(() => import('../../features/takeout/TakeoutBox3D'))
const TakeoutGallery = lazy(() => import('../../features/takeout/TakeoutGallery'))

const heroHeight = 1050

export type TakeoutPageProps = ProductsResponse

const TakeoutCard2Frame = styled(YStack, {
  minW: 282,
  maxW: 282,
  minH: 312,
  maxH: 312,
  elevation: '$0.5',
  overflow: 'hidden',
  rounded: '$4',

  '$group-takeoutBody-gtXs': {
    scale: 0.915,
    m: -12,
  },

  variants: {
    size: {
      '...size': (val) => ({
        p: val as any,
        rounded: val as any,
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
  const isHydrated = useDidFinishSSR()
  const innerGlow = useHoverGlow({
    resist: 30,
    size: 300,
    strategy: 'blur',
    blurPct: 60,
    color: isDark ? 'var(--color1)' : 'var(--color4)',
    opacity: isDark ? 0.18 : 0.35,
    background: 'transparent',
    style: {
      transition: `all ease-out 300ms`,
    },
  })

  return (
    <>
      <TakeoutCard2Frame {...props} ref={composeRefs(innerGlow.parentRef) as any}>
        {isHydrated && <innerGlow.Component />}

        <YStack flex={1} gap="$4" z={100}>
          <H2
            fontFamily="$mono"
            size="$8"
            letterSpacing={3}
            self="center"
            my={-8}
            color="$color10"
            $theme-light={{
              color: '$color11',
            }}
          >
            {title}
          </H2>
          {children}

          {!!icon && (
            <YStack position="absolute" b={0} r={0}>
              <Image className="pixelate" src={icon} alt="Icon" width={32} height={32} />
            </YStack>
          )}
        </YStack>
      </TakeoutCard2Frame>
    </>
  )
}

const TakeoutHero = () => {
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
      items="center"
      justify="center"
      className="ease-in ms300 all"
      pointerEvents="none"
      position="relative"
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
        pointerEvents="none"
        t={200}
        r={0}
        $md={{ r: -150 }}
        z={-1}
      >
        {enable3d && (
          <Suspense fallback={null}>
            <ErrorBoundary noMessage>
              <TakeoutBox3D />
            </ErrorBoundary>
          </Suspense>
        )}
      </YStack>
    </YStack>
  )
}

function FeaturesIconRow() {
  return (
    <XStack
      z={1000}
      my={21}
      gap={20}
      flex={1}
      justify="space-between"
      pointerEvents="auto"
      $gtSm={{
        maxW: '80%',
      }}
    >
      <FeatureIcon
        themeIndex={0}
        title="Monorepo"
        icon="retro-icons/coding-apps-websites-module-21.svg"
      />

      <FeatureIcon
        themeIndex={2}
        title="Screens"
        icon="retro-icons/coding-app-website-ui-62.svg"
      />

      <FeatureIcon
        themeIndex={3}
        title="Themes"
        icon="retro-icons/design-color-bucket-brush-63.svg"
      />

      <FeatureIcon
        themeIndex={4}
        title="Stack"
        icon="retro-icons/computers-devices-electronics-vintage-mac-54.svg"
      />

      <FeatureIcon
        themeIndex={5}
        title="Assets"
        icon="retro-icons/coding-apps-websites-plugin-33.svg"
      />

      <FeatureIcon
        themeIndex={6}
        title="Profiles"
        icon="retro-icons/coding-apps-websites-programming-hold-code-9.svg"
      />
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
  size?: FontSizeTokens
}) => {
  return (
    <XStack render="li" items="flex-start" gap="$4" flex={1} overflow="hidden" {...props}>
      <YStack mr={-12} py="$1.5">
        <Dot size={16} color="$color10" />
      </YStack>
      <YStack flex={1}>
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
            opacity={0.5}
          >
            {subtitle}
          </Paragraph>
        )}
      </YStack>
    </XStack>
  )
}

const IconFrame = styled(Stack, {
  rounded: 1000,
  p: 9,
  bg: 'rgba(255, 255, 255, 0.035)',
})

const StarterCard = memo(() => {
  const [ref, setRef] = useState<any>()
  const { showAppropriateModal, subscriptionStatus } = useSubscriptionModal()
  const isProUser = subscriptionStatus?.pro

  const media = useMedia()
  useEffect(() => {
    if (!ref) return
    if (!isClient) return
    if (media.md) return

    let dispose: (() => void) | undefined = undefined
    let disposed = false

    import('../../helpers/sticksy').then(({ Sticksy }) => {
      if (disposed) {
        return
      }

      new Sticksy(ref as any)

      dispose = () => {
        Sticksy.disableAll()
      }
    })

    return () => {
      disposed = true
      dispose?.()
    }
  }, [ref, media.gtMd])

  const { name } = useTint()

  return (
    <div ref={setRef}>
      {name !== 'tamagui' && (
        <SizableText
          size="$11"
          height={200}
          rotate="-8deg"
          self="center"
          z={100}
          position="absolute"
          t={-10}
          pointerEvents="none"
        >
          {seasons[name]}
        </SizableText>
      )}
      \
      <TakeoutCardFrame
        bg="$color1"
        className="blur-medium"
        z={100_000}
        maxW={310}
        self="center"
        shadowRadius={30}
        shadowOffset={{ height: 20, width: 0 }}
        shadowColor="$shadowColor"
        x={-50}
        y={50}
        maxH="calc(min(85vh, 800px))"
        rounded="$8"
        $md={{
          x: -20,
          y: 0,
          maxH: 'auto',
          width: '100%',
          maxW: '100%',
          mt: 100,
        }}
      >
        <YStack z={-1} fullscreen bg="$color5" opacity={0.5} />
        <YStack position="absolute" b="$4" l="$4" r="$4" z={100}>
          {/* cant use buttonlink it breaks scroll on press if not enabled, conditionally use a link */}
          {/* subscription ? `/account/items#${subscription.id}` : '' */}
          <PurchaseButton
            onPress={() => {
              showAppropriateModal()
            }}
          >
            {isProUser ? 'Manage Subscription' : 'Get Access'}
          </PurchaseButton>
        </YStack>

        <ScrollView p="$6" disabled={media.md} showsVerticalScrollIndicator={false}>
          <YStack gap="$2">
            <ThemeTintAlt>
              <MunroP color="$color11" size="$7" letterSpacing={2}>
                The Stack
              </MunroP>
            </ThemeTintAlt>

            <YStack>
              <Row
                title="Access"
                description="Access to the private Github repo and Discord chat room."
                after="01"
              />

              <Row
                title="Monorepo"
                description="More refined monorepo with Next.js, Vercel deploy, Expo and EAS."
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

            <Spacer flex={1} minH={120} />
          </YStack>
        </ScrollView>
      </TakeoutCardFrame>
    </div>
  )
})

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
        hoverStyle: {
          bg: 'var(--color4)',
        },
      }}
    >
      <YStack flex={1} py="$3" gap="$1">
        <Paragraph
          fontFamily="$mono"
          textTransform="uppercase"
          letterSpacing={4}
          size="$4"
        >
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
  borderColor: '$color3',
  rounded: '$4',
  overflow: 'hidden',
})

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
    <Theme name={theme}>
      <PixelTooltip active={active} label={title}>
        <IconFrame
          onMouseEnter={() => {
            keepCycling = false
            Tint.setTintIndex(themeIndex)
          }}
          bg={active ? '$color9' : '$color10'}
        >
          <Image className="pixelate" src={icon} alt="Icon" height={14} width={14} />
        </IconFrame>
      </PixelTooltip>
    </Theme>
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
      items="center"
      justify="center"
      {...(active && {
        scale: 1.1,
      })}
    >
      <Paragraph color="$color12" fontFamily="$mono" size="$2">
        {label}
      </Paragraph>
      {children}
    </YStack>
  )
}

const useLazilyMounted = (extraTime?: number) => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (isClient) {
      whenIdle(() => {
        setTimeout(() => {
          setLoaded(true)
        }, extraTime)
      })
    }
  }, [])
  return loaded
}

const Lazy = (props: { children: any }) => {
  const loaded = useLazilyMounted(100)
  return <Suspense fallback={null}>{loaded ? props.children : null}</Suspense>
}
