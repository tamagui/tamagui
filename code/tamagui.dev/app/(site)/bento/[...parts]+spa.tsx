import { CurrentRouteProvider } from '@tamagui/bento'
import { bentoDemos } from '@tamagui/bento/demos'
import {
  type BentoDemo,
  bentoGroups,
  bentoSections,
  getBentoGroup,
} from '@tamagui/bento/registry'
import {
  Showcase,
  ShowcaseChildWrapper,
  WithSize,
} from '~/components/bento-showcase/_Showcase'
import { CircleDashed, Paintbrush } from '~/components/icons'
import type { Href } from 'one'
import { Link, useParams } from 'one'
import { startTransition } from 'react'
import {
  Anchor,
  H1,
  Paragraph,
  SizableText,
  styled,
  Text,
  toast,
  View,
  XStack,
  YStack,
  Theme,
} from 'tamagui'
import { Button } from '~/components/Button'
import { ContainerBento } from '~/components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import { useBentoStore } from '~/features/bento/BentoStore'
import { DropTamaguiConfig } from '~/features/bento/DropTamaguiConfig'

export const generateStaticParams = async () => {
  return bentoGroups.map(({ section, group }) => ({
    parts: `${section}/${group}`,
  }))
}

function useParts() {
  const { parts } = useParams() as { parts: string[] }
  const [section, part] = parts
  return { section, part }
}

export default function BentoPage() {
  const { section, part } = useParts()
  const group = getBentoGroup(section, part)

  if (!group) {
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

        <YStack paddingTop="11" pb="36" position="relative">
          <YStack
            pointerEvents="none"
            position="absolute"
            inset={0}
            className="bg-grid"
            opacity={0.033}
          />
          <ContainerBento>
            <XStack position="relative" t={0}>
              <View className="sticky">
                <SideBar items="flex-end">
                  {bentoSections.map(
                    ({ section: sectionName, name: sectionTitle, groups }) => (
                      <YStack key={sectionName} items="flex-end" gap="4">
                        <XStack
                          onPress={() => {
                            navigator?.clipboard?.writeText?.(
                              `${window.location.hostname}/bento#${sectionName}`
                            )

                            toast('Link copied to clipboard')
                          }}
                          gap="1-5"
                          items="center"
                        >
                          <Text color="color-12" text="right" px="1-5">
                            {sectionTitle}
                          </Text>
                        </XStack>

                        <YStack items="flex-end" gap="1-5">
                          {groups.map(({ group: groupName, name }) => {
                            const route = `/${sectionName}/${groupName}`
                            const active = route === `/${section}/${part}`

                            return (
                              <Link
                                key={`${sectionName}-${name}`}
                                href={`/bento${route}` as Href}
                              >
                                <View
                                  position="relative"
                                  py="1-5"
                                  items="center"
                                  justify="center"
                                  gap="1-5"
                                  flex={1}
                                >
                                  <Paragraph
                                    fontWeight="500"
                                    text="right"
                                    color={`${active ? 'accent-color' : 'color-10'}`}
                                    px="1-5"
                                  >
                                    {name}
                                  </Paragraph>
                                  <View
                                    position="absolute"
                                    inset={0}
                                    opacity={`${active ? 1 : 0} hover:1`}
                                    borderRightColor="hover:accent-color"
                                    justify="center"
                                    items="flex-end"
                                  >
                                    <View
                                      height="70%"
                                      width={2}
                                      rounded="10"
                                      bg="accent-color"
                                      x={5}
                                    />
                                  </View>
                                </View>
                              </Link>
                            )
                          })}
                        </YStack>
                      </YStack>
                    )
                  )}
                </SideBar>
              </View>

              <View flex={1} maxW="100%" width="100%">
                <YStack gap="88px" px="1-5 xl:0" py="1-5 xl:0">
                  {group.demos.map((demo) => (
                    <BentoDemoShowcase
                      key={demo.file}
                      demo={demo}
                      Demo={bentoDemos[`${section}/${part}`][demo.component]}
                    />
                  ))}
                </YStack>
              </View>
            </XStack>
          </ContainerBento>
        </YStack>
      </BentoPageFrame>
    </CurrentRouteProvider>
  )
}

function BentoDemoShowcase({
  demo,
  Demo,
}: {
  demo: BentoDemo
  Demo: React.ComponentType<any>
}) {
  const { frame = 'center' } = demo
  const preview = demo.sizable ? (
    <WithSize>
      <Demo />
    </WithSize>
  ) : (
    <Demo />
  )

  return (
    <Showcase
      fileName={demo.file}
      title={demo.title}
      short={demo.short}
      defaultSize={demo.defaultSize}
    >
      {frame === 'bleed' ? (
        preview
      ) : (
        <ShowcaseChildWrapper {...(frame === 'flush' && { p: 0 })}>
          {preview}
        </ShowcaseChildWrapper>
      )}
    </Showcase>
  )
}

export const DetailHeader = (props: { children: string }) => {
  const bentoStore = useBentoStore()
  const { section, part } = useParts()
  const category = (typeof section === 'string' ? section : section?.[0]) || ''
  const subCategory = (typeof part === 'string' ? part : part?.[0]) || ''

  return (
    <YStack t={0} gap="4" px="4" py="4">
      <YStack gap="4">
        <XStack items="center" justify="space-between" flexDirection="max-md:column">
          <H1 fontSize="max-md:9" lineHeight="max-md:9" mb="max-md:4" size="11">
            {props.children}
          </H1>

          <YStack
            items="flex-end max-md:center"
            z={100}
            gap="8"
            y="40px max-md:0"
            mt="-10px max-md:0px"
            mb="max-md:40px"
          >
            <XStack gap="4">
              <DropTamaguiConfig />

              <Button
                icon={bentoStore.disableTint ? Paintbrush : CircleDashed}
                size="sm"
                rounded="6"
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

        <XStack p={0.5} items="center" gap="1-5">
          <Link href="/bento/">
            <Anchor textTransform="capitalize" color="color-9" render="span">
              Bento
            </Anchor>
          </Link>

          <SizableText color="color-9" select="none" render="span" size="2">
            &raquo;
          </SizableText>

          <Link href={`/bento#${category}`}>
            <Anchor textTransform="capitalize" color="color-9" render="span">
              {category}
            </Anchor>
          </Link>

          <SizableText color="color-9" select="none" render="span" size="2">
            &raquo;
          </SizableText>

          <Link href={`/bento/${category}/${subCategory}`}>
            <Anchor textTransform="capitalize" color="color-9" render="span">
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
  t: '88px',
  gap: '11',
  px: '11',
  display: 'max-xl:none',
})
