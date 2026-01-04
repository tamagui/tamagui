import type { ReactNode } from 'react'
import { ThemeTint } from '@tamagui/logo'
import { useIsDocsTinted } from './docsTint'
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
      borderColor="$borderColor"
      borderWidth={0.5}
      mt="$4"
      mb="$4"
      position="relative"
      flexBasis="auto"
      display="flex"
      items={alignItems || 'center'}
      justify="center"
      pt={60}
      pb={80}
      minH={300}
      rounded="$4"
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
            maxH="100%"
            maxW="100%"
            minW="100%"
            position="unset"
            justify="flex-start"
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
            items="center"
            justify="space-between"
            t={16}
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
    return <ThemeTintWithToggle>{contents}</ThemeTintWithToggle>
  }

  return contents
}

const ThemeTintWithToggle = ({ children }: { children: ReactNode }) => {
  const isTinted = useIsDocsTinted()
  if (!isTinted) {
    return <Theme name="gray">{children}</Theme>
  }
  return <ThemeTint>{children}</ThemeTint>
}

const Card = styled(YStack, {
  items: 'center',
  justify: 'center',
  elevation: '$1',
  y: 0,
  overflow: 'hidden',
  minW: 180,
  bg: '$background',
  minH: 220,
  rounded: '$4',
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
      <XStack gap="$2" items="center">
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
