import { assertIsError } from '@tamagui/assert'
import { LocationNotification, listingData } from '@tamagui/bento/data'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import {
  AlertCircle,
  BadgeAlert,
  Banana,
  BellDot,
  Calendar,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  CircleUserRound,
  Cog,
  FormInput,
  Globe,
  Image,
  Layout,
  Leaf,
  List,
  MessageSquareShare,
  MousePointerClick,
  NotebookTabs,
  PanelLeft,
  PanelTop,
  Puzzle,
  RectangleHorizontal,
  Search,
  ShoppingBag,
  ShoppingCart,
  Table,
  TextCursorInput,
  ToggleRight,
} from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import { useMemo, useRef, useState } from 'react'
import {
  Button,
  Circle,
  EnsureFlexed,
  H3,
  H4,
  H5,
  Input,
  Paragraph,
  ScrollView,
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
import { Link } from '~/components/Link'
import { BentoLogo } from '~/features/bento/BentoLogo'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import type { ProComponentsProps } from '~/features/bento/types'
import { BentoIcon } from '~/features/icons/BentoIcon'
import { LoadCherryBomb, LoadMunro } from '~/features/site/fonts/LoadFonts'
import { PurchaseModal } from '~/features/site/purchase/PurchaseModal'
import { getProductsForServerSideRendering } from '~/features/site/purchase/server-helpers'
import { useTakeoutStore } from '~/features/site/purchase/useTakeoutStore'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export const loader = async () => {
  try {
    return await getProductsForServerSideRendering()
  } catch (err) {
    assertIsError(err)
    console.error(`Error getting props`, err.message)
    return { bento: null, fontsPack: null, iconsPack: null, starter: null }
  }
}

class BentoStore {
  heroVisible = true
  heroHeight = 800
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
        <PurchaseModal
          bento={data.bento}
          defaultValue="bento"
          fontsPack={data.fontsPack}
          iconsPack={data.iconsPack}
          starter={data.starter}
        />
      )}

      <Theme name="tan">
        <ThemeNameEffect colorKey="$color6" />
      </Theme>

      {/* <BentoFrond /> */}

      <BentoPageFrame>
        <ContainerLarge
          zi={10}
          h={0}
          // offset for the banner
          mt={30}
        >
          <Theme name="tan">
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
              bg="$background025"
            ></Button>
          </Theme>
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

            <Intermediate />
          </Theme>
        </YStack>
        <Body />
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
            Components that adapt well to all screen sizes and platforms.
          </IntermediateCard>
        </ThemeTintAlt>
        <ThemeTintAlt offset={0}>
          <IntermediateCard Icon={Puzzle} title="Copy & Paste">
            Customize to your design system, designed to be used independently.
          </IntermediateCard>
        </ThemeTintAlt>
        <ThemeTintAlt offset={1}>
          <IntermediateCard Icon={Leaf} title="Growing">
            We continuously improve and add to the collection.
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
        outlineColor="$color025"
        outlineOffset={-4}
        outlineWidth={1}
        outlineStyle="solid"
        size="$5"
        elevation="$0.5"
        backdropFilter="blur(5px)"
        // bg="$color025"
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
              h={200}
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
              <BentoLogo />
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
                  fos={28}
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
                  Boost your React development with a suite
                  of&nbsp;copy-paste&nbsp;primitives.&nbsp;
                  <YStack
                    my={-20}
                    tag="span"
                    dsp="inline-flex"
                    y={3}
                    $sm={{ scale: 0.8, y: 7 }}
                  >
                    <BentoIcon bright scale={1.2} />
                  </YStack>
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
                      // iconAfter={
                      //   <YStack
                      //     zi={100}
                      //     bg="red"
                      //     style={{
                      //       background: `url(/bento/bentoicon.svg)`,
                      //       backgroundSize: 'contain',
                      //     }}
                      //     w={42}
                      //     h={42}
                      //     ml={-10}
                      //     mr={-15}
                      //   />
                      // }
                      className="box-3d all ease-in-out ms100"
                      size="$3"
                      scaleSpace={0.75}
                      als="flex-end"
                      mr="$4"
                      color="$color1"
                      bg="$color9"
                      outlineColor="$background025"
                      outlineOffset={2}
                      outlineWidth={3}
                      outlineStyle="solid"
                      hoverStyle={{
                        bg: '$color10',
                        outlineColor: '$background05',
                        bc: '$color11',
                      }}
                      pressStyle={{
                        bg: '$color9',
                        outlineColor: '$background075',
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
                bc="$color025"
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
                    <Theme name="surface4">
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

const Body = () => {
  const inputRef = useRef<HTMLInputElement>()
  const [filter, setFilter] = useState('')
  const store = useStore(BentoStore)

  const filteredSections = useMemo(() => {
    if (!filter) return listingData.sections
    return listingData.sections
      .map(({ sectionName, parts }) => {
        const filteredParts = parts.filter((part) => {
          return part.name.toLowerCase().includes(filter.toLowerCase())
        })
        return filteredParts.length
          ? {
              sectionName,
              parts: filteredParts,
            }
          : (undefined as never)
      })
      .filter(Boolean)
  }, [filter])

  return (
    <YStack
      theme="tan"
      bg="$color1"
      pos="relative"
      contain="paint"
      className="transform ease-in-out ms200"
      // @ts-ignore
      onTransitionEnd={() => {
        if (!store.heroVisible) {
          inputRef.current?.focus()
        }
      }}
      pb="$8"
      y={0}
      minHeight={800}
      {...(!store.heroVisible && {
        y: -store.heroHeight + 20,
        shadowColor: '$shadowColor',
        shadowRadius: 20,
      })}
      zi={10000}
    >
      <YStack
        fullscreen
        zi={0}
        $theme-light={{
          bg: '$color5',
        }}
        $theme-dark={{ bg: '#000' }}
      />
      <YStack>
        <ContainerLarge>
          <Input
            unstyled
            ref={inputRef as any}
            w="100%"
            size="$5"
            px="$3"
            my="$3"
            fow="200"
            value={filter}
            onChangeText={setFilter}
            placeholder="Filter..."
            placeholderTextColor="rgba(150,150,150,0.5)"
            zi={100}
          />
        </ContainerLarge>

        {filteredSections.map(({ sectionName, parts }) => {
          return (
            <YStack id={sectionName} key={sectionName} jc={'space-between'}>
              <Theme name="tan">
                <YStack pos="relative">
                  <YStack
                    fullscreen
                    o={0.15}
                    style={{
                      background: 'linear-gradient(transparent, var(--background025))',
                    }}
                  />
                  <ContainerLarge>
                    <YStack py="$2" px="$3" pos="relative">
                      <H3
                        ff="$silkscreen"
                        size="$3"
                        fos={12}
                        ls={3}
                        tt="uppercase"
                        color="$color10"
                        f={2}
                      >
                        {`${sectionName[0].toUpperCase()}${sectionName.slice(1)}`}
                      </H3>
                    </YStack>
                  </ContainerLarge>
                </YStack>
              </Theme>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  minWidth: '100%',
                }}
              >
                <ContainerLarge>
                  <Theme name="tan">
                    <XStack
                      gap="$5"
                      f={4}
                      fs={1}
                      $gtMd={{
                        maw: '100%',
                        fw: store.heroVisible ? 'wrap' : 'nowrap',
                        gap: 0,
                      }}
                    >
                      {parts.map(({ name: partsName, numberOfComponents, route }) => (
                        <SectionCard
                          key={route + partsName + numberOfComponents.toString()}
                          path={route}
                          name={partsName}
                          numberOfComponents={numberOfComponents}
                          // preview={preview}
                        />
                      ))}

                      {/* @ts-ignore */}
                      <Spacer width="calc(50vw - 300px)" $gtMd={{ dsp: 'none' }} />
                    </XStack>
                  </Theme>
                </ContainerLarge>
              </ScrollView>
            </YStack>
          )
        })}
      </YStack>
    </YStack>
  )
}

const Null = () => null

function SectionCard({
  name,
  numberOfComponents,
  path,
}: {
  name: string
  numberOfComponents: number
  path: string
}) {
  const Icon = icons[name] ?? Null

  return (
    <Link href={(BASE_PATH + path) as any} asChild>
      <YStack
        tag="a"
        ov="hidden"
        // className="all ease-in ms100"
        // elevation="$6"
        // bg="$background025"
        w={220}
        h={130}
        // br="$9"
        cursor="pointer"
        pos="relative"
        hoverStyle={{
          bg: `rgba(150,150,150,0.035)`,
        }}
        pressStyle={{
          bg: 'rgba(150,150,150,0.05)',
          y: 1,
        }}
        bg="rgba(150,150,150,0.025)"
        mt="$3"
        br="$6"
        $gtMd={{
          bg: 'rgba(255,255,255,0)',
          w: 'calc(25% - 14px)',
          br: '$6',
          m: '$2',
        }}
      >
        <YStack f={1} p="$4">
          <Theme name="gray">
            <H4 ff="$body" size="$4" fow="600" color="$color12">
              {name}
            </H4>
          </Theme>

          <H5 theme="alt1" size="$1" ls={1}>
            {numberOfComponents} components
          </H5>

          <YStack
            // className="mask-gradient-down"
            pos="absolute"
            t="$4"
            r="$4"
            rotate="20deg"
            p="$2"
            o={0.4}
          >
            <Icon size={25} color="$color10" />
          </YStack>
        </YStack>
      </YStack>
    </Link>
  )
}

const icons = {
  Inputs: TextCursorInput,
  Checkboxes: CheckSquare,
  Layouts: Layout,
  RadioGroups: CheckCircle,
  Switches: ToggleRight,
  Textareas: FormInput,
  'Image Pickers': Image,
  List: List,
  Avatars: CircleUserRound,
  Buttons: RectangleHorizontal,
  DatePickers: Calendar,
  Tables: Table,
  Chips: BadgeAlert,
  Dialogs: MessageSquareShare,
  Navbar: PanelTop,
  Sidebar: PanelLeft,
  Tabbar: NotebookTabs,
  Microinteractions: MousePointerClick,
  Slide: Banana,
  Cart: ShoppingCart,
  'Product Page': ShoppingBag,
  Preferences: Cog,
  'Event Reminders': BellDot,
}

const BASE_PATH = ' /bento'
