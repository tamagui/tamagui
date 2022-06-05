import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Button, SizableText, Text, YStack } from 'tamagui'

import { useTint } from './ColorToggleButton'

export const AlphaButton = () => {
  const router = useRouter()
  const isTakeout = router.pathname.startsWith('/takeout')
  const isTakeoutPurchase = router.pathname.startsWith('/takeout/purchase')
  const { tint } = useTint()

  return (
    <>
      <NextLink href={isTakeoutPurchase ? '/takeout' : isTakeout ? '/' : '/takeout'} passHref>
        <Button
          rotate="1.25deg"
          // @ts-ignore
          theme={`${tint}_alt2`}
          fontWeight="600"
          cursor="pointer"
          mx="$1"
          tag="a"
          size="$2"
          icon={
            isTakeout ? null : (
              <Text fontSize={20} y={1}>
                🥡
              </Text>
            )
          }
        >
          <SizableText size="$2" $sm={{ width: 0, height: 0, overflow: 'hidden', mx: -2.5 }}>
            {isTakeout ? (
              <SizableText fow="500" size="$2">
                &laquo; Back
              </SizableText>
            ) : (
              'Takeout'
            )}
          </SizableText>
        </Button>
      </NextLink>
    </>
  )
}
