import * as sections from '@tamagui/bento'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

export default function page() {
  const router = useRouter()
  const params = router.query
  const Comp = sections[params.section][params.part]

  return <Comp />
}

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          section: 'forms',
          part: 'inputs',
        },
      },
    ],
    fallback: false,
  }
}) satisfies GetStaticPaths

export const getStaticProps = () => {
  return {
    props: { repo: '' },
  }
}
