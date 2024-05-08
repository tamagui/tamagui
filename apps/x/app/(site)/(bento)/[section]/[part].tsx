import { Data, Sections } from '@tamagui/bento'
import { Toast, useToastState } from '@tamagui/toast'
import { Link, useLocalSearchParams, useRouter } from '@vxrn/router'
import { Anchor, H1, SizableText, Theme, View, XStack, YStack } from 'tamagui'
import { ContainerBento } from '~/components/Containers'
import { BentoLogo } from '~/features/bento/BentoLogo'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export const generateStaticParams = async () => {
  return Data.paths.map((x) => x.params)
}

// export const loader = (ctx) => {
//   // const { section, part } = ctx.params as { section: string; part: string }
//   // const getCodes = Sections[section][`${part}GetComponentCodes`]

//   return {
//     // props: getCodes(),
//     props: {},
//   }
// }

export default function page() {
  const params = useLocalSearchParams() as { section: string; part: string }
  const Comp = Sections[params.section][params.part]

  return (
    <>
      <ThemeNameEffect />
      {/* <DropTamaguiConfig /> */}

      <BentoPageFrame>
        <ContainerBento>
          <DetailHeader>
            {`${params.section[0].toUpperCase()}${params.section.slice(1)}`}
          </DetailHeader>
        </ContainerBento>
        <YStack>
          <YStack pe="none" fullscreen className="bg-grid" o={0.033} />
          <ContainerBento>
            <Comp />
            <CurrentToast />
          </ContainerBento>
        </YStack>

        <YStack h={200} />
      </BentoPageFrame>
    </>
  )
}

export const DetailHeader = (props: { children: string }) => {
  const params = useLocalSearchParams() as { section: string; part: string }
  const category =
    (typeof params.section === 'string' ? params.section : params.section?.[0]) || ''
  const subCategory =
    (typeof params.part === 'string' ? params.part : params.part?.[0]) || ''

  return (
    <YStack gap="$4" $sm={{ px: '$4' }} pb="$11">
      <YStack gap="$4">
        <XStack ai="center" jc="space-between" $sm={{ fd: 'column-reverse' }}>
          <Theme name="gray">
            <H1 ff="$silkscreen" size="$10" $sm={{ size: '$6' }}>
              {props.children}
            </H1>
          </Theme>

          {/* <YStack zi={100} mb={-50} gap="$6" $sm={{ mb: 40 }}> */}
          <YStack zi={100} gap="$6" $sm={{ mb: 40 }}>
            <View $gtLg={{ right: '$-6' }}>
              <BentoLogo scale={0.3} />
            </View>
            {/* <DropTamaguiConfig /> */}
          </YStack>
        </XStack>

        <XStack p={0.5} ai="center" gap="$2">
          <Link href="/bento/">
            <Anchor tag="span" textTransform="capitalize">
              Bento
            </Anchor>
          </Link>

          <SizableText theme="alt1" tag="span" selectable={false} size="$2">
            {'>'}
          </SizableText>

          <Link href={`/bento#${category}`}>
            <Anchor tag="span" textTransform="capitalize">
              {category}
            </Anchor>
          </Link>

          <SizableText theme="alt1" tag="span" selectable={false} size="$2">
            {'>'}
          </SizableText>

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

  if (!currentToast || currentToast.isHandledNatively) return null
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
