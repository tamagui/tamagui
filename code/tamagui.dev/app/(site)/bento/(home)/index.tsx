import { assertIsError } from '@tamagui/assert'
import { LocationNotification } from '@tamagui/bento/data'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import {
  AlertCircle,
  ChevronDown,
  Globe,
  Leaf,
  Puzzle,
  Search,
  ShoppingCart,
} from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import {
  Button,
  Circle,
  EnsureFlexed,
  H3,
  H4,
  Paragraph,
  Spacer,
  Stack,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { useLoader } from 'one'
import { CodeInline } from '~/components/Code'
import { ContainerLarge } from '~/components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { BentoLogo } from '~/features/bento/BentoLogo'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import type { ProComponentsProps } from '~/features/bento/types'
import { LoadCherryBomb, LoadMunro } from '~/features/site/fonts/LoadFonts'
import { PurchaseModal } from '~/features/site/purchase/PurchaseModal'
import { getProductsForServerSideRendering } from '~/features/site/purchase/server-helpers'
import { useTakeoutStore } from '~/features/site/purchase/useTakeoutStore'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'
import { ComponentSection, BentoStore } from '~/components/ComponentSection'
import { PageThemeCarousel } from '../../../../features/site/PageThemeCarousel'

export const loader = async () => {
  try {
    const products = await getProductsForServerSideRendering()
    return products
  } catch (err) {
    assertIsError(err)
    console.error(`Error getting props`, err.message)
    return { bento: null, fontsPack: null, iconsPack: null, starter: null }
  }
}

export default function BentoPage() {
  const data = useLoader(loader)
  const store = useStore(BentoStore)

  return (
    <>
      <LoadCherryBomb />
      <LoadMunro />
      <script src="https://cdn.paritydeals.com/banner.js" />
      <HeadInfo
        title="🍱 Tamagui Bento"
        description="Tamagui Bento - Copy-paste components and screens for React and React Native"
        openGraph={{
          url: 'https://tamagui.dev/bento',
          images: [
            {
              url: 'https://tamagui.dev/bento/social.png',
            },
          ],
        }}
      />

      {data.bento && (
        <PurchaseModal bento={data.bento} defaultValue="bento" starter={data.starter} />
      )}

      <Theme name="tan">
        <ThemeNameEffect colorKey="$color6" />
      </Theme>

      <PageThemeCarousel />

      {/* <BentoFrond /> */}

      <BentoPageFrame>
        <ContainerLarge
          zi={10}
          h={0}
          // offset for the banner
          mt={30}
        >
          {/* <Theme name="tan">
            <Button
              pos="absolute"
              t="$-4"
              r="$8"
              size="$2"
              circular
              icon={store.heroVisible ? Search : ChevronDown}
              onPress={() => {
                store.heroVisible = !store.heroVisible
              }}
              bg="$background02"
            ></Button>
          </Theme> */}
        </ContainerLarge>
        <YStack
          onLayout={(e) => {
            store.heroHeight = e.nativeEvent.layout.height
          }}
        >
          <Theme name="tan">
            <Hero mainProduct={data.bento!} />

            {/* <YStack pos="relative" zi={10000}>
            <ContainerLarge>
              <YStack pos="absolute" t={-50} r={80} rotate="-10deg">
                <BentoIcon scale={3} />
              </YStack>
            </ContainerLarge>
          </YStack> */}

            {/* <Intermediate /> */}
          </Theme>
        </YStack>
        <ComponentSection />
      </BentoPageFrame>
    </>
  )
}

const Intermediate = () => {
  return (
    <ContainerLarge zi={1000}>
      <XStack
        gap="$4"
        py="$6"
        pt={0}
        $sm={{
          fd: 'column',
        }}
      >
        <ThemeTintAlt offset={-1}>
          <IntermediateCard Icon={Globe} title="Universal">
            Whether light or dark mode, native or web, or any screen size.
          </IntermediateCard>
        </ThemeTintAlt>
        <ThemeTintAlt offset={0}>
          <IntermediateCard Icon={Puzzle} title="Copy & Paste">
            Customize to your design system, designed to be used independently.
          </IntermediateCard>
        </ThemeTintAlt>
        <ThemeTintAlt offset={1}>
          <IntermediateCard Icon={Leaf} title="Free">
            Expanding free components. Lifetime&nbsp;rights paid.
          </IntermediateCard>
        </ThemeTintAlt>
      </XStack>
    </ContainerLarge>
  )
}

const IntermediateCard = ({
  title,
  children,
  Icon,
}: { title?: any; children?: any; Icon?: any }) => {
  return (
    <XStack className="" ov="hidden" f={1} gap="$5" px="$5" py="$4">
      <YStack f={1} gap="$2">
        <H4 ff="$silkscreen" color="$color11" className="text-glow" size="$2">
          {title}
        </H4>
        <Paragraph mb={-5} size="$3" color="$color12" o={0.7}>
          {children}
        </Paragraph>
        <EnsureFlexed />
      </YStack>
      <Circle
        outlineColor="$color02"
        outlineOffset={-4}
        outlineWidth={1}
        outlineStyle="solid"
        size="$5"
        elevation="$0.5"
        backdropFilter="blur(5px)"
        // bg="$color02"
      >
        <Icon color="$color11" o={0.85} />
      </Circle>
    </XStack>
  )
}

const Hero = ({ mainProduct }: { mainProduct: ProComponentsProps['bento'] }) => {
  const store = useTakeoutStore()

  return (
    <YStack pos="relative" zi={10}>
      <ContainerLarge>
        <XStack
          gap="$6"
          pb="$3"
          bc="transparent"
          jc="space-between"
          w={'100%'}
          $sm={{
            fd: 'column',
          }}
        >
          <YStack
            mb={40}
            mt={30}
            maw="55%"
            zi={100}
            jc="space-between"
            f={10}
            ai="flex-start"
            gap="$6"
            $sm={{
              maw: '100%',
            }}
          >
            <YStack
              className="ms200 ease-in all"
              h={180}
              $xxs={{
                scale: 0.4,
              }}
              $xs={{
                scale: 0.5,
              }}
              $sm={{
                als: 'center',
                scale: 0.6,
                mb: -100,
                transformOrigin: 'center top',
              }}
              $md={{ mb: -100, scale: 0.72, transformOrigin: 'left top' }}
              $lg={{ scale: 0.9, y: 10 }}
            >
              <BentoLogo scale={0.94} />
            </YStack>
            <YStack
              // account for the left bar visual offset
              ml={-20}
              als="center"
              maw={550}
              gap="$7"
              $sm={{ px: '$4', maw: 400, ml: 0 }}
            >
              <XStack gap="$6">
                <Stack
                  pos="relative"
                  bg="$color9"
                  w={6}
                  br="$2"
                  my={18}
                  $sm={{ dsp: 'none' }}
                />
                <Paragraph
                  className="pixelate"
                  ff="$munro"
                  fos={26}
                  lh={46}
                  color="$color11"
                  ls={1}
                  maxHeight={120}
                  $md={{
                    mt: '$6',
                    fos: 22,
                    lh: 38,
                  }}
                  $sm={{
                    ta: 'center',
                  }}
                >
                  Copy-paste styled components for React&nbsp;Native and web, free and
                  paid.
                </Paragraph>
              </XStack>
              <XStack
                jc="space-between"
                ai="center"
                ml="$8"
                mr="$4"
                $md={{ mx: 0, fd: 'column', gap: '$3' }}
              >
                <Paragraph color="$color10" size="$5" $md={{ size: '$3' }}>
                  One-time Purchase
                </Paragraph>

                <Circle size={4} bg="$color10" $md={{ dsp: 'none' }} />

                <XStack ai="center" jc="space-between">
                  <Spacer />
                  <Theme name="green">
                    {/* $199 */}
                    <Button
                      iconAfter={<ShoppingCart y={-0.5} x={-1} />}
                      className="box-3d all ease-in-out ms100"
                      size="$3"
                      scaleSpace={0.75}
                      als="flex-end"
                      mr="$4"
                      color="$color1"
                      bg="$color9"
                      outlineColor="$background02"
                      outlineOffset={2}
                      outlineWidth={3}
                      outlineStyle="solid"
                      hoverStyle={{
                        bg: '$color10',
                        outlineColor: '$background04',
                        bc: '$color11',
                      }}
                      pressStyle={{
                        bg: '$color9',
                        outlineColor: '$background06',
                      }}
                      onPress={() => {
                        store.showPurchase = true
                      }}
                    >
                      <Button.Text
                        fontFamily="$silkscreen"
                        size="$6"
                        ls={-2}
                        y={-0.5}
                        x={-1}
                      >
                        <sup
                          style={{
                            fontSize: '60%',
                            display: 'inline-flex',
                            marginTop: -12,
                            transform: `translateY(2px)`,
                            marginRight: 5,
                          }}
                        >
                          $
                        </sup>
                        {(mainProduct?.prices.sort(
                          (a, b) =>
                            (a.unit_amount || Infinity) - (b.unit_amount || Infinity)
                        )[0].unit_amount || 0) / 100}
                      </Button.Text>
                    </Button>
                  </Theme>
                </XStack>

                <Circle size={4} bg="$color10" $md={{ dsp: 'none' }} />

                <Paragraph color="$color10" size="$5" $md={{ size: '$3' }}>
                  Lifetime rights
                </Paragraph>
              </XStack>
            </YStack>
          </YStack>

          <YStack
            pos="absolute"
            b="6%"
            r="$2"
            zi={100}
            $sm={{
              pos: 'relative',
              mt: -30,
              mb: 20,
            }}
          >
            <Theme name="green">
              <XStack
                bw="$1"
                bc="$color02"
                maw={300}
                als="center"
                br="$6"
                ov="hidden"
                className="blur-8"
              >
                <YStack o={0.5} bg="$color10" fullscreen br="$5" />
                <YStack py="$3.5" px="$4" f={1}>
                  <H3
                    ff="$silkscreen"
                    size="$2"
                    color="$color2"
                    mb="$1"
                    $theme-dark={{
                      color: '$color12',
                    }}
                  >
                    The latest
                  </H3>
                  <Paragraph
                    color="$color3"
                    size="$3"
                    lh="$2"
                    $theme-dark={{
                      color: '$color10',
                    }}
                  >
                    Use <CodeInline>npx bento-get</CodeInline> to search and copy any
                    component directly to your repo.
                  </Paragraph>
                </YStack>
                <AlertCircle
                  pos="absolute"
                  t="$3"
                  r="$3"
                  zi={100}
                  color="$color10"
                  size={16}
                />
              </XStack>
            </Theme>
          </YStack>

          <YStack
            className="ms300 ease-in all"
            mr={-300}
            ml={-150}
            maw={1000}
            mt={-125}
            pl={100}
            pr={300}
            pt={100}
            x={20}
            mb={-500}
            y={-20}
            style={{
              maskImage: `linear-gradient(rgba(0, 0, 0, 1) 40%, transparent 65%)`,
            }}
            $md={{
              mr: -400,
              mt: -150,
              scale: 0.9,
            }}
            $sm={{
              display: 'none',
            }}
          >
            <Theme name="gray">
              <XStack
                pe="none"
                style={{
                  transform: `rotate(4deg) scale(0.75)`,
                }}
                $sm={{
                  mt: -85,
                  mb: -60,
                }}
              >
                <YStack br="$4" shac="rgba(0,0,0,0.2)" shar="$8">
                  <ThemeTintAlt>
                    <Theme name="surface3">
                      <LocationNotification />
                    </Theme>
                  </ThemeTintAlt>
                </YStack>

                <YStack
                  pos="absolute"
                  zi={1}
                  l={0}
                  style={{
                    clipPath: `polygon(0% 0%, 105% 0%, 65% 100%, 0% 100%)`,
                  }}
                >
                  <ThemeTintAlt>
                    <Theme name="surface3">
                      <LocationNotification />
                    </Theme>
                  </ThemeTintAlt>
                </YStack>

                <YStack
                  pos="absolute"
                  zi={1}
                  l={0}
                  style={{
                    clipPath: `polygon(0% 0%, 75% 0%, 30% 100%, 0% 100%)`,
                  }}
                >
                  <ThemeTintAlt>
                    <Theme name="surface2">
                      <LocationNotification />
                    </Theme>
                  </ThemeTintAlt>
                </YStack>

                <YStack
                  pos="absolute"
                  zi={1}
                  l={0}
                  style={{
                    clipPath: `polygon(0% 0%, 45% 0%, 0% 100%, 0% 100%)`,
                  }}
                >
                  <LocationNotification />
                </YStack>

                <YStack
                  pos="absolute"
                  zi={-1}
                  l="15%"
                  scale={0.9}
                  rotate="5deg"
                  br="$4"
                  shac="rgba(0,0,0,0.2)"
                  shar="$8"
                >
                  <ThemeTint>
                    <Theme name="surface3">
                      <LocationNotification />
                    </Theme>
                  </ThemeTint>
                </YStack>
              </XStack>
            </Theme>
          </YStack>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}
