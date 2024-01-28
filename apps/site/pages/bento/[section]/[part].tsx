import * as sections from '@tamagui/bento'
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
    <ContainerLarge>
      <Comp codes={codes} />
    </ContainerLarge>
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
