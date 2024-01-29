import * as sections from '@tamagui/bento'

import { ThemeTint } from '@tamagui/logo'
import { Anchor, H1, Spacer, XStack, YStack } from 'tamagui'
import { BentoPageFrame } from '../../../components/BentoPageFrame'

import type { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

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
    <BentoPageFrame>
      <ContainerLarge>
        <DetailHeader>Test header</DetailHeader>
        <Spacer />
        <Spacer />
        <YStack>
          <Comp codes={codes} />
        </YStack>
      </ContainerLarge>
    </BentoPageFrame>
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
    <YStack pt="$10" gap="$4">
      <YStack gap="$4">
        <ThemeTint>
          <H1
            className="text-3d"
            ff="$cherryBomb"
            color="$color10"
            maw="100%"
            f={1}
            size="$9"
            pos="absolute"
            t="$2"
            r="$2"
          >
            BENTO
          </H1>
        </ThemeTint>

        <H1 size="$12">{props.children}</H1>

        <XStack theme="alt2" ai="center" gap="$2">
          <Anchor>Section</Anchor>
          <Anchor size="$2">{'>'}</Anchor>
          <Anchor>Inputs</Anchor>
        </XStack>
      </YStack>
    </YStack>
  )
}
