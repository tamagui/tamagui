import type { Href } from 'one'
import { CurrentRouteProvider, Data, Sections } from '@tamagui/bento'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { CircleDashed, Paintbrush } from '@tamagui/lucide-icons'
import { Toast, useToastState } from '@tamagui/toast'
import { startTransition } from 'react'
import {
  Anchor,
  Button,
  H1,
  SizableText,
  styled,
  Theme,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { Link, useParams } from 'one'
import { ContainerBento } from '~/components/Containers'
import { BentoLogo } from '~/features/bento/BentoLogo'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import { useBentoStore } from '~/features/bento/BentoStore'
import { DropTamaguiConfig } from '~/features/bento/DropTamaguiConfig'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'
import { listingData } from '@tamagui/bento/data'
import { Text } from 'tamagui'

import { ScrollView } from 'react-native'

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
  const bentoStore = useBentoStore()
  const Comp = Sections?.[section]?.[part]

  if (!Comp) {
    return null
  }

  return (
    <CurrentRouteProvider section={section} part={part}>
      <ThemeNameEffect />
      <BentoPageFrame>
        <ContainerBento>
          <DetailHeader>{`${section[0].toUpperCase()}${section.slice(1)}`}</DetailHeader>
        </ContainerBento>

        <ThemeTint key={bentoStore.disableTint as any} disable={bentoStore.disableTint}>
          <YStack py="$8" bg="$background">
            <YStack pe="none" fullscreen className="bg-grid" o={0.033} />
            <ContainerBento>
              <XStack pos="relative" top={0}>
                <View className="sticky">
                  <SideBar ai="flex-end">
                    {listingData.sections.map(({ parts, sectionName }, index) => (
                      <ThemeTintAlt key={`${sectionName}-${name}`} offset={index}>
                        <YStack ai="flex-end" gap="$4" key={sectionName}>
                          <Text
                            textTransform="uppercase"
                            ff="$silkscreen"
                            color="$color10"
                            textAlign="right"
                            px="$2"
                          >
                            {sectionName}
                          </Text>

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
                                    py="$2"
                                    px="$2"
                                    borderRightWidth={2}
                                    borderRightColor={
                                      active ? '$accentColor' : '$background0'
                                    }
                                    hoverStyle={{ borderRightColor: '$color' }}
                                    ai="center"
                                    gap="$2"
                                    flex={1}
                                  >
                                    <Text
                                      textAlign="right"
                                      color={active ? '$accentColor' : '$color10'}
                                    >
                                      {name}
                                    </Text>
                                  </View>
                                </Link>
                              )
                            })}
                          </YStack>
                        </YStack>
                      </ThemeTintAlt>
                    ))}
                  </SideBar>
                </View>

                <View w="100%" flex={1}>
                  <Comp />
                </View>
              </XStack>
              <CurrentToast />
            </ContainerBento>
          </YStack>
        </ThemeTint>
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
    <YStack gap="$4" $sm={{ px: '$4' }} pb="$4">
      <YStack gap="$4">
        <XStack ai="center" jc="space-between" $sm={{ fd: 'column-reverse' }}>
          <Theme name="gray">
            <H1 mb={-50} ff="$silkscreen" size="$10" $sm={{ size: '$6', mb: '$4' }}>
              {props.children}
            </H1>
          </Theme>

          {/* <YStack zi={100} mb={-50} gap="$6" $sm={{ mb: 40 }}> */}
          <YStack
            ai="flex-end"
            zi={100}
            gap="$6"
            y={40}
            mt={-10}
            $sm={{ y: 0, mt: 0, mb: 40, ai: 'center' }}
          >
            <View x={30}>
              <BentoLogo scale={0.25} />
            </View>

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
            <Anchor tag="span" textTransform="capitalize">
              Bento
            </Anchor>
          </Link>

          <SizableText theme="alt1" tag="span" selectable={false} size="$2">
            &raquo;
          </SizableText>

          {/* TODO for some reason these break [vite:build-import-analysis */}
          <Link href={`/bento#${category}`}>
            <Anchor tag="span" textTransform="capitalize">
              {category}
            </Anchor>
          </Link>

          <SizableText theme="alt1" tag="span" selectable={false} size="$2">
            &raquo;
          </SizableText>

          {/* TODO for some reason these break [vite:build-import-analysis */}
          <Link href={`/bento/${subCategory}`}>
            <Anchor tag="span" textTransform="capitalize">
              {subCategory.replace('_', ' ').replace('#', '')}
            </Anchor>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  )
}

const CurrentToast = () => {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) {
    return null
  }

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="100ms"
      viewportName={currentToast.viewportName}
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}

const SideBar = styled(YStack, {
  position: 'sticky' as any,
  top: '$12',
  gap: '$8',
  px: '$8',
  $lg: { dsp: 'none' },
})
