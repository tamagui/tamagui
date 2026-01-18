import { Accordion } from '@tamagui/accordion'
import { Menu } from '@tamagui/menu'
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Zap,
  Palette,
  Smartphone,
  Shield,
  Settings,
  Info,
  Trash2,
} from '@tamagui/lucide-icons'
import { Button, H2, Paragraph, styled, XStack, YStack } from 'tamagui'
import { ThemeTintAlt } from '@tamagui/logo'

import { Link } from '~/components/Link'
import { HighlightText } from './HighlightText'

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

// styled menu item
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

// styled subtrigger
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

// styled accordion components
const AccordionItem = styled(Accordion.Item, {
  bg: '$background04',
  rounded: '$4',
  overflow: 'hidden',
  style: {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
})

const AccordionTrigger = styled(Accordion.Trigger, {
  bg: 'transparent',
  px: '$4',
  py: '$3',
  cursor: 'pointer',
  borderWidth: 0,
  justify: 'space-between',
  items: 'center',
  width: '100%',

  hoverStyle: {
    bg: '$color2',
  },
})

const faqItems = [
  {
    value: 'item-1',
    question: 'What is Takeout?',
    answer: 'A production-ready starter for building cross-platform apps.',
  },
  {
    value: 'item-2',
    question: 'Is it free?',
    answer: 'Yes! MIT licensed and free forever.',
  },
  {
    value: 'item-3',
    question: 'What platforms?',
    answer: 'iOS, Android, and Web from one codebase.',
  },
]

const features = [
  { Icon: Globe, label: 'Universal' },
  { Icon: Zap, label: 'Optimizing compiler' },
  { Icon: Palette, label: 'Themeable' },
  { Icon: Smartphone, label: 'Native performance' },
  { Icon: Shield, label: 'Accessible' },
  { Icon: Settings, label: 'Customizable' },
]

function DemoAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" width={280}>
      <YStack gap="$2">
        {faqItems.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <Accordion.Header>
              <AccordionTrigger>
                {({ open }: { open: boolean }) => (
                  <XStack width="100%" items="center" justify="space-between">
                    <Paragraph
                      fontSize={14}
                      fontWeight="500"
                      color="$color12"
                      flex={1}
                      text="left"
                    >
                      {item.question}
                    </Paragraph>
                    <YStack transition="quick" rotate={open ? '180deg' : '0deg'}>
                      <ChevronDown size={14} color="$color10" />
                    </YStack>
                  </XStack>
                )}
              </AccordionTrigger>
            </Accordion.Header>
            <Accordion.HeightAnimator transition="medium">
              <Accordion.Content transition="medium" exitStyle={{ opacity: 0 }}>
                <YStack px="$4" pb="$3">
                  <Paragraph fontSize={14} color="$color11" lineHeight={20}>
                    {item.answer}
                  </Paragraph>
                </YStack>
              </Accordion.Content>
            </Accordion.HeightAnimator>
          </AccordionItem>
        ))}
      </YStack>
    </Accordion>
  )
}

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

            <StyledItem key="copy-link" textValue="Copy link">
              <Menu.ItemTitle fontSize={14} color="$color12">
                Copy link
              </Menu.ItemTitle>
            </StyledItem>

            <StyledItem key="edit-file" textValue="Edit file">
              <Menu.ItemTitle fontSize={14} color="$color12">
                Edit file
              </Menu.ItemTitle>
            </StyledItem>
          </Menu.Group>

          <Menu.Separator mx="$2" my="$1.5" bg="$color4" />

          {/* nested submenu */}
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
      <XStack gap="$8" flexWrap="wrap" $md={{ flexWrap: 'nowrap' }}>
        {/* left side - content */}
        <YStack flex={1} gap="$5" minW={300} maxW={500}>
          <H2
            fontSize={32}
            fontWeight="700"
            color="$color12"
            style={{ lineHeight: '1.1' }}
            $sm={{ fontSize: 40 }}
          >
            <ThemeTintAlt>
              <HighlightText render="span">Native feel</HighlightText>
            </ThemeTintAlt>
          </H2>

          <Paragraph
            fontSize={16}
            color="$color11"
            style={{ lineHeight: '1.6' }}
            $sm={{ fontSize: 18 }}
          >
            Tamagui enables high-level web features on native without performance downside
            on web. Write styles once, run everywhere with native performance.
          </Paragraph>

          <XStack flexWrap="wrap" gap="$3" mt="$4">
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

          {/* <Link href="https://tamagui.dev" target="_blank">
            <ThemeTintAlt>
              <Button
                size="$4"
                bg="$color5"
                borderWidth={0.5}
                borderColor="$color7"
                cursor="pointer"
                mt="$4"
                self="flex-start"
                hoverStyle={{ bg: '$color6', borderColor: '$color8' }}
                pressStyle={{ bg: '$color7' }}
              >
                <Button.Text fontFamily="$mono" color="$color12">
                  Learn more
                </Button.Text>
              </Button>
            </ThemeTintAlt>
          </Link> */}
        </YStack>

        {/* right side - demo */}
        <YStack flex={1} minW={300} items="center" justify="center" position="relative">
          {/* gradient background */}
          <ThemeTintAlt>
            <YStack
              position="absolute"
              inset={0}
              rounded="$8"
              style={{
                background:
                  'linear-gradient(135deg, var(--color4) 0%, var(--color3) 100%)',
              }}
            />
          </ThemeTintAlt>
          {/* <Link href="https://tamagui.dev" target="_blank">
            <YStack
              position="absolute"
              t={16}
              r={16}
              width={32}
              height={32}
              rounded={999}
              bg="$background04"
              items="center"
              justify="center"
              cursor="pointer"
              hoverStyle={{ scale: 1.1, opacity: 0.9 }}
              pressStyle={{ scale: 0.95 }}
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <Info size={16} color="$color11" />
            </YStack>
          </Link> */}
          <YStack p="$6" z={1} gap="$5" items="center">
            <DemoMenu />
            <DemoAccordion />
          </YStack>
        </YStack>
      </XStack>
    </YStack>
  )
}
