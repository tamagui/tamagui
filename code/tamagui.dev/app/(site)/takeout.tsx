import { getSize } from '@tamagui/get-token'
import { Image } from '@tamagui/image-next'
import { setTintIndex, ThemeTint, ThemeTintAlt, useTint } from '@tamagui/logo'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Dot,
  Hammer,
  PlayCircle,
  X,
} from '@tamagui/lucide-icons'
import { useClientValue, useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { useLoader } from 'one'
import React, { Suspense, lazy, memo, useEffect, useState } from 'react'
import type {
  FontSizeTokens,
  GetProps,
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
  Circle,
  EnsureFlexed,
  H2,
  Input,
  Paragraph,
  ScrollView,
  SizableText,
  Spacer,
  Stack,
  Tabs,
  Theme,
  View,
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
import { LoadCherryBomb, LoadMunro } from '~/features/site/fonts/LoadFonts'
import { PurchaseModal } from '~/features/site/purchase/PurchaseModal'
import { MunroP, PurchaseButton, isSafariMobile } from '~/features/site/purchase/helpers'
import { getProductsForServerSideRendering } from '~/features/site/purchase/server-helpers'
import { useTakeoutStore } from '~/features/site/purchase/useTakeoutStore'
import { seasons } from '~/features/site/seasons/SeasonTogglePopover'
import { TakeoutLogo } from '~/features/takeout/TakeoutLogo'
import { ThemeNameEffect } from '../../features/site/theme/ThemeNameEffect'
import { PageThemeCarousel } from '../../features/site/PageThemeCarousel'

export const loader = async () => {
  try {
    return await getProductsForServerSideRendering()
  } catch (err) {
    console.error(`Error loading prices`, err)
    return { starter: null, fontsPack: null, iconsPack: null, bento: null }
  }
}

const whenIdle = globalThis['requestIdleCallback'] || setTimeout

export default function TakeoutPage() {
  const { starter, bento } = useLoader(loader)
  const store = useTakeoutStore()
  const tint = useTint()

  return (
    <YStack maw="100%">
      <ThemeNameEffect colorKey="$color5" />
      <LoadMunro />
      <LoadCherryBomb />
      <script src="https://cdn.paritydeals.com/banner.js" />
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
          pos="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background:
              'linear-gradient(140deg, var(--color02), var(--color0), var(--color0), var(--color0))',
          }}
          zi={-3}
        />
      </ThemeTintAlt>

      <YStack
        className="grain"
        fullscreen
        t={-60}
        b={0}
        o={0.5}
        zi={0}
        style={{
          imageRendering: 'pixelated',
        }}
      />

      <ThemeTintAlt offset={0}>
        <YStack
          pos="absolute"
          l={0}
          r={0}
          t={-100}
          mixBlendMode="color-burn"
          b={0}
          style={{
            background: 'linear-gradient(10deg, var(--color5), var(--color1))',
          }}
          zi={-3}
        />
      </ThemeTintAlt>

      <ThemeTintAlt offset={3}>
        <YStack
          pos="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background:
              'linear-gradient(140deg, var(--color02), var(--color0), var(--color0), var(--color0))',
          }}
          zi={-3}
        />
      </ThemeTintAlt>

      <YStack
        pe="none"
        pos="absolute"
        t={-950}
        l="50%"
        x={-300}
        scale={1}
        rotate="120deg"
        o={0.02}
        $theme-light={{
          o: 0.12,
        }}
        zi={-1}
      >
        <Image alt="mandala" width={2500} height={2500} src="/takeout/geometric.svg" />
      </YStack>

      {/* <Glow /> */}

      <PurchaseModal defaultValue="takeout" starter={starter!} bento={bento!} />

      {/* gradient on the end of the page */}
      <ThemeTint>
        <YStack
          zi={-1}
          fullscreen
          style={{
            background: `linear-gradient(to bottom, transparent, transparent, var(--color2))`,
          }}
        />
      </ThemeTint>

      <ContainerLarge px={0}>
        <YStack h={0} mah={0}>
          <YStack position="absolute" t={30} r="2%">
            <Theme name="accent">
              <PurchaseButton
                // icon={ShoppingCart}
                onPress={() => {
                  store.showPurchase = true
                }}
                size="$4"
              >
                Get Access
              </PurchaseButton>
            </Theme>
          </YStack>

          {/* <DiscountText>Text</DiscountText> */}

          {/* <PromoVideo /> */}

          <TakeoutHero />
        </YStack>

        <XStack
          mt={heroHeight}
          $sm={{ mt: heroHeight - 100 }}
          $xs={{ mt: heroHeight - 150 }}
          gap="$10"
          $md={{ fd: 'column' }}
        >
          <XStack
            f={1}
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
              {starter && <StarterCard product={starter} />}
            </YStack>

            <YStack mt={-580} $md={{ mt: -520 }} group="takeoutBody" f={1} gap="$5">
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

              <XStack fw="wrap" gap="$3" mx="$-10" ai="center" jc="center">
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

              <YStack marginTop={-430} marginBottom={-330} x={800} zi={-1}>
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

              <YStack br="$12" p="$7" gap="$3">
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

          {/* <YStack mt={200} w={3} mih={500} h="100%" $sm={{ display: 'none' }} /> */}
        </XStack>
        <Footer />
      </ContainerLarge>
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

export type TakeoutPageProps = Awaited<
  ReturnType<typeof getProductsForServerSideRendering>
>

const TakeoutCard2Frame = styled(YStack, {
  minWidth: 282,
  maxWidth: 282,
  minHeight: 312,
  maxHeight: 312,
  elevation: '$0.5',
  overflow: 'hidden',
  borderRadius: '$4',

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
  const isHydrated = useDidFinishSSR()
  const innerGlow = useHoverGlow({
    resist: 30,
    size: 300,
    strategy: 'blur',
    blurPct: 60,
    // inverse: true,
    color: isDark ? 'var(--color1)' : 'var(--color4)',
    opacity: isDark ? 0.18 : 0.35,
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

        {isHydrated && <innerGlow.Component />}
        {/* <YStack
          fullscreen
          style={{
            clipPath: `url(#myClip)`,
          }}
        >
          <borderGlow.Component />
        </YStack> */}

        <YStack f={1} space zi={100}>
          <H2
            fontFamily="$munro"
            size="$8"
            ls={3}
            als="center"
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
            <YStack pos="absolute" b={0} r={0}>
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

      <YStack position="absolute" pe="none" top={200} r={0} $md={{ r: -150 }} zIndex={-1}>
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
      zi={1000}
      my={21}
      gap={20}
      f={1}
      jc="space-between"
      pe="auto"
      $gtSm={{
        maw: '80%',
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
    <XStack tag="li" ai="flex-start" space f={1} ov="hidden" {...props}>
      <YStack mr={-12} py="$1.5">
        <Dot size={16} color="$color10" />
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
  p: 9,
  bg: 'rgba(255, 255, 255, 0.035)',
})

const StarterCard = memo(({ product }: { product: TakeoutPageProps['starter'] }) => {
  const [ref, setRef] = useState<any>()

  const store = useTakeoutStore()

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

      {/* <Theme name="accent"> */}
      <TakeoutCardFrame
        bg="$color1"
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
          mah: 'auto',
          w: '100%',
          maw: '100%',
          mt: 100,
        }}
      >
        <YStack zi={-1} fullscreen bg="$color5" o={0.5} />

        {/* <ThemeTintAlt>
            <LinearGradient
              pos="absolute"
              b={0}
              l={0}
              r={0}
              h={200}
              colors={['$background0', '$color5']}
              zi={100}
            />
          </ThemeTintAlt> */}

        <YStack pos="absolute" b="$4" l="$4" r="$4" zi={100}>
          {/* cant use buttonlink it breaks scroll on press if not enabled, conditionally use a link */}
          {/* subscription ? `/account/items#${subscription.id}` : '' */}
          <PurchaseButton
            onPress={() => {
              store.showPurchase = true
            }}
          >
            Get Access
          </PurchaseButton>
        </YStack>

        <ScrollView p="$6" disabled={media.md} showsVerticalScrollIndicator={false}>
          <YStack gap="$2">
            <ThemeTintAlt>
              <MunroP color="$color11" size="$7" ls={2}>
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
      {/* </Theme> */}
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
    <Point>GitHub template with PR bot for updates</Point>
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
  <XStack gap="$12" my="$4" als="center" spaceDirection="horizontal">
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
    <img src="/heart.svg" style={{ width: 16, height: 16 }} />
  </XStack>
)

const DiscountText = ({
  children,
}: {
  children: React.ReactNode
}) => {
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
            {children}
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
    <Theme name={theme}>
      <PixelTooltip active={active} label={title}>
        <IconFrame
          onMouseEnter={() => {
            keepCycling = false
            Tint.setTintIndex(themeIndex)
          }}
          backgroundColor={active ? '$color9' : '$color10'}
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
      ai="center"
      jc="center"
      {...(active && {
        scale: 1.1,
      })}
    >
      <Paragraph color="$color12" fontFamily="$munro" size="$2">
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
  return <Suspense fallback={null}>{loaded ? props.children : null}</Suspense>
}
