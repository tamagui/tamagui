import * as sections from '@tamagui/bento'

import { Anchor, H1, Theme, XStack, YStack } from 'tamagui'
import { BentoPageFrame } from '../../../components/BentoPageFrame'

import type { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import { BentoLogo } from '../../../components/BentoLogo'
import { ContainerBento } from '../../../components/Container'
import { getDefaultLayout } from '../../../lib/getDefaultLayout'
import Link from 'next/link'
import { Footer } from '../../../components/Footer'

export default function page() {
  const router = useRouter()
  const params = router.query as { section: string; part: string }
  const Comp = sections[params.section][params.part]

  return (
    <>
      <BentoPageFrame simpler>
        <ContainerBento>
          <DetailHeader>
            {`${params.section[0].toUpperCase()}${params.section.slice(1)}`}
          </DetailHeader>
        </ContainerBento>
      </BentoPageFrame>

      <YStack>
        <YStack pe="none" fullscreen className="bg-grid" />
        <ContainerBento>
          <Comp />
        </ContainerBento>
      </YStack>

      <Footer />
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
  // const { section, part } = ctx.params as { section: string; part: string }
  // const getCodes = sections[section][`${part}GetComponentCodes`]

  return {
    // props: getCodes(),
    props: {},
  }
}

export const DetailHeader = (props: { children: string }) => {
  const { asPath } = useRouter()
  const [category, subCategory] = asPath.split('bento/')[1].split('/')

  return (
    <YStack pb="$6" gap="$4">
      <YStack gap="$4">
        <XStack ai="center" jc="space-between">
          <Theme name="gray">
            <H1 size="$12">{props.children}</H1>
          </Theme>

          <YStack scale={0.25} m={-150}>
            <BentoLogo />
          </YStack>
        </XStack>

        <XStack p={0.5} ai="center" gap="$2">
          <Link href="/bento/">
            <Anchor textTransform="capitalize">Bento</Anchor>
          </Link>

          <Anchor selectable={false} size="$2">
            {'>'}
          </Anchor>

          <Link href={`/bento#${category}`}>
            <Anchor textTransform="capitalize">{category}</Anchor>
          </Link>

          <Anchor selectable={false} size="$2">
            {'>'}
          </Anchor>

          <Link href={`/bento/${subCategory}`}>
            <Anchor textTransform="capitalize">{subCategory.replace('_', ' ')}</Anchor>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  )
}
