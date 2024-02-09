import * as sections from '@tamagui/bento'

import { Anchor, H1, Spacer, Theme, XStack, YStack } from 'tamagui'
import { BentoPageFrame } from '../../../components/BentoPageFrame'

import type { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import { BentoLogo } from '../../../components/BentoLogo'
import { ContainerLarge } from '../../../components/Container'
import { getDefaultLayout } from '../../../lib/getDefaultLayout'

export default function page({ codes }) {
  if (!process.env.NEXT_PUBLIC_IS_TAMAGUI_DEV) {
    return null
  }

  const router = useRouter()
  const params = router.query as { section: string; part: string }
  const Comp = sections[params.section][params.part]

  return (
    <>
      <BentoPageFrame>
        <ContainerLarge>
          <DetailHeader>
            {`${params.section[0].toUpperCase()}${params.section.slice(1)}`}
          </DetailHeader>
        </ContainerLarge>
      </BentoPageFrame>
      <ContainerLarge bg="$background">
        <Comp codes={codes} />
      </ContainerLarge>
    </>
  )
}

page.getLayout = getDefaultLayout

export const getStaticPaths = (async () => {
  return {
    paths: sections.paths,
    fallback: false,
  }
}) satisfies GetStaticPaths

export const getStaticProps = (ctx) => {
  const { section, part } = ctx.params as { section: string; part: string }
  const getCodes = sections[section][`${part}GetComponentCodes`]

  return {
    props: getCodes(),
  }
}

export const DetailHeader = (props: { children: string }) => {
  return (
    <YStack pt="$12" pb="$6" gap="$4">
      <YStack gap="$4">
        <XStack ai="center" jc="space-between">
          <Theme reset>
            <H1 size="$12">{props.children}</H1>
          </Theme>

          <YStack scale={0.5} m={-150}>
            <BentoLogo />
          </YStack>
        </XStack>

        <XStack p={0.5} ai="center" gap="$2">
          <Anchor>Section</Anchor>
          <Anchor size="$2">{'>'}</Anchor>
          <Anchor>Inputs</Anchor>
        </XStack>
      </YStack>
    </YStack>
  )
}
