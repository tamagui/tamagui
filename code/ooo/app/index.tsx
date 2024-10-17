import {
  BoxSelect,
  Database,
  Download,
  FileStack,
  Folder,
  FolderCheck,
  Loader,
  TabletSmartphone,
  Triangle,
  X,
} from '@tamagui/lucide-icons'
import { useState, type KeyboardEvent } from 'react'
import {
  Circle,
  EnsureFlexed,
  H5,
  Paragraph,
  Portal,
  Spacer,
  Text,
  Tooltip,
  View,
  XStack,
  YStack,
  styled,
} from 'tamagui'
import { Button } from '~/components/Button'
import { Community } from '~/components/Community'
import { Hint } from '~/components/Hint'
import { Team } from '~/components/Team'
import { PrettyText, PrettyTextBigger, PrettyTextBiggest } from '~/components/typography'
import { OneBall, OneLogo } from '~/features/brand/Logo'
import { useClipboard } from '~/features/docs/useClipboard'
import { ContainerSm } from '~/features/site/Containers'
import { Footer } from '~/features/site/Footer'
import { HeadInfo } from '~/features/site/HeadInfo'
import { Link } from '~/features/site/Link'
import { SocialLinksRow } from '~/features/site/SocialLinksRow'
import { ToggleThemeButton } from '~/features/theme/ThemeToggleButton'

const ButtonText = styled(Text, {
  lh: 0,
  animation: 'quickest',
  color: '$color13',
  fontWeight: '600',
  '$theme-dark': {
    color: '$color6',
  },
})

export default function HomePage() {
  return (
    <>
      <HeadInfo
        title="One, a React Framework"
        description="One is a React framework focused on simplicity that lets you target both web and native at once with a single Vite plugin."
      />

      <Spacer size="$8" $gtSm={{ size: '$4' }} />

      <ContainerSm>
        <XStack jc="space-between" mb="$2">
          <View
            group
            containerType="normal"
            pos="relative"
            scale={0.9}
            ml={-10}
            mt={-5}
            $sm={{ scale: 0.75, mx: -32, my: -28 }}
          >
            <OneLogo animate />
          </View>

          <View
            jc="center"
            fd="row-reverse"
            gap="$4"
            ai="center"
            contain="paint layout"
            $sm={{
              gap: '$3',
              fd: 'column',
              ai: 'flex-end',
              mt: -20,
            }}
          >
            <XStack ai="center" gap="$4" $sm={{ jc: 'center' }}>
              <ToggleThemeButton />
              <Link href="/docs/introduction" asChild>
                <Button
                  size="$5"
                  bg="$color9"
                  br="$10"
                  group
                  animation="quickest"
                  containerType="normal"
                  gap={0}
                  bw={0}
                  bc="$color10"
                  $theme-light={{
                    hoverStyle: {
                      bg: '$color5',
                      bc: '$color11',
                    },
                    pressStyle: {
                      bg: '$color9',
                      bc: '$color11',
                    },
                  }}
                  $theme-dark={{
                    hoverStyle: {
                      bg: '$color10',
                    },
                    pressStyle: {
                      bg: '$color9',
                    },
                  }}
                >
                  <ButtonText $sm={{ dsp: 'none' }}>Get started</ButtonText>
                  <ButtonText $gtSm={{ dsp: 'none' }}>Docs</ButtonText>
                </Button>
              </Link>
            </XStack>

            <XStack
              group="card"
              containerType="normal"
              ai="center"
              gap="$2"
              $sm={{ jc: 'center' }}
            >
              <SocialLinksRow />
            </XStack>
          </View>
        </XStack>

        <View gap="$3">
          <PrettyTextBiggest
            color="$color13"
            mt={10}
            mb={-2}
            $sm={{ mt: 20, scale: 1 }}
            scale={0.95}
            transformOrigin="left center"
          >
            Creating websites and&nbsp;apps is simply too complex.
          </PrettyTextBiggest>

          <PrettyTextBigger intro>
            One is a new React framework for web and{' '}
            <Hint hintContents={<>One makes Vite fully support React Native.</>}>
              native
            </Hint>
            , built on Vite. It&nbsp;simplifies things with{' '}
            <Hint tint="green" hintContents="Unified file system routes, web and native.">
              universal
            </Hint>
            , <Link href="/docs/routing">typed routing</Link> seamlessly across{' '}
            <Hint tint="purple" hintContents="SSG - Rendered to HTML during build.">
              static
            </Hint>
            ,{' '}
            <Hint tint="red" hintContents="SSR - Rendered to HTML for each request.">
              server
            </Hint>
            , and{' '}
            <Hint tint="pink" hintContents="SPA - No servers or build, just client-side.">
              client
            </Hint>{' '}
            pages. Plus, an amazing new solution&nbsp;to&nbsp;data.
          </PrettyTextBigger>

          <XStack
            my="$5"
            als="center"
            ai="center"
            jc="center"
            gap="$1"
            px="$6"
            bw={0.5}
            bc="$color4"
            py={12}
          >
            <Corners />

            <Text
              $sm={{ dsp: 'none' }}
              lh={0}
              mr={10}
              ff="$body"
              ls={-0.25}
              fontSize={24}
              als="center"
              // o={0.5}
            >
              Give it a run:
            </Text>

            <CopyCommand />
          </XStack>

          <YStack>
            <Video />

            <InfoBoxes />

            <View
              id="zero"
              contain="paint layout"
              background="linear-gradient(var(--color7), var(--color6))"
              $theme-dark={{
                background: 'linear-gradient(var(--color3), var(--color1))',
              }}
              className="local-shadows tinted"
              br="$10"
              px="$5"
              py="$10"
              mx={'$-5'}
              gap="$5"
              $gtSm={{ px: '$9', py: '$8', pb: '$5', mx: '$0' }}
            >
              <PrettyTextBiggest
                color="$color12"
                mb={-10}
                mt={15}
                fontSize={80}
                lineHeight={80}
                $md={{ size: '$10' }}
                $sm={{ size: '$9' }}
                $theme-dark={{
                  color: '$color10',
                }}
              >
                Local-focused
              </PrettyTextBiggest>

              <PrettyTextBigger style={{ textWrap: 'stable' }}>
                Simpler code, better results, cross-platform — that's&nbsp;the goal.
              </PrettyTextBigger>

              <PrettyTextBigger>
                With One and <a href="https://tamagui.dev">Tamagui</a>, we're
                close&#x2026; but there's still <em>one</em> big pain point.{' '}
                <b>Let's&nbsp;talk&nbsp;about&nbsp;data</b>.
              </PrettyTextBigger>

              <PrettyTextBigger>
                Native apps feel better and are easier to write thanks to client-side
                databases. Say&nbsp;bye&nbsp;to server boundaries, lose&nbsp;the glue
                code, mutate instantly, and have things
                Just&nbsp;Work™&nbsp;offline&#x2026;
              </PrettyTextBigger>

              <PrettyTextBigger>
                So, <b>why don't we use them on&nbsp;the&nbsp;web?</b>
              </PrettyTextBigger>

              <PrettyTextBigger>
                Well, web needs small bundles, and has limited storage. Add in sync,
                caching, composition&#x2026; there's 0 great options.
              </PrettyTextBigger>

              <PrettyTextBigger>
                It's why we're excited to partner with{' '}
                <b>
                  <Link target="_blank" href="https://zerosync.dev">
                    Zero
                  </Link>
                </b>{' '}
                to include it as the default, ejectable solution to data. Zero solves for
                all the above <Link href="/docs/data">and&nbsp;more</Link>. It even works
                with&nbsp;Postgres.
              </PrettyTextBigger>

              <PrettyTextBigger>
                One{' '}
                <View
                  tag="span"
                  dsp="inline-flex"
                  m={-2}
                  mr={5}
                  $sm={{ scale: 0.9, y: 5 }}
                >
                  <OneBall size={0.7} />
                </View>{' '}
                is working to make Zero great on server and client. Our proof of concept
                has no flickers, waterfalls, or config.
              </PrettyTextBigger>

              <PrettyTextBigger>We love it, and think you will too.</PrettyTextBigger>
              <Spacer />

              <Link asChild href="/docs/data">
                <Button
                  o={0.7}
                  hoverStyle={{
                    o: 0.5,
                  }}
                  tag="a"
                  pos="absolute"
                  b="$9"
                  r="$9"
                >
                  <ButtonText $theme-dark={{ color: '$color10' }}>Read More</ButtonText>
                </Button>
              </Link>
            </View>
          </YStack>

          <Spacer />

          {/* <EmailSignup />

          <Spacer /> */}

          <Link asChild href="https://testflight.apple.com/join/aNcDUHZY" target="_blank">
            <XStack
              tag="a"
              className="text-underline-none"
              my="$6"
              gap="$6"
              ai="center"
              jc="center"
              animation="medium"
              cur="pointer"
              bg="$color1"
              als="center"
              px="$4"
              py="$4"
              br="$9"
              hoverStyle={{
                y: -2,
                bg: '$color2',
              }}
              $sm={{
                fd: 'column',
              }}
            >
              <img width={80} height={80} src="/testflight.webp" alt="Testflight Icon" />

              <YStack>
                <PrettyText
                  ff="$perfectlyNineties"
                  mb="$1"
                  className="text-underline-none"
                  fontSize="$7"
                  lineHeight="$7"
                  cur="inherit"
                  color="$color"
                  $sm={{
                    size: '$5',
                  }}
                >
                  Demo
                </PrettyText>

                <PrettyText o={0.8} cur="inherit" maw={400}>
                  Check out our small sample app to see a One iOS app in motion. On
                  Testflight.
                </PrettyText>
              </YStack>
            </XStack>
          </Link>

          <Separator />

          <Community />

          <Separator />

          <Team />

          <Separator my="$8" />

          <Footer />
        </View>
      </ContainerSm>
    </>
  )
}

const InfoBoxes = () => {
  return (
    <XStack
      mx="$-8"
      fw="wrap"
      rowGap="$1"
      columnGap="$5"
      mb="$13"
      $sm={{ fd: 'column', mx: 0 }}
    >
      <InfoCard title="Typed  FS Routing" Icon={FolderCheck}>
        Simple file-system routes with nested layouts and groups, fully typed.
      </InfoCard>
      <InfoCard title="Routing Modes" Icon={FileStack}>
        SPA, SSR, or SSG? One lets you choose - globally <em>and</em> per-page.
      </InfoCard>
      <InfoCard title="Loaders" Icon={Loader}>
        Typed loaders make it easy to bring in data and migrate from other frameworks.
      </InfoCard>
      <InfoCard title="Web + Native" Icon={TabletSmartphone}>
        Build a website with React. Or a native app with React Native. Or both at once.
      </InfoCard>
      <InfoCard title="100% Vite" Icon={ViteIcon}>
        That's right, no more Metro. One Vite plugin, one Vite server, one port - three
        platforms.
      </InfoCard>
      <InfoCard title="The future of data" Icon={Database}>
        Coming soon, an integration with{' '}
        <a target="_blank" href="https://zerosync.dev" rel="noreferrer">
          ZeroSync
        </a>{' '}
        that will delight.
      </InfoCard>
    </XStack>
  )
}

const ViteIcon = (props) => <Triangle rotate="180deg" {...props} />

const InfoCard = ({ title, Icon, children }) => {
  return (
    <YStack
      pos="relative"
      width="calc(50% - var(--t-space-3))"
      mb="$4"
      py="$2"
      // br="$5"
      // bg="$background075"
      $sm={{ w: '100%', mb: '$2' }}
    >
      <YStack fullscreen o={0.25}>
        <Corners />
      </YStack>
      <YStack gap="$2" p="$4">
        <Icon als="flex-end" mb={-20} o={0.1} size={28} />
        <H5 size="$7" color="$color13" mt={-10}>
          {title}
        </H5>
        <PrettyText color="$color12">{children}</PrettyText>
      </YStack>
    </YStack>
  )
}

function Video() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <>
      {showVideo && (
        <Portal zi={1000}>
          <YStack
            position={'fixed' as any}
            t={0}
            l={0}
            r={0}
            b={0}
            zi={100_000}
            jc="center"
            ai="center"
            bg="rgba(0,0,0,0.95)"
            gap="$4"
            pe="auto"
            onPress={() => setShowVideo(false)}
          >
            <div className="video-background">
              <EnsureFlexed />
              <iframe
                src="https://www.youtube.com/embed/ZJH4bKkwo90?si=tIVSYmbpEY_0c4-8&amp;autoplay=1&amp;vq=hd1080p;hd=1&amp;modestbranding=1&amp;autohide=1&amp;showinfo=0&amp;rel=0"
                title="One Demo Video"
                style={{ maxWidth: '95%' }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <Button
              pos="absolute"
              t={10}
              r={10}
              br="$10"
              p="$2"
              onPress={() => setShowVideo(false)}
              aria-label="Close Video"
            >
              <X />
            </Button>
          </YStack>
        </Portal>
      )}

      <View
        als="center"
        miw={250}
        maw={350}
        h={290}
        mt={-33}
        mb={60}
        w="100%"
        ai="center"
        contain="size layout"
        group="card"
        containerType="normal"
        onPress={() => setShowVideo(true)}
        zi={0}
        className="video-glow"
      >
        <View
          animation="quick"
          als="center"
          maxWidth={380}
          w="100%"
          ov="hidden"
          cursor="pointer"
          tag="button"
          aria-label="Promo Video Launcher"
          backgroundColor="transparent"
          borderWidth={0}
          userSelect="none"
          y={10}
          $group-card-hover={{
            scale: 1.015,
            y: 0,
          }}
          $group-card-press={{
            scale: 0.95,
          }}
        >
          <YStack w="100%" h={205}>
            <div
              style={{
                backgroundImage: `url(/cover.webp)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'bottom center',
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </YStack>

          <View
            pos="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            ai="center"
            jc="center"
          >
            <Circle
              animation="bouncy"
              $group-card-hover={{
                y: 30,
              }}
              $group-card-press={{
                y: 30,
              }}
              y={35}
              ai="center"
              size={60}
              bg="$color9"
              shac="$shadowColorStrong"
              shar={10}
            >
              <svg
                style={{ marginTop: -10 }}
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
              >
                <polygon
                  style={{ transform: 'translateY(6px)' }}
                  points="35,25 75,50 35,75"
                  fill="var(--color12)"
                />
              </svg>
            </Circle>
          </View>
        </View>
        <Paragraph
          animation="quick"
          ff="$perfectlyNineties"
          size="$7"
          ta="center"
          w={340}
          zi={2}
          px="$5"
          pt={6}
          $theme-dark={{
            bg: '$color9',
            color: '$color2',
          }}
          pb={11}
          bg="$color2"
          br="$8"
          shac="$shadowColorStrong"
          shar={10}
          rotate="-1deg"
          cur="pointer"
          $group-card-hover={{
            rotate: '-3deg',
            y: -5,
            scale: 1.05,
          }}
          $group-card-press={{
            rotate: '-1deg',
            y: 0,
            scale: 0.97,
          }}
          $sm={{
            size: '$6',
          }}
        >
          Watch the demo
        </Paragraph>
      </View>
    </>
  )
}

const Separator = styled(View, {
  width: '100%',
  height: 1,
  bc: '$color4',
  borderStyle: 'dotted',
  bw: 0,
  bbw: 1,
  my: '$4',
})

const CopyCommand = () => {
  const [hovered, setHovered] = useState(false)
  const { hasCopied: hasNpxRunCommandCopied, onCopy: handleCopyNpxRunCommand } =
    useClipboard(`npx one@latest`)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCopyNpxRunCommand()
    }
  }

  const showCopy = hasNpxRunCommandCopied || hovered

  return (
    <Tooltip open={showCopy} placement="right">
      <Tooltip.Trigger asChild>
        <View
          als="center"
          cursor="pointer"
          animation="quick"
          onPress={handleCopyNpxRunCommand}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          px="$3"
          pt={27}
          pb={17}
          br="$6"
          fd="row"
          ai="center"
          $theme-dark={{
            // @ts-ignore
            color: '$color10',
          }}
          hoverStyle={{
            bg: '$color2',
            //@ts-ignore
            color: '$color11',
          }}
          pressStyle={{
            bg: '$color2',
          }}
          // Add these props
          role="button"
          tabIndex={0}
          // @ts-ignore
          onKeyDown={handleKeyDown}
          aria-label="Copy npx one command"
        >
          <Text
            ff="$mono"
            color="inherit"
            fontSize={46}
            ls={-2}
            lh={0}
            y={-3}
            fow="bold"
            $sm={{
              fontSize: 32,
              ls: 0,
            }}
          >
            npx one
          </Text>

          <View role="img" aria-label="Copy icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                marginRight: 4,
                marginTop: -5,
                marginLeft: 20,
                transform: 'translateY(-1px)',
              }}
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </View>
        </View>
      </Tooltip.Trigger>
      <Tooltip.Content
        enterStyle={{ x: -2, y: 0, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: -2, y: 0, opacity: 0, scale: 0.9 }}
        bg="$color5"
        scale={1}
        x={0}
        y={-1}
        opacity={1}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Tooltip.Arrow />
        <Paragraph size="$2" lineHeight="$1">
          {hasNpxRunCommandCopied ? 'Copied!' : 'Copy'}
        </Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

const Corners = () => (
  <>
    <span className="corner top-left"></span>
    <span className="corner top-right"></span>
    <span className="corner bottom-left"></span>
    <span className="corner bottom-right"></span>

    <span className="triangle top-left"></span>
    <span className="triangle top-right"></span>
    <span className="triangle bottom-left"></span>
    <span className="triangle bottom-right"></span>
  </>
)
