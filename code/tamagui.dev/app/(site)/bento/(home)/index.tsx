import { Calendar } from '@tamagui/bento/data'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { AlertCircle, Globe, Leaf, Puzzle } from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import {
  Button,
  Circle,
  EnsureFlexed,
  H3,
  H4,
  Paragraph,
  Spacer,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { BentoStore, ComponentSection } from '~/components/BentoComponentSection'
import { ContainerLarge } from '~/components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { BentoLogo } from '~/features/bento/BentoLogo'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { PageThemeCarousel } from '~/features/site/PageThemeCarousel'
import { useSubscriptionModal } from '~/features/site/purchase/useSubscriptionModal'
import { CodeInline } from '../../../../components/Code'

export default function BentoPage() {
  const store = useStore(BentoStore)

  return (
    <>
      <LoadCherryBomb />
      <script src="https://cdn.paritydeals.com/banner.js" />

      <HeadInfo
        title="Copy-paste UI for React Native and Web - Tamagui Bento"
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

      <PageThemeCarousel />

      <BentoPageFrame>
        <YStack
          onLayout={(e) => {
            store.heroHeight = e.nativeEvent.layout.height
          }}
        >
          <Hero />
          <Intermediate />
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
        pt={20}
        mb={-20}
        $sm={{
          fd: 'column',
        }}
      >
        <IntermediateCard Icon={Globe} title="Universal">
          Whether light or dark mode, native or web, or any screen size.
        </IntermediateCard>
        <IntermediateCard Icon={Puzzle} title="Copy & Paste">
          Customize to your design system, designed to be used independently.
        </IntermediateCard>
        <IntermediateCard Icon={Leaf} title="Free">
          Expanding free components. Lifetime&nbsp;rights paid.
        </IntermediateCard>
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
        <H4 o={0.5} ff="$silkscreen" color="$color11" className="text-glow" size="$2">
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

const Hero = () => {
  const { showAppropriateModal } = useSubscriptionModal()

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
            mt={60}
            maw="55%"
            zi={100}
            jc="space-between"
            f={10}
            ai="flex-start"
            $sm={{
              maw: '100%',
            }}
          >
            <YStack
              className="ms200 ease-in all"
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
              $md={{ mb: -100, scale: 0.72, transformOrigin: 'center top' }}
            >
              <BentoLogo scale={0.7} />
            </YStack>

            <Spacer size="$6" />

            <YStack maw={500} gap="$7" $sm={{ px: '$4', maw: 400, ml: 0 }}>
              <XStack gap="$6" px="$4">
                <Paragraph
                  ff="$mono"
                  fos={22}
                  lh={40}
                  color="$color11"
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
                  Copy-paste UI for React&nbsp;Native and&nbsp;React web, free and paid.
                </Paragraph>
              </XStack>
              <XStack
                jc="space-between"
                ai="center"
                ml="$8"
                mr="$4"
                $md={{ mx: 0, fd: 'column', gap: '$3' }}
              >
                <Paragraph
                  fontFamily="$mono"
                  color="$color10"
                  size="$5"
                  $md={{ size: '$3' }}
                >
                  One-time Purchase
                </Paragraph>

                <Circle size={4} bg="$color10" $md={{ dsp: 'none' }} />

                <XStack ai="center" jc="space-between">
                  <Spacer />
                  <Theme name="green">
                    <Button
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
                        showAppropriateModal()
                      }}
                    >
                      <Button.Text fontFamily="$mono" size="$4">
                        Pro
                      </Button.Text>
                    </Button>
                  </Theme>
                </XStack>

                <Circle size={4} bg="$color10" $md={{ dsp: 'none' }} />

                <Paragraph
                  fontFamily="$mono"
                  color="$color10"
                  size="$5"
                  $md={{ size: '$3' }}
                >
                  Lifetime rights
                </Paragraph>
              </XStack>
            </YStack>
          </YStack>

          {/* disable - bento-get has a bug atm */}
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
            <XStack
              bw={0.5}
              bc="$color02"
              maw={300}
              als="center"
              br="$6"
              ov="hidden"
              className="blur-8"
              elevation="$3"
            >
              <YStack py="$3.5" px="$4" f={1}>
                <H3 ff="$silkscreen" size="$2" color="$color12" mb="$1.5">
                  The latest
                </H3>
                <Paragraph ff="$mono" color="$color12" size="$3" lh="$2">
                  Use <CodeInline ff="$mono">npx bento-get</CodeInline> to search and copy
                  directly to your repo.
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
                    <Calendar showTabs={false} />
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
                    <Calendar showTabs={false} />
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
                    <Calendar showTabs={false} />
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
                <Calendar showTabs={false} />
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
                    <Calendar showTabs={false} />
                  </Theme>
                </ThemeTint>
              </YStack>
            </XStack>
          </YStack>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}
