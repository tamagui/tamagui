import { CurrentRouteProvider, Data, Sections } from '@tamagui/bento'
import { listingData } from '~/components/bento-showcase/data'
import { CircleDashed, Paintbrush } from '@tamagui/lucide-icons'
import { useToastController } from '@tamagui/toast/v1'
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
import { HeadInfo } from '~/components/HeadInfo'
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

  const isProUser = userData?.accessInfo?.hasPro

  if (!Comp) {
    return null
  }

  return (
    <CurrentRouteProvider section={section} part={part}>
      <HeadInfo
        title={`${section} / ${part} - Tamagui Bento`}
        description={`Copy-paste ${section} ${part} component for React Native and Web`}
        openGraph={{
          images: [{ url: '/bento/social.png' }],
        }}
      />
      <BentoPageFrame>
        <ContainerBento>
          <DetailHeader>{`${section[0].toUpperCase()}${section.slice(1)}`}</DetailHeader>
        </ContainerBento>

        <YStack py="$8" pb="$16" position="relative">
          <YStack pointerEvents="none" fullscreen className="bg-grid" opacity={0.033} />
          <ContainerBento>
            <XStack position="relative" t={0}>
              <View className="sticky">
                <SideBar items="flex-end">
                  {listingData.sections.map(({ parts, sectionName }, index) => (
                    <YStack key={`${sectionName}-${name}`} items="flex-end" gap="$4">
                      <XStack
                        onPress={() => {
                          navigator?.clipboard?.writeText?.(
                            `${window.location.hostname}/bento#${sectionName}`
                          )

                          toast.show('Link copied to clipboard')
                        }}
                        gap="$2"
                        items="center"
                      >
                        <Text fontFamily="$mono" color="$color12" text="right" px="$2">
                          {sectionName[0].toUpperCase()}
                          {sectionName.slice(1)}
                        </Text>
                      </XStack>

                      <YStack items="flex-end" gap="$2">
                        {parts.map((partItem, index) => {
                          const { route, name } = partItem
                          const active = route === `/${section}/${part}`

                          return (
                            <Link
                              key={`${sectionName}-${name}`}
                              href={`/bento${route}` as Href}
                            >
                              <View
                                position="relative"
                                py="$2"
                                items="center"
                                justify="center"
                                gap="$2"
                                flex={1}
                              >
                                <Paragraph
                                  fontFamily="$mono"
                                  fontWeight="500"
                                  text="right"
                                  color={active ? '$accentColor' : '$color10'}
                                  px="$2"
                                >
                                  {name}
                                </Paragraph>
                                <View
                                  position="absolute"
                                  inset={0}
                                  opacity={active ? 1 : 0}
                                  hoverStyle={{
                                    borderRightColor: '$accentColor',
                                    opacity: 1,
                                  }}
                                  justify="center"
                                  items="flex-end"
                                >
                                  <View
                                    height="70%"
                                    width={2}
                                    rounded="$10"
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

              <View flex={1} maxW="100%" width="100%">
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
    <YStack t={0} gap="$4" px="$4" py="$4">
      <YStack gap="$4">
        <XStack items="center" justify="space-between" $sm={{ flexDirection: 'column' }}>
          <H1 fontFamily="$mono" size="$11" $sm={{ size: '$9', mb: '$4' }}>
            {props.children}
          </H1>

          <YStack
            items="flex-end"
            z={100}
            gap="$6"
            y={40}
            mt={-10}
            $sm={{ y: 0, mt: 0, mb: 40, items: 'center' }}
          >
            <XStack gap="$4">
              <DropTamaguiConfig />

              <Button
                icon={bentoStore.disableTint ? Paintbrush : CircleDashed}
                size="$3"
                rounded="$6"
                onPress={() => {
                  startTransition(() => {
                    bentoStore.disableTint = !bentoStore.disableTint
                  })
                }}
              >
                {bentoStore.disableTint ? 'Tinted' : 'Dark/Light'}
              </Button>
            </XStack>
          </YStack>
        </XStack>

        <XStack p={0.5} items="center" gap="$2">
          <Link href="/bento/">
            <Anchor
              fontFamily="$mono"
              render="span"
              textTransform="capitalize"
              color="$color9"
            >
              Bento
            </Anchor>
          </Link>

          <SizableText color="$color9" render="span" select="none" size="$2">
            &raquo;
          </SizableText>

          <Link href={`/bento#${category}`}>
            <Anchor
              fontFamily="$mono"
              render="span"
              textTransform="capitalize"
              color="$color9"
            >
              {category}
            </Anchor>
          </Link>

          <SizableText color="$color9" render="span" select="none" size="$2">
            &raquo;
          </SizableText>

          <Link href={`/bento/${category}/${subCategory}`}>
            <Anchor
              fontFamily="$mono"
              render="span"
              textTransform="capitalize"
              color="$color9"
            >
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
  t: '$12',
  gap: '$8',
  px: '$8',
  $lg: { display: 'none' },
})
