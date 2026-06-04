import { View, Text, XStack, YStack, styled } from 'tamagui'

/**
 * integration test for core CSS style rendering.
 * validates that each style category actually produces correct computed styles.
 * not every prop — just the core shapes/types per category.
 */

// ── layout ───────────────────────────────────────────

const LayoutAbsolute = () => (
  <View id="sv-layout-relative" width={100} height={100} position="relative" backgroundColor="rgb(200,200,200)">
    <View
      id="sv-layout-absolute"
      position="absolute"
      top={5}
      left={5}
      right={5}
      bottom={5}
      backgroundColor="rgb(100,100,255)"
      zIndex={10}
    />
  </View>
)

const LayoutOverflow = () => (
  <View id="sv-overflow" width={60} height={60} overflow="hidden" backgroundColor="rgb(200,200,200)">
    <View width={120} height={120} backgroundColor="rgb(255,100,100)" />
  </View>
)

// ── flexbox ──────────────────────────────────────────

const FlexRow = () => (
  <XStack
    id="sv-flex-row"
    gap={8}
    alignItems="center"
    justifyContent="space-between"
    padding={8}
    backgroundColor="rgb(240,240,240)"
    width={200}
  >
    <View id="sv-flex-child-1" width={30} height={30} backgroundColor="rgb(255,0,0)" />
    <View id="sv-flex-child-2" width={30} height={30} backgroundColor="rgb(0,255,0)" flexGrow={1} />
    <View id="sv-flex-child-3" width={30} height={30} backgroundColor="rgb(0,0,255)" />
  </XStack>
)

const FlexCol = () => (
  <YStack
    id="sv-flex-col"
    gap={4}
    alignItems="stretch"
    width={80}
    backgroundColor="rgb(240,240,240)"
    padding={4}
  >
    <View id="sv-flex-col-child" height={20} backgroundColor="rgb(100,200,100)" />
    <View height={20} backgroundColor="rgb(100,100,200)" />
  </YStack>
)

// ── spacing ──────────────────────────────────────────

const Spacing = () => (
  <View id="sv-spacing-outer" backgroundColor="rgb(200,200,255)">
    <View
      id="sv-spacing"
      margin={12}
      padding={16}
      paddingHorizontal={24}
      backgroundColor="rgb(255,255,255)"
      width={100}
      height={60}
    />
  </View>
)

// ── sizing ───────────────────────────────────────────

const Sizing = () => (
  <View id="sv-sizing-container" width={200} height={100}>
    <View
      id="sv-sizing"
      width="50%"
      height="100%"
      minWidth={60}
      maxWidth={150}
      backgroundColor="rgb(100,200,255)"
    />
  </View>
)

// ── typography ───────────────────────────────────────

const Typography = () => (
  <YStack gap={4}>
    <Text
      id="sv-text-basic"
      fontSize={18}
      fontWeight="700"
      color="rgb(17,24,39)"
      lineHeight={24}
      letterSpacing={1.5}
    >
      Bold 18px
    </Text>
    <Text
      id="sv-text-transform"
      textTransform="uppercase"
      textDecorationLine="underline"
      textAlign="center"
      color="rgb(100,100,100)"
      fontSize={14}
    >
      uppercase underline
    </Text>
  </YStack>
)

// ── backgrounds ──────────────────────────────────────

const Backgrounds = () => (
  <XStack gap={8}>
    <View
      id="sv-bg-color"
      width={60}
      height={60}
      backgroundColor="rgb(99,102,241)"
    />
    <View
      id="sv-bg-gradient"
      width={60}
      height={60}
      // @ts-ignore
      backgroundImage="linear-gradient(135deg, rgb(99,102,241), rgb(236,72,153))"
    />
  </XStack>
)

// ── borders ──────────────────────────────────────────

const Borders = () => (
  <XStack gap={8}>
    <View
      id="sv-border-basic"
      width={60}
      height={60}
      borderWidth={2}
      borderColor="rgb(220,38,38)"
      borderStyle="solid"
      borderRadius={8}
    />
    <View
      id="sv-border-mixed"
      width={60}
      height={60}
      borderTopWidth={4}
      borderTopColor="rgb(0,0,255)"
      borderBottomWidth={1}
      borderBottomColor="rgb(200,200,200)"
      borderLeftWidth={0}
      borderRightWidth={0}
      borderTopLeftRadius={12}
      borderTopRightRadius={12}
    />
    <View
      id="sv-outline"
      width={60}
      height={60}
      outlineWidth={2}
      outlineColor="rgb(34,197,94)"
      outlineStyle="solid"
      outlineOffset={4}
    />
  </XStack>
)

// ── effects ──────────────────────────────────────────

const Effects = () => (
  <XStack gap={8}>
    <View
      id="sv-opacity"
      width={60}
      height={60}
      backgroundColor="rgb(0,0,0)"
      opacity={0.5}
    />
    <View
      id="sv-shadow"
      width={60}
      height={60}
      backgroundColor="rgb(255,255,255)"
      // @ts-ignore
      boxShadow="0 4px 12px rgba(0,0,0,0.25)"
    />
    <View
      id="sv-cursor"
      width={60}
      height={60}
      backgroundColor="rgb(200,200,200)"
      cursor="pointer"
      pointerEvents="auto"
      userSelect="none"
    />
  </XStack>
)

// ── transforms ───────────────────────────────────────

const Transforms = () => (
  <XStack gap={24} padding={20}>
    <View
      id="sv-rotate"
      width={40}
      height={40}
      backgroundColor="rgb(168,85,247)"
      rotate="45deg"
    />
    <View
      id="sv-scale"
      width={40}
      height={40}
      backgroundColor="rgb(234,179,8)"
      scale={0.75}
    />
    <View
      id="sv-translate"
      width={40}
      height={40}
      backgroundColor="rgb(14,165,233)"
      x={10}
      y={-5}
    />
  </XStack>
)

// ── interactive states ───────────────────────────────

const InteractiveHover = () => (
  <View
    id="sv-hover"
    width={80}
    height={80}
    backgroundColor="rgb(34,197,94)"
    hoverStyle={{ backgroundColor: 'rgb(22,163,74)', scale: 1.05 }}
  />
)

const InteractivePress = () => (
  <View
    id="sv-press"
    width={80}
    height={80}
    backgroundColor="rgb(59,130,246)"
    pressStyle={{ backgroundColor: 'rgb(29,78,216)', opacity: 0.8 }}
  />
)

const InteractiveFocus = () => (
  <View
    id="sv-focus"
    width={80}
    height={80}
    backgroundColor="rgb(200,200,200)"
    focusable
    focusStyle={{ borderWidth: 2, borderColor: 'rgb(99,102,241)' }}
    focusVisibleStyle={{ outlineWidth: 2, outlineColor: 'rgb(99,102,241)', outlineStyle: 'solid' }}
  />
)

// ── media queries ────────────────────────────────────

const MediaQuery = () => (
  <View
    id="sv-media"
    width={80}
    height={80}
    backgroundColor="rgb(255,0,0)"
    $sm={{ backgroundColor: 'rgb(0,255,0)' }}
    $md={{ backgroundColor: 'rgb(0,0,255)' }}
  />
)

// ── styled component ─────────────────────────────────

const StyledCard = styled(View, {
  width: 120,
  height: 80,
  backgroundColor: 'rgb(255,255,255)',
  borderRadius: 12,
  padding: 12,
  // @ts-ignore
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',

  variants: {
    variant: {
      primary: { backgroundColor: 'rgb(99,102,241)' },
      danger: { backgroundColor: 'rgb(239,68,68)' },
    },
  } as const,
})

const StyledVariants = () => (
  <XStack gap={8}>
    <StyledCard id="sv-styled-default" />
    <StyledCard id="sv-styled-primary" variant="primary" />
    <StyledCard id="sv-styled-danger" variant="danger" />
  </XStack>
)

// ── main ─────────────────────────────────────────────

export function StyleValidation() {
  return (
    <YStack padding={20} gap={24} backgroundColor="$background" id="sv-root">
      <Text fontSize={20} fontWeight="bold" color="$color">Style Validation</Text>

      <Section label="Layout">
        <LayoutAbsolute />
        <LayoutOverflow />
      </Section>

      <Section label="Flexbox">
        <FlexRow />
        <FlexCol />
      </Section>

      <Section label="Spacing">
        <Spacing />
      </Section>

      <Section label="Sizing">
        <Sizing />
      </Section>

      <Section label="Typography">
        <Typography />
      </Section>

      <Section label="Backgrounds">
        <Backgrounds />
      </Section>

      <Section label="Borders">
        <Borders />
      </Section>

      <Section label="Effects">
        <Effects />
      </Section>

      <Section label="Transforms">
        <Transforms />
      </Section>

      <Section label="Hover / Press / Focus">
        <XStack gap={12}>
          <InteractiveHover />
          <InteractivePress />
          <InteractiveFocus />
        </XStack>
      </Section>

      <Section label="Media Queries">
        <MediaQuery />
      </Section>

      <Section label="Styled Variants">
        <StyledVariants />
      </Section>
    </YStack>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap={8}>
      <Text fontSize={14} fontWeight="600" color="$color8">{label}</Text>
      <XStack gap={12} flexWrap="wrap" alignItems="flex-start">
        {children}
      </XStack>
    </YStack>
  )
}
