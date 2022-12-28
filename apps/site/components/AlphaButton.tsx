import { NextLink } from 'components/NextLink'
import { Button, useMedia } from 'tamagui'

export const AlphaButton = () => {
  const media = useMedia()

  if (media.md) {
    return null
  }

  return (
    <NextLink href="/blog/version-one">
      <Button
        accessibilityLabel="Tamagui v1 blog post"
        rotate="-4deg"
        theme="alt1"
        cursor="pointer"
        opacity={0.9}
        hoverStyle={{ opacity: 1 }}
        size="$2"
        scale={0.9}
        $sm={{ dsp: 'none' }}
      >
        1.0 🎉
      </Button>
    </NextLink>
  )
}

// if (process.env.STUDIO_ON === '1') {
//   const router = useRouter()
//   const isTakeout = router.pathname.startsWith('/takeout')
//   const isTakeoutPurchase = router.pathname.startsWith('/takeout/purchase')
//   const { tint } = useTint()

//   return (
//     <>
//       <NextLink href={isTakeoutPurchase ? '/takeout' : isTakeout ? '/' : '/takeout'} passHref>
//         <Button
//           rotate="1.25deg"
//           // @ts-ignore
//           theme={`${tint}_alt2`}
//           fontWeight="600"
//           cursor="pointer"
//           mx="$1"
//           tag="a"
//           size="$2"
//           icon={
//             isTakeout ? null : (
//               <Text fontSize={20} y={1}>
//                 🥡
//               </Text>
//             )
//           }
//         >
//           <SizableText size="$2" $sm={{ width: 0, height: 0, overflow: 'hidden', mx: -2.5 }}>
//             {isTakeout ? (
//               <SizableText fow="500" size="$2">
//                 &laquo; Back
//               </SizableText>
//             ) : (
//               'Takeout'
//             )}
//           </SizableText>
//         </Button>
//       </NextLink>
//     </>
//   )
// }
