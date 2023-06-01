import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { PoweredByStripeIcon } from '@components/PoweredByStripeIcon'
import { Database } from '@lib/supabase-types'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { withSupabase } from '@lib/withSupabase'
import { LogoIcon, ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Check, X } from '@tamagui/lucide-icons'
import { useClientValue } from '@tamagui/use-did-finish-ssr'
import { Store, createUseStore } from '@tamagui/use-store'
import { ContainerXL } from 'components/Container'
import { DefaultLayout, getDefaultLayout } from 'components/layouts/DefaultLayout'
import { useUser } from 'hooks/useUser'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import Image from 'next/image'
import { Suspense, lazy, memo, useEffect, useState } from 'react'
import {
  AnimatePresence,
  Button,
  ButtonProps,
  Dialog,
  H1,
  H2,
  H3,
  H4,
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
  TabLayout,
  Tabs,
  TabsProps,
  TabsTabProps,
  Theme,
  Unspaced,
  XStack,
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

const TakeoutBox3D = lazy(() => import('../components/TakeoutBox3D'))

const heroHeight = 850

type TakeoutPageProps = {
  starter?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
}

export default function TakeoutPage({ starter }: TakeoutPageProps) {
  const store = useTakeoutStore()
  const enable3d = useClientValue(
    isClient && !window.location.search?.includes('disable-3d')
  )
  const disableMotion =
    useClientValue(
      isClient &&
        (window.matchMedia(`(prefers-reduced-motion: reduce)`)?.matches ||
          window.location.search?.includes('disable-motion') ||
          /firefox/i.test(navigator.userAgent))
    ) || store.showPurchase

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

      <Glow />

      <PurchaseModal productWithPrices={starter} />

      <YStack
        pos="absolute"
        fullscreen
        b="auto"
        zi={-2}
        pe="none"
        ai="center"
        jc="center"
        ov="hidden"
      >
        <TAKEOUT
          className={`font-outlined theme-shadow` + (disableMotion ? '' : ' masked2')}
          fontSize={150 * 5}
          lineHeight={110 * 5}
          color="#000"
          o={0.085}
        />
      </YStack>

      <YStack>
        <ContainerXL>
          <YStack h={0} mah={0}>
            <YStack position="absolute" t={20} r="15%">
              <PurchaseButton
                onPress={() => {
                  store.showPurchase = true
                }}
                size="$3"
              >
                Purchase
              </PurchaseButton>
            </YStack>

            <YStack
              y={heroHeight / 2 - 340}
              ai="center"
              jc="center"
              className="ease-in ms300 all"
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
            >
              <Paragraph
                color="$color"
                size="$1"
                fontSize={12}
                ls={105}
                o={0.2}
                fontFamily="$silkscreen"
                pe="none"
                h={40}
                userSelect="none"
              >
                TAMAGUI
              </Paragraph>

              <TAKEOUT zi={1000} />

              {!disableMotion && (
                <ThemeTint>
                  {/* main color slices */}
                  <TAKEOUT
                    className="clip-slice mix-blend"
                    pos="absolute"
                    t={44}
                    color="$color7"
                    scale={1.04}
                    o={1}
                  />

                  {/* alt color slices */}
                  <ThemeTintAlt>
                    <TAKEOUT
                      className="clip-slice mix-blend animate-fade2 slice-alt"
                      pos="absolute"
                      t={44}
                      color="$color7"
                      scale={1.04}
                      o={1}
                    />
                  </ThemeTintAlt>

                  {/* alt color slices */}
                  <ThemeTintAlt offset={1}>
                    <TAKEOUT
                      className="clip-slice mix-blend animate-fade2"
                      pos="absolute"
                      t={40}
                      color="$color7"
                      scale={1.024}
                      o={0.5}
                    />
                  </ThemeTintAlt>

                  {/* animated borders shine */}
                  <TAKEOUT
                    pos="absolute"
                    t={45}
                    className="theme-shadow masked2"
                    zi={100}
                    color="transparent"
                  />
                </ThemeTint>
              )}

              <XStack my="$5" gap={125} f={1} jc="space-between" className="mix-blend">
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
                pos="absolute"
                fullscreen
                zi={2}
                pe="none"
                ai="center"
                jc="center"
                scale={1.2}
                y={-30}
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
                x={-10}
                y={-50}
                o={0.5}
                scale={1.03}
              >
                <TAKEOUT color="$background" className="" />
              </YStack>

              <YStack
                position="absolute"
                top={360}
                r="-10%"
                $sm={{ r: '-40%' }}
                $md={{ r: '-30%' }}
                $lg={{ r: '-20%' }}
                zIndex={-1}
              >
                {enable3d && (
                  <Suspense fallback={null}>
                    <TakeoutBox3D />
                  </Suspense>
                )}
              </YStack>
            </YStack>
          </YStack>

          <YStack t={heroHeight - 1000} l={-100} pos="absolute" b={0} zi={-3}>
            <Separator o={0.75} vertical h={4100} pos="absolute" l={0.5} />
            <Separator o={0.75} vertical h={4100} pos="absolute" r={0} />

            <YStack t={750} px="$6">
              <Separator o={0.75} w={3000} pos="absolute" t={0.5} l={-1000} />
              <Separator o={0.75} w={3000} pos="absolute" b={0} l={-1000} />

              <YStack mb="$6" space="$4">
                <H2 ta="right" fontFamily="$munro">
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
              p="$8"
              mt={20}
              $md={{
                flexDirection: 'column',
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
                <MunroP className="mix-blend pixelate" mt={-180} mb={-20} size="$7">
                  Jumpstart your startup
                </MunroP>

                <ThemeTint>
                  <H2
                    className="clip-text mix-blend"
                    size="$13"
                    color="$color10"
                    style={{
                      // @ts-ignore
                      backgroundImage: `-webkit-linear-gradient(var(--color9), var(--yellow9))`,
                    }}
                    $sm={{
                      size: '$10',
                    }}
                  >
                    From idea to shipped in less time than ever.
                  </H2>
                </ThemeTint>

                <XStack space="$6" spaceDirection="horizontal">
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                </XStack>

                <Paragraph size="$9" fow="400" $sm={{ size: '$8' }}>
                  We can't promise the 🌕 or the ✨ (success is up to you) but if you want
                  a cheat code to shipping a stunning web & native mobile app fast, you've
                  found it.
                </Paragraph>

                <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                  Takeout 🥡 is a novel bootstrap that delivers on years of effort putting
                  together a stack that gives you nearly a whole startup in a box on day
                  one. And of course it's powered by Tamagui, the best frontend UI system
                  around.
                </Paragraph>

                <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                  Within an hour you'll be deploying your app on the web to Vercel (with
                  easy configuration of other providers), as well as production-ready
                  builds for iOS and Android via Expo EAS.
                </Paragraph>

                <Points />

                <YStack marginTop={-450} marginBottom={-500} x={400} zi={-1}>
                  <Image
                    alt="iPhone screenshot of Tamagui"
                    src="/iphone.png"
                    width={863}
                    height={928}
                  />
                </YStack>

                <Separator className="mix-blend" boc="#fff" o={0.25} my="$8" mx="$8" />

                <YStack p="$6" className="blur-medium" space="$6" elevation="$4">
                  <YStack zi={-1} fullscreen bc="$color" o={0.1} />

                  <Paragraph
                    fontFamily="$munro"
                    size="$12"
                    $sm={{ size: '$7' }}
                    fow="800"
                  >
                    Speedrun from 0-to-100 🥡
                  </Paragraph>

                  <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                    It's not just about shipping fast, it's the long run.
                  </Paragraph>

                  <Paragraph size="$8" $sm={{ size: '$7' }} fow="400">
                    The template repo is designed with pluggable features that are
                    well-isolated. Then we install a Github bot that sends a PR whenever
                    we make an update.
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
                    choose from:
                  </Paragraph>

                  <YStack tag="ul" space="$3">
                    <Point>Simple state management system</Point>
                    <Point>Reanimated integration</Point>
                    <Point>Layout animations</Point>
                    <Point>Entire Google font library</Point>
                    <Point>Maestro native integration testing</Point>
                    <Point>Notifications</Point>
                  </YStack>

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

                <XStack space="$6" spaceDirection="horizontal">
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                </XStack>

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

          <YStack pos="absolute" t={150} r={-520} rotate="120deg" o={0.025} zi={-2}>
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

const Point = (props: { children: any; subtitle?: any }) => {
  return (
    <ThemeTint>
      <XStack tag="li" ai="flex-start" space ml="$4" f={1} ov="hidden">
        <YStack py="$1.5">
          <Check size={16} color="$color10" />
        </YStack>
        <YStack f={1}>
          <Paragraph wordWrap="break-word" size="$6" $sm={{ size: '$6' }}>
            {props.children}
          </Paragraph>
          {!!props.subtitle && (
            <Paragraph size="$3" theme="gray_alt2" o={0.5}>
              {props.subtitle}
            </Paragraph>
          )}
        </YStack>
      </XStack>
    </ThemeTint>
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
  const { subscriptions } = useUser()
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
          mah={900}
        >
          <YStack h="100%" space>
            <Dialog.Title size="$8" my="$3" als="center">
              Purchase 🥡
            </Dialog.Title>

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

              <YStack f={1} space="$2">
                <H3>Seats</H3>
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
                  top="$3"
                  right="$3"
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
            h={100}
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
              <Paragraph fontFamily="$munro" size="$3" theme="alt2">
                Drop 0001
              </Paragraph>

              <Paragraph fontFamily="$munro" size="$10">
                {product?.name}
              </Paragraph>

              <YStack>
                <Row
                  title="Template"
                  description="Complete Github Template with a built-in bot to send PRs with updates."
                  after="01"
                />

                <Row
                  title="Monorepo"
                  description="Complete with Next.js, Vercel deploy, Expo Native and Web, and EAS."
                  after="01"
                />

                <Row
                  title="Screens"
                  description="Tab bar, Stack view, Onboarding, Auth, Profile, Edit Profile, Account, Settings, Feed and more."
                  after="08"
                />

                <Row
                  title="Icons"
                  description="A whopping ~100k icons in total across 30 different packs, tree-shakeable, from icones.js.org."
                  after="30"
                />

                <Row
                  title="Fonts"
                  description="Three new fonts join the party, with more being added each month."
                  after="03"
                />

                <Row
                  title="Themes"
                  description="Two all new theme suites join Tamagui - Pastel and Neon - that bring a more muted or more bright feel to your app."
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
              </YStack>

              <Spacer f={1} minHeight={80} />
            </YStack>
          </ScrollView>
        </TakeoutCardFrame>
      </ThemeTint>
    </div>
  )
})

function PurchaseButton(props: ButtonProps) {
  return (
    <Theme name="pink">
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
        <Button.Text fontWeight="700">{props.children}</Button.Text>
      </Button>
    </Theme>
  )
}

const Row = (props: { title: any; description: any; after: any }) => {
  const media = useMedia()
  const [showDetail, setShowDetail] = useState(false)

  return (
    <XStack
      bbw={1}
      boc="$borderColor"
      px="$4"
      mx="$-4"
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
          theme="alt2"
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
    ta="center"
    {...props}
  >
    Take
    <br />
    out
  </H1>
)

TakeoutPage.getLayout = (page, pageProps) =>
  withSupabase(getDefaultLayout(page, pageProps), pageProps)

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
        backgroundColor: '$color7',
        opacity: 1,
      })}
      {...props}
    />
  )
}

const Points = () => (
  <YStack tag="ul" space="$3" zi={2} mt="$8" maw={660} ov="hidden">
    <Point>React (web, native, ios) monorepo sharing a single codebase</Point>
    <Point>
      All the important screens: onboard, auth, account, settings, profile, tabs, and more
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

const Glow = () => {
  const glow = useHoverGlow({
    resist: 85,
    size: 800,
    strategy: 'blur',
    offset: {
      x: -300,
      y: -200,
    },
    blurPct: 100,
    color: 'var(--color10)',
    opacity: 0.2,
    background: 'transparent',
  })
  const glow2 = useHoverGlow({
    resist: 85,
    size: 800,
    strategy: 'blur',
    offset: {
      x: 300,
      y: 200,
    },
    blurPct: 100,
    color: 'var(--color10)',
    opacity: 0.2,
    background: 'transparent',
  })

  return (
    <ContainerXL ref={composeRefs(glow.parentRef as any, glow2.parentRef as any)}>
      <YStack fullscreen>
        <ThemeTint>
          <glow.Component />
        </ThemeTint>
      </YStack>
      <YStack fullscreen>
        <ThemeTintAlt>
          <glow2.Component />
        </ThemeTintAlt>
      </YStack>
    </ContainerXL>
  )
}
