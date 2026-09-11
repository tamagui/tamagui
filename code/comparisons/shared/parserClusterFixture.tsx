// frozen parser-cluster fixture shared by measurement builds
import { styled, View } from 'tamagui'

const ParserClusterParent = styled(
  View,
  {
    variants: {
      tone: {
        warm: {
          backgroundColor: 'rgb(253,186,116) web:rgb(249,115,22) hover:rgb(234,88,12)',
          borderColor: 'rgb(154,52,18) press:rgb(124,45,18)',
        },
        cool: {
          backgroundColor: 'rgb(147,197,253) web:rgb(59,130,246) hover:rgb(37,99,235)',
          borderColor: 'rgb(30,64,175) press:rgb(30,58,138)',
        },
      },
    },
  } as any,
  { acceptsClassName: false }
)

const ParserClusterChild = styled(
  ParserClusterParent,
  {
    variants: {
      tone: {
        warm: {
          backgroundColor: 'rgb(251,146,60) focus:rgb(234,88,12)',
          borderColor: 'rgb(194,65,12) web:rgb(154,52,18)',
        },
        cool: {
          backgroundColor: 'rgb(96,165,250) focus:rgb(37,99,235)',
          borderColor: 'rgb(29,78,216) web:rgb(30,64,175)',
        },
      },
    },
  } as any,
  { acceptsClassName: false }
)

export function ParserClusterFixture() {
  return (
    <ParserClusterChild
      tone="warm"
      width="24px web:28px sm:32px"
      height="24px web:28px hover:30px"
    />
  )
}
