import { ThemeTintAlt, useTint } from '@tamagui/logo'
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ChevronRight,
  Code,
  Cpu,
  Globe,
  MoonStar,
  Palette,
  Settings,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  Zap,
} from '@tamagui/lucide-icons'
import { Menu } from '@tamagui/menu'
import { useUserScheme } from '@vxrn/color-scheme'
import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  Button,
  Circle,
  H2,
  Image,
  Input,
  Paragraph,
  Slider,
  Spinner,
  styled,
  Switch,
  Tabs,
  Text,
  Theme,
  Tooltip,
  View,
  XStack,
  YStack,
} from 'tamagui'

import { Card3D } from '../../components/Card3D'
import { SubTitle } from '../../components/SubTitle'
import { HighlightText } from './HighlightText'

type FloatingWrapperProps = {
  children: React.ReactNode
  speed?: 'slow' | 'medium' | 'fast'
  delay?: number
  distance?: number
}

function FloatingWrapper({
  children,
  speed = 'medium',
  delay = 0,
  distance,
}: FloatingWrapperProps) {
  const [isUp, setIsUp] = useState(false)

  const durations = { slow: 6000, medium: 4000, fast: 3000 }
  const distances = { slow: -12, medium: -8, fast: -6 }
  const duration = durations[speed]
  const moveDistance = distance ?? distances[speed]

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    const timeout = setTimeout(() => {
      setIsUp(true)
      interval = setInterval(() => {
        setIsUp((prev) => !prev)
      }, duration / 2)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [delay, duration])

  return (
    <YStack transition="lazy" y={isUp ? moveDistance : 0}>
      {children}
    </YStack>
  )
}

const FloatingCard = styled(YStack, {
  borderWidth: 0.5,
  borderColor: '$color02',
  rounded: '$6',
  overflow: 'hidden',
  elevation: '$3',
})

const GlassCard = styled(YStack, {
  borderWidth: 0.5,
  borderColor: '$background02',
  rounded: '$6',
  overflow: 'hidden',
  className: 'blur-8',
  elevation: '$3',
})

function ProfileCard() {
  return (
    <Card3D centered>
      <FloatingCard
        width={280}
        flexDirection="row"
        overflow="hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Card3D.Item translateZ={25}>
          <YStack width={90} self="stretch" overflow="hidden" m="$2" rounded="$3">
            <Image
              src="https://tamagui.dev/bento/images/wheel-list/wl_6.png"
              alt="Employee portrait"
              width="100%"
              height="100%"
              objectFit="cover"
              rounded="$3"
            />
          </YStack>
        </Card3D.Item>
        <YStack flex={1} p="$3" gap="$3" justify="space-between">
          <YStack gap="$2">
            <Card3D.Item translateZ={20}>
              <YStack gap="$0.5">
                <Paragraph
                  fontSize={10}
                  color="$color9"
                  fontWeight="600"
                  textTransform="uppercase"
                >
                  Employee ID
                </Paragraph>
                <Paragraph fontWeight="700" fontSize={15} color="$color12">
                  Sarah Chen
                </Paragraph>
              </YStack>
            </Card3D.Item>
            <Card3D.Item translateZ={15}>
              <YStack gap="$1.5">
                <XStack gap="$2" items="center">
                  <Paragraph fontSize={11} color="$color10" width={50}>
                    Dept
                  </Paragraph>
                  <Paragraph fontSize={11} color="$color12" fontWeight="500">
                    Engineering
                  </Paragraph>
                </XStack>
                <XStack gap="$2" items="center">
                  <Paragraph fontSize={11} color="$color10" width={50}>
                    ID
                  </Paragraph>
                  <Paragraph
                    fontSize={11}
                    color="$color12"
                    fontWeight="500"
                    fontFamily="$mono"
                  >
                    EMP-2847
                  </Paragraph>
                </XStack>
              </YStack>
            </Card3D.Item>
          </YStack>
          <Card3D.Item translateZ={30}>
            <XStack gap="$2">
              <ThemeTintAlt>
                <Button size="$2" bg="$color9" flex={1} cursor="pointer">
                  <Button.Text color="white" fontSize={11} fontWeight="600">
                    Message
                  </Button.Text>
                </Button>
              </ThemeTintAlt>
              <Button size="$2" flex={1} cursor="pointer">
                <Button.Text fontSize={11} fontWeight="500">
                  Profile
                </Button.Text>
              </Button>
            </XStack>
          </Card3D.Item>
        </YStack>
      </FloatingCard>
    </Card3D>
  )
}

function ProductCard() {
  return (
    <FloatingCard
      width={160}
      height={200}
      overflow="hidden"
      position="relative"
      borderWidth={1}
      borderColor="$color6"
    >
      <Image
        src="https://tamagui.dev/bento/images/wheel-list/wl_2.png"
        alt="AI Character"
        width="100%"
        height="100%"
        objectFit="cover"
      />
      <YStack fullscreen justify="flex-end">
        <YStack
          p="$2.5"
          gap="$1.5"
          m="$2"
          rounded="$6"
          borderWidth={0.5}
          borderColor="$color02"
          overflow="hidden"
          className="blur-8"
          elevation="$3"
        >
          <Paragraph size="$2" fontWeight="600" color="$white" fontFamily="$silkscreen">
            Nova #2847
          </Paragraph>
          <XStack items="center" justify="space-between">
            <Paragraph fontWeight="700" color="$white">
              0.42 ETH
            </Paragraph>
            <Paragraph size="$2" color="$orange10" fontWeight="600">
              RARE
            </Paragraph>
          </XStack>
        </YStack>
      </YStack>
    </FloatingCard>
  )
}

const tabItems = ['Feed', 'Flow', 'Vault'] as const

function TabsComponent() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabWidth = 60

  return (
    <Tabs
      value={tabItems[activeIndex]}
      onValueChange={(value) => {
        const index = tabItems.indexOf(value as (typeof tabItems)[number])
        if (index !== -1) setActiveIndex(index)
      }}
    >
      <GlassCard p="$1.5" rounded="$5" position="relative">
        <Tabs.List unstyled flexDirection="row">
          <View
            position="absolute"
            t={0}
            b={0}
            l="$1.5"
            my="auto"
            width={tabWidth}
            height="80%"
            bg="$background"
            rounded="$4"
            x={activeIndex * tabWidth}
            transition="medium"
            animateOnly={['transform']}
          />
          {tabItems.map((tab, index) => {
            const isActive = activeIndex === index
            return (
              <Tabs.Tab
                unstyled
                key={tab}
                value={tab}
                width={tabWidth}
                py="$2"
                rounded="$3"
                cursor="pointer"
                items="center"
                z={1}
              >
                <Text
                  fontSize={13}
                  fontWeight={isActive ? '600' : '400'}
                  color={isActive ? '$color12' : '$color10'}
                  cursor="pointer"
                  select="none"
                >
                  {tab}
                </Text>
              </Tabs.Tab>
            )
          })}
        </Tabs.List>
      </GlassCard>
    </Tabs>
  )
}

function IndicatorDot({ isActive }: { isActive: boolean }) {
  return (
    <YStack
      width={isActive ? 28 : 8}
      height={8}
      rounded={4}
      bg={isActive ? '$color10' : '$color7'}
      transition="medium"
      animateOnly={['width', 'backgroundColor']}
    />
  )
}

function PaginationComponent() {
  const tint = useTint()
  const pageNum = tint.tints.length

  const handlePrevClick = () => {
    tint.setTintIndex(tint.tintIndex - 1 < 0 ? pageNum - 1 : tint.tintIndex - 1)
  }
  const handleNextClick = () => {
    tint.setTintIndex((tint.tintIndex + 1) % pageNum)
  }

  return (
    <GlassCard>
      <ThemeTintAlt>
        <XStack gap="$3" items="center" rounded="$6" p="$2">
          <Button
            size="$4"
            circular
            icon={ArrowLeft}
            scaleIcon={1.5}
            onPress={handlePrevClick}
            cursor="pointer"
            bg="$color5"
          />
          {tint.tints.map((_, idx) => (
            <IndicatorDot key={idx} isActive={idx === tint.tintIndex} />
          ))}
          <Button
            size="$4"
            circular
            icon={ArrowRight}
            scaleIcon={1.5}
            onPress={handleNextClick}
            cursor="pointer"
            bg="$color5"
          />
        </XStack>
      </ThemeTintAlt>
    </GlassCard>
  )
}

function InputComponent() {
  return (
    <XStack items="center" gap="$2">
      <Input
        backgroundColor="$color3"
        flex={1}
        size="$3"
        placeholder="Search..."
        width={150}
      />
      <Button theme="surface3" size="$3">
        Go
      </Button>
    </XStack>
  )
}

function ThemeToggle() {
  const { value: scheme, set: setScheme } = useUserScheme()
  const checked = scheme === 'dark'
  const thumbSize = 46
  const iconSize = thumbSize * 0.4

  return (
    <Switch
      checked={checked}
      onCheckedChange={(isChecked) => setScheme(isChecked ? 'dark' : 'light')}
      size="$5"
      bg="$color3"
      justify="center"
      items="center"
      cursor="pointer"
      borderWidth={2}
      borderColor="$color5"
    >
      <View
        key="background"
        width="50%"
        r={checked ? '50%' : 0}
        height="100%"
        justify="center"
        items="center"
        transition="200ms"
        position="absolute"
        t={0}
        b={0}
      >
        <View
          t="20%"
          transition="200ms"
          l={checked ? '55%' : 0}
          position="absolute"
          bg="$color6"
          width={checked ? 4 : 20}
          height={checked ? 4 : 4}
          rounded="$10"
        />
        <View
          t={checked ? '33%' : '45%'}
          l="28%"
          transition="200ms"
          position="absolute"
          bg="$color6"
          width={checked ? 3 : 14}
          height={checked ? 3 : 4}
          rounded="$10"
        />
        <View
          t="70%"
          l={checked ? '30%' : 0}
          transition="200ms"
          position="absolute"
          bg="$color6"
          width={checked ? 4 : 10}
          height={checked ? 4 : 4}
          rounded="$10"
        />
      </View>
      <Switch.Thumb transition="medium" bg="$colorTransparent">
        <View
          m="$1"
          flex={1}
          overflow="hidden"
          rounded="$10"
          items="center"
          justify="center"
          bg="$color5"
          transition="200ms"
        >
          <AnimatePresence exitBeforeEnter custom={{ direction: -1 }}>
            <YStack
              position="absolute"
              key="Sun"
              transition="medium"
              fullscreen
              items="center"
              justify="center"
              opacity={checked ? 0 : 1}
              transform={[
                { scale: !checked ? 1 : 0 },
                { translateY: !checked ? 0 : thumbSize },
              ]}
            >
              <Sun size={iconSize} fill="white" color="white" />
            </YStack>

            <YStack
              position="absolute"
              transition="medium"
              key="moon"
              fullscreen
              items="center"
              justify="center"
              transform={[
                { scale: checked ? 1 : 0 },
                { translateY: checked ? 0 : -thumbSize },
                { rotate: checked ? '0deg' : '-90deg' },
              ]}
            >
              <MoonStar color="white" fill="white" size={iconSize} />
            </YStack>
          </AnimatePresence>
        </View>
      </Switch.Thumb>
    </Switch>
  )
}

function LoaderComponent() {
  return (
    <YStack
      bg="$color2"
      width={60}
      height={60}
      items="center"
      justify="center"
      position="relative"
      rounded="$4"
      elevation="$3"
    >
      <ThemeTintAlt>
        <Spinner size="large" color="$color9" />
      </ThemeTintAlt>
    </YStack>
  )
}

function NotificationBadge() {
  return (
    <GlassCard p="$3" flexDirection="row" items="center" gap="$3">
      <YStack position="relative">
        <Circle size={40} bg="$color4" items="center" justify="center">
          <Bell size={20} color="$color11" />
        </Circle>
        <ThemeTintAlt>
          <Circle
            size={18}
            bg="$red9"
            position="absolute"
            t={-4}
            r={-4}
            items="center"
            justify="center"
          >
            <Paragraph fontSize={10} fontWeight="700" color="white">
              3
            </Paragraph>
          </Circle>
        </ThemeTintAlt>
      </YStack>
      <YStack gap="$1">
        <Paragraph fontSize={13} fontWeight="600" color="$color12">
          Notifications
        </Paragraph>
        <Paragraph fontSize={11} color="$color10">
          3 unread messages
        </Paragraph>
      </YStack>
    </GlassCard>
  )
}

function TooltipBadge() {
  return (
    <Tooltip placement="bottom" offset={12} delay={{ open: 0, close: 150 }}>
      <Tooltip.Trigger asChild>
        <Button theme="accent" size="$3" cursor="pointer">
          <Button.Text fontSize={13} color="$color11">
            Hover me
          </Button.Text>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content
        animatePosition
        transition="quick"
        bg="$background"
        elevation="$2"
        rounded="$4"
        px="$2.5"
        py="$1"
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: -4, opacity: 0 }}
      >
        <Tooltip.Arrow />
        <Paragraph size="$3">Nice tooltips</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

function SliderComponent() {
  const [value, setValue] = useState([75])

  return (
    <GlassCard p="$3" width={140} gap="$2">
      <XStack justify="space-between" items="center">
        <Paragraph fontSize={12} color="$color10">
          Volume
        </Paragraph>
        <Paragraph fontSize={12} fontWeight="600" color="$color12">
          {value[0]}%
        </Paragraph>
      </XStack>
      <ThemeTintAlt>
        <Slider value={value} onValueChange={setValue} max={100} step={1} width="100%">
          <Slider.Track bg="$color4" height={6}>
            <Slider.TrackActive bg="$color9" />
          </Slider.Track>
          <Slider.Thumb
            index={0}
            circular
            size={16}
            bg="$color4"
            cursor="pointer"
            elevation="$1"
          />
        </Slider>
      </ThemeTintAlt>
    </GlassCard>
  )
}

const chipData = [
  { label: 'React', color: 'blue', Icon: Code },
  { label: 'Native', color: 'purple', Icon: Smartphone },
  { label: 'Web', color: 'green', Icon: Globe },
  { label: 'Fast', color: 'orange', Icon: Zap },
  { label: 'Styled', color: 'pink', Icon: Palette },
  { label: 'SSR', color: 'red', Icon: Cpu },
] as const

function ChipGroup() {
  return (
    <XStack gap="$2" flexWrap="wrap" maxW={250}>
      {chipData.map(({ label, color, Icon }) => (
        <Theme key={label} name={color}>
          <XStack
            bg="$color4"
            rounded="$10"
            px="$2.5"
            py="$1.5"
            items="center"
            gap="$1.5"
            hoverStyle={{ bg: '$color5' }}
          >
            <Icon size={12} color="$color9" />
            <Paragraph fontSize={11} fontWeight="500" color="$color9">
              {label}
            </Paragraph>
          </XStack>
        </Theme>
      ))}
    </XStack>
  )
}

const features = [
  { Icon: Globe, label: 'Universal' },
  { Icon: Zap, label: 'Optimizing compiler' },
  { Icon: Palette, label: 'Themeable' },
  { Icon: Smartphone, label: 'Native performance' },
  { Icon: Shield, label: 'Accessible' },
  { Icon: Settings, label: 'Customizable' },
]

const FeatureChip = styled(XStack, {
  bg: '$color2',
  rounded: '$4',
  px: '$4',
  py: '$3',
  items: 'center',
  gap: '$3',
  borderWidth: 0.5,
  borderColor: '$color4',
})

const ChipIcon = styled(YStack, {
  width: 32,
  height: 32,
  rounded: '$3',
  items: 'center',
  justify: 'center',
  bg: '$color3',
})

const StyledItem = styled(Menu.Item, {
  px: '$3',
  py: '$2',
  mx: '$1',
  rounded: '$3',
  cursor: 'pointer',
  hoverStyle: {
    bg: '$color3',
  },
  pressStyle: {
    bg: '$color4',
  },
})

const StyledSubTrigger = styled(Menu.SubTrigger, {
  px: '$3',
  py: '$2',
  mx: '$1',
  rounded: '$3',
  cursor: 'pointer',
  justify: 'space-between',
  hoverStyle: {
    bg: '$color3',
  },
  pressStyle: {
    bg: '$color4',
  },
})

function DemoMenu() {
  return (
    <Menu placement="bottom-start">
      <Menu.Trigger asChild>
        <XStack
          px="$5"
          py="$2.5"
          rounded="$10"
          items="center"
          gap="$2"
          cursor="pointer"
          bg="$background04"
          borderWidth={0}
          transition="quick"
          hoverStyle={{ opacity: 0.8 }}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          render="button"
        >
          <Paragraph fontSize={14} fontWeight="500">
            Actions
          </Paragraph>
        </XStack>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content
          bg="$background"
          rounded="$4"
          borderWidth={0.5}
          borderColor="$color4"
          overflow="hidden"
          minW={220}
          p="$1.5"
          elevation="$4"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          transition={['quicker', { opacity: { overshootClamping: true } }]}
        >
          <Menu.Group>
            <Menu.Label
              fontSize={11}
              fontWeight="600"
              color="$color9"
              px="$3"
              py="$1.5"
              textTransform="uppercase"
              letterSpacing={0.5}
            >
              Actions
            </Menu.Label>

            <StyledItem key="new-file" textValue="New file">
              <Menu.ItemTitle fontSize={14} color="$color12">
                New file
              </Menu.ItemTitle>
            </StyledItem>

            <StyledItem key="edit-file" textValue="Edit file">
              <Menu.ItemTitle fontSize={14} color="$color12">
                Edit file
              </Menu.ItemTitle>
            </StyledItem>
          </Menu.Group>

          <Menu.Separator mx="$2" my="$1.5" bg="$color4" />

          <Menu.Sub placement="right-start">
            <StyledSubTrigger key="more-options" textValue="More options">
              <Menu.ItemTitle fontSize={14} color="$color12">
                More options
              </Menu.ItemTitle>
              <ChevronRight size={14} color="$color9" />
            </StyledSubTrigger>

            <Menu.Portal>
              <Menu.SubContent
                bg="$background"
                rounded="$4"
                borderWidth={0.5}
                borderColor="$color4"
                overflow="hidden"
                minW={180}
                p="$1.5"
                elevation="$4"
                enterStyle={{ x: -10, opacity: 0 }}
                exitStyle={{ x: -10, opacity: 0 }}
                transition={['quicker', { opacity: { overshootClamping: true } }]}
              >
                <StyledItem key="duplicate" textValue="Duplicate">
                  <Menu.ItemTitle fontSize={14} color="$color12">
                    Duplicate
                  </Menu.ItemTitle>
                </StyledItem>

                <StyledItem key="archive" textValue="Archive">
                  <Menu.ItemTitle fontSize={14} color="$color12">
                    Archive
                  </Menu.ItemTitle>
                </StyledItem>

                <StyledItem key="move" textValue="Move to folder">
                  <Menu.ItemTitle fontSize={14} color="$color12">
                    Move to folder
                  </Menu.ItemTitle>
                </StyledItem>
              </Menu.SubContent>
            </Menu.Portal>
          </Menu.Sub>

          <Menu.Separator mx="$2" my="$1.5" bg="$color4" />

          <Menu.Group>
            <Menu.Label
              fontSize={11}
              fontWeight="600"
              color="$color9"
              px="$3"
              py="$1.5"
              textTransform="uppercase"
              letterSpacing={0.5}
            >
              Danger zone
            </Menu.Label>

            <StyledItem key="delete-file" textValue="Delete file" destructive>
              <XStack items="center" gap="$2">
                <Trash2 size={14} color="$red10" />
                <Menu.ItemTitle fontSize={14} color="$red10">
                  Delete file
                </Menu.ItemTitle>
              </XStack>
            </StyledItem>
          </Menu.Group>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  )
}

export function TakeoutMenuShowcase() {
  return (
    <YStack gap="$6" py="$12" px="$4" maxW={1200} self="center" width="100%">
      <XStack gap="$8" flexWrap="wrap" $lg={{ flexWrap: 'nowrap' }}>
        <YStack flex={1} gap="$5" minW={300} width="100%" $gtMd={{ maxW: 440 }}>
          <H2
            fontSize={36}
            fontWeight="700"
            color="$color12"
            style={{ lineHeight: '1.1' }}
            $sm={{ fontSize: 44 }}
          >
            <ThemeTintAlt>
              <HighlightText render="span">Native feel,</HighlightText>
            </ThemeTintAlt>
            {'\n'}web power
          </H2>

          <SubTitle>
            Build with high-level components that work beautifully across iOS, Android,
            and web. Write once, ship everywhere with true native performance.
          </SubTitle>

          <XStack flexWrap="wrap" gap="$3" mt="$2">
            {features.map((feature) => (
              <FeatureChip key={feature.label}>
                <ChipIcon>
                  <feature.Icon size={16} color="$color11" />
                </ChipIcon>
                <Paragraph
                  pointerEvents="none"
                  fontSize={14}
                  color="$color11"
                  fontWeight="500"
                >
                  {feature.label}
                </Paragraph>
              </FeatureChip>
            ))}
          </XStack>
        </YStack>

        <YStack
          flex={1.2}
          minW={360}
          height={600}
          position="relative"
          display="none"
          $gtMd={{ display: 'flex' }}
        >
          <YStack fullscreen pointerEvents="none" overflow="visible">
            <YStack position="absolute" t={-20} l="40%" pointerEvents="auto">
              <FloatingWrapper speed="medium" delay={500}>
                <ProductCard />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" t={100} r={50} pointerEvents="auto">
              <FloatingWrapper speed="slow" delay={1500}>
                <ThemeToggle />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" t={120} l={0} pointerEvents="auto">
              <FloatingWrapper speed="fast" delay={1000}>
                <TabsComponent />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" t={200} l={-20} pointerEvents="auto">
              <FloatingWrapper speed="slow">
                <ProfileCard />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" t={300} l="50%" x={0} pointerEvents="auto">
              <FloatingWrapper speed="fast" delay={500}>
                <PaginationComponent />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" t={230} r={40} pointerEvents="auto">
              <FloatingWrapper speed="medium" delay={2000}>
                <InputComponent />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" t={400} r={50} pointerEvents="auto">
              <FloatingWrapper speed="slow" delay={500}>
                <LoaderComponent />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" b={140} l={40} pointerEvents="auto">
              <FloatingWrapper speed="fast" delay={1000}>
                <DemoMenu />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" b={40} l={0} pointerEvents="auto">
              <FloatingWrapper speed="medium">
                <ChipGroup />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" b={100} l="50%" x={-80} pointerEvents="auto">
              <FloatingWrapper speed="slow" delay={1000}>
                <NotificationBadge />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" b={40} l="50%" x={-40} pointerEvents="auto">
              <FloatingWrapper speed="slow" delay={800}>
                <TooltipBadge />
              </FloatingWrapper>
            </YStack>

            <YStack position="absolute" b={20} r={20} pointerEvents="auto">
              <FloatingWrapper speed="fast" delay={2000}>
                <SliderComponent />
              </FloatingWrapper>
            </YStack>
          </YStack>
        </YStack>
      </XStack>
    </YStack>
  )
}
