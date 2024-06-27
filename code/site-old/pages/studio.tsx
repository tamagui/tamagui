import { getDefaultLayout } from '@lib/getDefaultLayout'
import { ThemeTintAlt } from '@tamagui/logo'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import { Button, EnsureFlexed, H2, Separator, Spacer, XStack, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { Container, ContainerXL } from '../components/Container'
import { Features } from '../components/Features'
import { LoadInter900 } from '../components/LoadFont'
import { NextLink } from '../components/NextLink'
import { StudioScreen1 } from '../components/StudioScreen1'
import { ThemeNameEffect } from '../components/ThemeNameEffect'

export default function StudioSplashPage() {
  // const [state, setState] = useState({
  //   hideIntro: false,
  // })

  // const isDark = useThemeName().startsWith('dark')

  // const domain =
  //   process.env.NODE_ENV === 'development'
  //     ? 'http://localhost:1421'
  //     : 'https://studio.tamagui.dev'

  return (
    <>
      <NextSeo title="Tamagui Studio" description="Tamagui Studio" />
      <Head>
        <LoadInter900 />
      </Head>

      <ThemeNameEffect />

      {/* <iframe
        onLoad={() => {
          setState({
            hideIntro: true,
          })
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          minHeight: '100vh',
          pointerEvents: 'auto',
          zIndex: 1,
        }}
        // srcDoc={`<meta name='color-scheme' content='light dark'><style>body {background:none}</style>`}
        src={`${domain}/builder/40?disableRouter=true`}
      /> */}

      <YStack>
        <LinearGradient
          pos="absolute"
          fullscreen
          colors={['$background', '$color2', '$color2', '$color2', '$background']}
        />

        <ContainerXL>
          <YStack>
            <StudioScreen1 />

            <Container pe="none" ai="center">
              <YStack
                ai="center"
                jc="center"
                gap="$5"
                als="center"
                py="$8"
                f={1}
                w="100%"
                $sm={{ mt: -100, fd: 'column' }}
              >
                <ThemeTintAlt>
                  <NextLink target="_blank" href="https://github.com/sponsors/natew">
                    <Button
                      mt={60}
                      animation="quick"
                      bg="$color10"
                      color="$color1"
                      size="$6"
                      borderRadius="$10"
                      elevation="$2"
                      className="glowing"
                      pe="auto"
                      hoverStyle={{
                        bg: '$color10',
                        outlineColor: '$color5',
                        outlineStyle: 'solid',
                        outlineWidth: 4,
                        elevation: '$3',
                      }}
                      pressStyle={{
                        bg: '$color8',
                        scale: 0.98,
                      }}
                    >
                      Sponsor for early access
                    </Button>
                  </NextLink>
                </ThemeTintAlt>

                <NextLink href="/login">
                  <Button pe="auto" variant="outlined" size="$3" borderRadius="$10">
                    Login
                  </Button>
                </NextLink>
              </YStack>

              <XStack maw={790} space="$8" separator={<Separator vertical />}>
                <H2
                  theme="alt1"
                  className="text-glow"
                  als="center"
                  ff="$silkscreen"
                  size="$8"
                  fow="900"
                  $sm={{ size: '$5' }}
                >
                  Your design system!
                </H2>
              </XStack>
            </Container>

            <Spacer size="$12" />

            <XStack
              ov="hidden"
              maw={1000}
              als="center"
              $sm={{ fd: 'column', maw: '100%' }}
            >
              <YStack px="$6" maw="50%" $sm={{ maw: '100%', p: '$2' }}>
                <EnsureFlexed />
                <Features
                  size="$5"
                  items={[
                    `Generate complete theme suites step-by-step.`,
                    `Visualize your design system.`,
                    `Export themes directly to your app.`,
                  ]}
                />
              </YStack>

              <YStack px="$6" maw="50%" $sm={{ maw: '100%', p: '$2' }}>
                <EnsureFlexed />
                <Features
                  soon
                  size="$5"
                  items={[
                    <span>Animation test environment and visualizer.</span>,
                    <span>Advanced theme editor.</span>,
                    <span>Figma and local integrations.</span>,
                  ]}
                />
              </YStack>
            </XStack>

            <Spacer size="$12" />
            <Spacer size="$12" />
          </YStack>
        </ContainerXL>
      </YStack>
    </>
  )
}

StudioSplashPage.getLayout = getDefaultLayout
