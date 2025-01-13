import { ThemeTint } from '@tamagui/logo'
import { Timer, Waves } from '@tamagui/lucide-icons'
import {
  Configuration,
  Switch,
  Theme,
  TooltipSimple,
  XStack,
  YStack,
  styled,
} from 'tamagui'
import {
  AnimationDriverTogglerContextProvider,
  useAnimationDriverToggler,
} from './useAnimationDriver'

import { ErrorBoundary } from '~/components/ErrorBoundary'

export function HeroContainer({
  children,
  demoMultiple = false,
  smaller,
  noPad,
  noScroll,
  alignItems,
  minimal,
  tinted,
  showAnimationDriverControl = false,
}: {
  minimal?: boolean
  demoMultiple?: boolean
  children?: React.ReactNode
  smaller?: boolean
  noPad?: boolean
  noScroll?: boolean
  alignItems?: any
  tinted?: boolean
  showAnimationDriverControl?: boolean
}) {
  const demo = (
    <HeroContainerInner demoMultiple={demoMultiple}>{children}</HeroContainerInner>
  )

  const contents = (
    <YStack
      className={(minimal ? '' : 'hero-gradient') + (noScroll ? '' : ' hero-scroll')}
      bc="$borderColor"
      bw={0.5}
      mt="$4"
      mb="$4"
      position="relative"
      display="flex"
      alignItems={alignItems || 'center'}
      justifyContent="center"
      pt={60}
      pb={80}
      pos="relative"
      minHeight={300}
      borderRadius="$4"
      {...(noPad && {
        py: 0,
      })}
      $gtMd={{
        mx: smaller ? 0 : '$-4',
      }}
      id="tamagui-demos-container"
    >
      <AnimationDriverTogglerContextProvider>
        {demoMultiple ? (
          <XStack
            mah="100%"
            maw="100%"
            miw="100%"
            position="unset"
            justifyContent="flex-start"
          >
            {demo}
          </XStack>
        ) : (
          demo
        )}

        {showAnimationDriverControl && (
          <XStack
            position="absolute"
            display="inline-flex"
            alignItems="center"
            justifyContent="space-between"
            top={16}
            l="$3"
            $xxs={{ display: 'none' }}
            $gtMd={{
              l: '$4',
            }}
          >
            <AnimationControl />
          </XStack>
        )}
      </AnimationDriverTogglerContextProvider>
    </YStack>
  )

  if (tinted) {
    return <ThemeTint>{contents}</ThemeTint>
  }

  return contents
}

const Card = styled(YStack, {
  ai: 'center',
  jc: 'center',
  elevation: '$1',
  y: 0,
  ov: 'hidden',
  minWidth: 180,
  bg: '$background',
  minHeight: 220,
  br: '$4',
})

const niceNames = {
  'react-native': 'React Native',
  css: 'css',
}

const AnimationControl = () => {
  const animationDriverToggler = useAnimationDriverToggler()

  return (
    <TooltipSimple
      placement="top"
      label={`Animations: ${niceNames[animationDriverToggler.driverName]}`}
    >
      <XStack gap="$2" ai="center">
        <Timer size={14} opacity={0.6} />
        <Switch
          size="$1"
          checked={animationDriverToggler.driverName === 'react-native'}
          onCheckedChange={(val) =>
            animationDriverToggler.setDriverName(val ? 'react-native' : 'css')
          }
        >
          <Switch.Thumb animation="quick" />
        </Switch>
        <Waves size={14} opacity={0.6} />
      </XStack>
    </TooltipSimple>
  )
}

const HeroContainerInner = ({
  children,
  demoMultiple,
}: {
  children: React.ReactNode
  demoMultiple: boolean
}) => {
  const { driver, driverName } = useAnimationDriverToggler()

  return (
    <Configuration animationDriver={driver} key={driverName}>
      <ErrorBoundary>
        {demoMultiple ? (
          <XStack gap="$3" px="$8">
            <Theme name="gray">
              <Card>{children}</Card>
            </Theme>
            <Theme name="blue">
              <Card>{children}</Card>
            </Theme>
            <Theme name="red">
              <Card>{children}</Card>
            </Theme>
            <Theme name="pink">
              <Card>{children}</Card>
            </Theme>
            <Theme name="orange">
              <Card>{children}</Card>
            </Theme>
            <Theme name="green">
              <Card>{children}</Card>
            </Theme>
            <Theme name="yellow">
              <Card>{children}</Card>
            </Theme>
          </XStack>
        ) : (
          children
        )}
      </ErrorBoundary>
    </Configuration>
  )
}
