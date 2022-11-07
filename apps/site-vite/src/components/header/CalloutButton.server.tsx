import { Tag } from '@tamagui/lucide-icons'
import { Link } from '@tamagui/unagi'
import React from 'react'
import { Button, SizableText, Text } from 'tamagui'

import { useTint } from './ColorToggleButton.client'

export const CalloutButton = () => {
  // if (process.env.STUDIO_ON === '1') {
  //   const router = useRouter()
  //   const isTakeout = router.pathname.startsWith('/takeout')
  //   const isTakeoutPurchase = router.pathname.startsWith('/takeout/purchase')
  //   const { tint } = useTint()

  //   return (
  //     <>
  //       <NextLink legacyBehavior href={isTakeoutPurchase ? '/takeout' : isTakeout ? '/' : '/takeout'}>
  //         <Button
  //           rotate="1.25deg"
  //           // @ts-ignore
  //           theme={`${tint}_alt2`}
  //           fontWeight="600"
  //           cursor="pointer"
  //           mx="$1"
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

  return (
    <Link to="/blog/tamagui-enters-beta-themes-and-animations">
      <Button
        accessibilityLabel="Beta blog post"
        rotate="1.25deg"
        mx="$2"
        theme="pink_alt2"
        cursor="pointer"
        opacity={0.9}
        hoverStyle={{ opacity: 1 }}
        size="$2"
        icon={Tag}
        $sm={{ dsp: 'none' }}
      >
        Beta
      </Button>
    </Link>
  )
}
