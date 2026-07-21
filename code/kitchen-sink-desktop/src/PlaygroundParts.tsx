import type { ReactNode } from 'react'
import { Paragraph, Text, XStack, YStack, styled } from 'tamagui'

export const Specimen = styled(YStack, {
  name: 'DesktopSpecimen',
  minW: 300,
  width: 360,
  grow: 1,
  gap: '$4',
  p: '$5',
  rounded: '$7',
  borderWidth: 1,
  borderColor: '$borderColor',
  bg: '$background',
  shadowColor: '$shadowColor',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
})

export const SpecimenGrid = styled(XStack, {
  name: 'DesktopSpecimenGrid',
  gap: '$4',
  flexWrap: 'wrap',
  items: 'stretch',
})

export function SectionHeading({
  index,
  title,
  description,
}: {
  index: string
  title: string
  description: string
}) {
  return (
    <XStack gap="$4" items="flex-start" flexWrap="wrap">
      <Text color="$purple10" fontWeight="900" fontSize="$3" pt="$1">
        {index}
      </Text>
      <YStack gap="$1" maxW={720}>
        <Text fontFamily="$heading" color="$color12" fontWeight="900" fontSize="$8">
          {title}
        </Text>
        <Paragraph color="$color9" fontSize="$4" lineHeight="$6">
          {description}
        </Paragraph>
      </YStack>
    </XStack>
  )
}

export function SpecimenHeader({
  title,
  kind,
  description,
}: {
  title: string
  kind: string
  description: string
}) {
  return (
    <YStack gap="$2">
      <XStack items="center" justify="space-between" gap="$3">
        <Text color="$color12" fontWeight="900" fontSize="$6">
          {title}
        </Text>
        <Text
          px="$2.5"
          py="$1"
          rounded="$10"
          bg="$purple3"
          color="$purple11"
          fontSize="$1"
          fontWeight="900"
        >
          {kind.toUpperCase()}
        </Text>
      </XStack>
      <Paragraph color="$color9" fontSize="$3" lineHeight="$5">
        {description}
      </Paragraph>
    </YStack>
  )
}

export function Result({ children }: { children: ReactNode }) {
  return (
    <XStack
      px="$3"
      py="$2.5"
      rounded="$4"
      bg="$color2"
      borderWidth={1}
      borderColor="$color5"
      gap="$2"
      items="center"
    >
      <Text color="$green10" fontSize="$2">
        ●
      </Text>
      <Text color="$color10" fontSize="$2" fontWeight="700" numberOfLines={1}>
        {children}
      </Text>
    </XStack>
  )
}
