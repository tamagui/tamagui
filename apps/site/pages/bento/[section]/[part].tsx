// import * as sections from '@tamagui/bento'
// import { GetStaticPaths } from 'next'
// import { useRouter } from 'next/router'

export default function page() {
  return <div>soon....</div>
}

// export default function page({ codes }) {
//   const router = useRouter()
//   const params = router.query as { section: string; part: string }
//   const Comp = sections[params.section][params.part]

//   return <Comp codes={codes} />
// }

// export const getStaticPaths = (async () => {
//   return {
//     paths: [
//       {
//         params: {
//           section: 'forms',
//           part: 'inputs',
//         },
//       },
//     ],
//     fallback: false,
//   }
// }) satisfies GetStaticPaths

// export const getStaticProps = (ctx) => {
//   const { section, part } = ctx.params as { section: string; part: string }
//   const getCodes = sections[section][`${part}GetComponentCodes`]

//   return {
//     props: getCodes(),
//   }
// }
