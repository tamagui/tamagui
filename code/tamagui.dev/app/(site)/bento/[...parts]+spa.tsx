import { CurrentRouteProvider, Data, Sections } from '@tamagui/bento'
import { listingData } from '~/components/bento-showcase/data'
import { CircleDashed, Paintbrush } from '@tamagui/lucide-icons'
import { useToastController } from '@tamagui/toast'
import type { Href } from 'one'
import { Link, useParams } from 'one'
import { startTransition } from 'react'
import {
  Anchor,
  Button,
  H1,
  Paragraph,
  SizableText,
  styled,
  Text,
  View,
  XStack,
  YStack,
  Theme,
} from 'tamagui'
import { ContainerBento } from '~/components/Containers'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import { useBentoStore } from '~/features/bento/BentoStore'
import { DropTamaguiConfig } from '~/features/bento/DropTamaguiConfig'
import { useSubscriptionModal } from '~/features/site/purchase/useSubscriptionModal'

export const generateStaticParams = async () => {
  return Data.paths.map((x) => ({
    parts: `${x.params.section}/${x.params.part}`,
  }))
}

function useParts() {
  const { parts } = useParams() as { parts: string[] }
  const [section, part] = parts
  return { section, part }
}

export default function BentoPage() {
  const { section, part } = useParts()
  const Comp = Sections?.[section]?.[part]
  const toast = useToastController()

  const { showAppropriateModal, subscriptionStatus, userData } = useSubscriptionModal()

  // Check both current PRO subscription and legacy Bento access (from product_ownership table)
  // For Bento purposes, both should be treated as having full access
  const isProUser = subscriptionStatus.pro || userData?.accessInfo?.hasBentoAccess

  if (!Comp) {
    return null
  }

  return (
    <CurrentRouteProvider section={section} part={part}>
      <BentoPageFrame>
        <ContainerBento>
          <DetailHeader>{`${section[0].toUpperCase()}${section.slice(1)}`}</DetailHeader>
        </ContainerBento>

        <YStack py="$8" pb="$16">
          <YStack pe="none" fullscreen className="bg-grid" o={0.033} />
          <ContainerBento>
            <XStack pos="relative" top={0}>
              <View className="sticky">
                <SideBar ai="flex-end">
                  {listingData.sections.map(({ parts, sectionName }, index) => (
                    <YStack key={`${sectionName}-${name}`} ai="flex-end" gap="$4">
                      <XStack
                        onPress={() => {
                          navigator?.clipboard?.writeText?.(
                            `${window.location.hostname}/bento#${sectionName}`
                          )

                          toast.show('Link copied to clipboard')
                        }}
                        gap="$2"
                        ai="center"
                      >
                        <Text ff="$mono" color="$color12" textAlign="right" px="$2">
                          {sectionName[0].toUpperCase()}
                          {sectionName.slice(1)}
                        </Text>
                      </XStack>

                      <YStack ai="flex-end" gap="$2">
                        {parts.map((partItem, index) => {
                          const { route, name } = partItem
                          const active = route === `/${section}/${part}`

                          return (
                            <Link
                              key={`${sectionName}-${name}`}
                              href={`/bento${route}` as Href}
                            >
                              <View
                                pos="relative"
                                py="$2"
                                ai="center"
                                jc="center"
                                gap="$2"
                                flex={1}
                              >
                                <Paragraph
                                  ff="$mono"
                                  // size="$4"
                                  fow="500"
                                  textAlign="right"
                                  color={active ? '$accentColor' : '$color10'}
                                  px="$2"
                                >
                                  {name}
                                </Paragraph>
                                <View
                                  pos="absolute"
                                  inset={0}
                                  opacity={active ? 1 : 0}
                                  hoverStyle={{
                                    borderRightColor: '$accentColor',
                                    opacity: 1,
                                  }}
                                  jc="center"
                                  ai="flex-end"
                                >
                                  <View
                                    height="70%"
                                    width={2}
                                    br="$10"
                                    bg={'$accentColor'}
                                    x={5}
                                  />
                                </View>
                              </View>
                            </Link>
                          )
                        })}
                      </YStack>
                    </YStack>
                  ))}
                </SideBar>
              </View>

              <View f={1} maxWidth="100%" w="100%">
                <Comp showAppropriateModal={showAppropriateModal} isProUser={isProUser} />
              </View>
            </XStack>
          </ContainerBento>
        </YStack>
      </BentoPageFrame>
    </CurrentRouteProvider>
  )
}

export const DetailHeader = (props: { children: string }) => {
  const bentoStore = useBentoStore()
  const { section, part } = useParts()
  const category = (typeof section === 'string' ? section : section?.[0]) || ''
  const subCategory = (typeof part === 'string' ? part : part?.[0]) || ''

  return (
    <YStack top={0} gap="$4" px="$4" py="$4">
      <YStack gap="$4">
        <XStack ai="center" jc="space-between" $sm={{ fd: 'column' }}>
          <H1 ff="$mono" size="$11" $sm={{ size: '$9', mb: '$4' }}>
            {props.children}
          </H1>

          {/* <YStack zi={100} mb={-50} gap="$6" $sm={{ mb: 40 }}> */}
          <YStack
            ai="flex-end"
            zi={100}
            gap="$6"
            y={40}
            mt={-10}
            $sm={{ y: 0, mt: 0, mb: 40, ai: 'center' }}
          >
            <XStack gap="$4">
              <DropTamaguiConfig />

              <Button
                icon={bentoStore.disableTint ? CircleDashed : Paintbrush}
                size="$3"
                br="$6"
                onPress={() => {
                  startTransition(() => {
                    bentoStore.disableTint = !bentoStore.disableTint
                  })
                }}
              >
                {bentoStore.disableTint ? 'Dark/Light' : 'Tinted'}
              </Button>
            </XStack>
          </YStack>
        </XStack>

        <XStack p={0.5} ai="center" gap="$2">
          <Link href="/bento/">
            <Anchor ff="$mono" tag="span" textTransform="capitalize">
              Bento
            </Anchor>
          </Link>

          <SizableText theme="alt1" tag="span" selectable={false} size="$2">
            &raquo;
          </SizableText>

          <Link href={`/bento#${category}`}>
            <Anchor ff="$mono" tag="span" textTransform="capitalize">
              {category}
            </Anchor>
          </Link>

          <SizableText theme="alt1" tag="span" selectable={false} size="$2">
            &raquo;
          </SizableText>

          <Link href={`/bento/${category}/${subCategory}`}>
            <Anchor ff="$mono" tag="span" textTransform="capitalize">
              {subCategory.replace('_', ' ').replace('#', '')}
            </Anchor>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  )
}

const SideBar = styled(YStack, {
  position: 'sticky' as any,
  top: '$12',
  gap: '$8',
  px: '$8',
  $lg: { dsp: 'none' },
})
